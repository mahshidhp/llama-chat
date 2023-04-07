from llama_chat.models.User import User
from llama_chat.extenstions import db


class UserDAO:
    def __init__(self, user):
        self.user = user

    @staticmethod
    def create(username, password):
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()

    @staticmethod
    def get_by_id(user_id):
        user = User.query.filter(User.id == user_id).first()
        return user

    @staticmethod
    def get_by_username(username):
        user = User.query.filter(User.username == username).first()
        return user

    def add_contact(self, new_contact):
        self.user.contacts.append(new_contact)
        db.session.add(self.user)
        db.session.commit()

    def get_contacts(self):
        return self.user.contacts
