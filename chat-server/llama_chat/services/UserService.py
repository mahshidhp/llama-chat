from llama_chat.DAO.UserDAO import UserDAO
from llama_chat.Exceptions.UsernameAlreadyExist import UsernameAlreadyExist
from llama_chat.Exceptions.UserNotFound import UserNotFound
from llama_chat.Exceptions.InvalidFileType import InvalidFileType

from flask import send_from_directory
from werkzeug.utils import secure_filename
from dotenv import dotenv_values
import os


config = dotenv_values('.env')
static_dir = config["STATIC_DIR"]
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


class UserService:
    def __init__(self, user):
        self.user = user

    @staticmethod
    def signup(username, password):
        user = UserDAO.get_by_username(username)
        if user:
            raise UsernameAlreadyExist
        UserDAO.create(username, password)

    def update_profile(self, profile):
        UserDAO(self.user).update(profile)

    @staticmethod
    def get_user_by_id(user_id):
        user = UserDAO.get_by_id(user_id)
        if not user:
            raise UserNotFound
        return user.serialize()

    @staticmethod
    def get_user_by_username(username):
        user = UserDAO.get_by_username(username)
        if not user:
            raise UserNotFound
        return user.serialize()

    def add_contact(self, contact_username):
        new_contact = UserDAO.get_by_username(contact_username)
        if not new_contact:
            raise UserNotFound
        UserDAO(self.user).add_contact(new_contact)
        return new_contact.serialize()

    def get_contacts(self):
        contacts = UserDAO(self.user).get_contacts()
        contacts_serialized = [contact.serialize() for contact in contacts]
        return contacts_serialized

    def set_profile_pic(self, profile_pic):
        if not self.is_file_allowed(profile_pic.filename):
            raise InvalidFileType
        file_name = secure_filename(self.user.username + '.jpeg')
        image_path = os.path.join(static_dir, file_name)
        profile_pic.save(image_path)

    @staticmethod
    def is_file_allowed(filename):
        return '.' in filename and filename.split('.')[-1].lower() in ALLOWED_EXTENSIONS

    @staticmethod
    def get_profile_pic(username):
        file_name = username + '.jpeg'
        image_path = os.path.join(static_dir, file_name)
        if os.path.isfile(image_path):
            return send_from_directory(static_dir, file_name)
