import jwt
from dotenv import dotenv_values
from datetime import datetime, timedelta

from llama_chat.services.UserService import UserService
from llama_chat.DAO.UserDAO import UserDAO
from llama_chat.Exceptions.InvalidCredentials import InvalidCredentials

config = dotenv_values('.env')
jwt_key = config['JWT_KEY']


class AuthService:
    def __init__(self):
        self.user = None

    def login(self, username, password):
        is_valid = self.validate_credentials(username, password)
        if not is_valid:
            raise InvalidCredentials
        user_jwt = self.generate_jwt()
        return user_jwt

    def validate_credentials(self, username, password):
        self.user = UserDAO.get_by_username(username)
        if not self.user or self.user.password != password:
            return False
        return True

    def login_with_jwt(self, user_jwt):
        self.user = self.get_user_using_jwt(user_jwt)
        return self.user

    def generate_jwt(self):
        data = {
            "id": self.user.id,
            "username": self.user.username,
            "iat": datetime.now(),
            "exp": datetime.now() + timedelta(hours=12)
        }
        user_jwt = jwt.encode(data, jwt_key)
        return user_jwt

    def get_user_using_jwt(self, user_jwt):
        try:
            decoded_jwt = jwt.decode(user_jwt, jwt_key, algorithms=["HS256"], options={"verify_iat": False})
            user_id = decoded_jwt["id"]
            self.user = UserService.get_user_by_id(user_id)
            return self.user
        except KeyError:
            raise InvalidCredentials

