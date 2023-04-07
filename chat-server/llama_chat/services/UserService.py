from llama_chat.DAO.UserDAO import UserDAO
from llama_chat.Exceptions.UsernameAlreadyExist import UsernameAlreadyExist
from llama_chat.Exceptions.UserNotFound import UserNotFound


class UserService:
    def __init__(self, user):
        self.user = user

    @staticmethod
    def signup(username, password):
        already_exist = UserDAO.get_by_username(username)
        if already_exist:
            raise UsernameAlreadyExist
        UserDAO.create(username, password)

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

    def set_profile_pic(self, username):
        # @TODO
        pass
