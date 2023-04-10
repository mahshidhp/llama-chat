from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO
from collections import defaultdict
from dotenv import dotenv_values
from functools import wraps

from services.AuthService import AuthService
from services.UserService import UserService
from services.MessageService import MessageService
from services.OnlineService import OnlineService

from Exceptions.InvalidCredentials import InvalidCredentials
from Exceptions.UsernameAlreadyExist import UsernameAlreadyExist
from Exceptions.UserNotFound import UserNotFound

from llama_chat.extenstions import db


config = dotenv_values(".env")
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = config["SQLALCHEMY_DATABASE_URI"]
db.init_app(app)
CORS(app)
app.config['SECRET_KEY'] = config['SECRET_KEY']
socketio = SocketIO(app, cors_allowed_origins='*', manage_session=True)


clients = defaultdict()


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        jwt_token = None
        if 'x-auth-token' in request.headers:
            jwt_token = request.headers['x-auth-token']
        if not jwt_token:
            return '', 401
        try:
            user = AuthService().login_with_jwt(jwt_token)
        except InvalidCredentials:
            return '', 401
        return f(user, *args, **kwargs)
    return decorator


# ----------------- Socket io events -----------------


@socketio.on('connected')
@token_required
def handle_new_connection(user):
    clients[user.username] = request.sid


@socketio.on('disconnect')
@token_required
def handle_disconnection(user):
    try:
        del clients[user.username]
    except KeyError:
        pass


@socketio.on('msg')
@token_required
def handle_message(user, msg):
    sender = msg["sender"]
    receiver = msg["receiver"]
    text = msg["text"]
    created_at = msg["createdAt"]

    if user.username != sender:
        raise InvalidCredentials

    new_msg = MessageService.send_message(sender, receiver, text, created_at)

    if receiver in clients:
        receiver_sid = clients[receiver]
        socketio.emit('msg', new_msg, to=receiver_sid)
    if sender in clients:
        sender_sid = clients[sender]
        socketio.emit('sent', new_msg, to=sender_sid)

    return new_msg


@socketio.on('heartbeat')
@token_required
def heartbeat(user):
    OnlineService.set_last_seen(user.username)


@socketio.on('last_seen')
def get_contacts_last_seen(data):
    contacts = data["contacts"]
    contacts_last_seen = OnlineService.get_bulk_last_seen(contacts)
    socketio.emit('last_seen', contacts_last_seen, to=request.sid)


# -------------------- REST APIs --------------------


@app.route("/login", methods=["POST"])
def login():
    try:
        req_body = request.get_json()
        username = req_body["username"]
        password = req_body["password"]
        jwt = AuthService().login(username, password)
        return jwt, 200
    except InvalidCredentials:
        return 'Invalid Credentials', 403


@app.route("/signup", methods=["POST"])
def signup():
    try:
        req_data = request.get_json()
        username = req_data["username"]
        password = req_data["password"]
        UserService.signup(username, password)
        jwt = AuthService().login(username, password)
        return jwt, 200
    except UsernameAlreadyExist:
        return 'Username already exist', 400


@app.route("/messages/<username>", methods=["GET"])
@cross_origin()
@token_required
def get_messages(user, username):
    try:
        page = request.args.get("page")
        contact = UserService.get_user_by_username(username)
        messages = MessageService.get_messages(user.id, contact["id"], page)
        return messages, 200
    except UserNotFound:
        return 'User not found', 404


@app.route("/user/<username>", methods=["GET", "POST"])
@cross_origin()
@token_required
def get_user(user, username):
    if request.method == "GET":
        user = UserService.get_user_by_username(username)
        return user, 200
    elif request.method == "POST":
        if user.username != username:
            return '', 403
        profile = request.get_json()
        UserService(user).update_profile(profile)
        return '', 200


@app.route("/user/profile-pic/<username>", methods=["GET"])
@cross_origin()
def get_profile_pic(username):
    response = UserService.get_profile_pic(username)
    if response:
        return response, 200
    return '', 404


@app.route("/user/profile-pic", methods=["POST"])
@cross_origin()
@token_required
def update_profile_pic(user):
    profile_pic = request.files["profile-pic"]
    UserService(user).set_profile_pic(profile_pic)
    return '', 200


@app.route("/contacts", methods=["GET", "POST"])
@cross_origin()
@token_required
def handle_contacts(user):
    try:
        if request.method == "GET":
            contacts = UserService(user).get_contacts()
            return contacts, 200
        elif request.method == "POST":
            req_body = request.get_json()
            contact_username = req_body["username"]
            contact = UserService(user).add_contact(contact_username)
            return contact, 200
    except UserNotFound:
        return "", 404


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    socketio.run(app, allow_unsafe_werkzeug=True, port=5001, debug=True)
