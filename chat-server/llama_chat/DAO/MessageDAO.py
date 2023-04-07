from llama_chat.models.Message import Message
from llama_chat.extenstions import db
from datetime import datetime


class MessageDAO:
    @staticmethod
    def create(sender_id, receiver_id, text, created_at):
        created_at = datetime.fromtimestamp(created_at / 1000)
        new_msg = Message(sender_id=sender_id, receiver_id=receiver_id, text=text, created_at=created_at)
        db.session.add(new_msg)
        db.session.commit()

    @staticmethod
    def get_conversation(user_id1, user_id2, page=1, item_per_page=10):
        messages = Message.query.filter(
            (Message.sender_id == user_id1 and Message.receiver_id == user_id2)
            or (Message.receiver_id == user_id1 and Message.sender_id == user_id2)
        ).orderby(Message.created_at).paginate(page=page, per_page=item_per_page)

        return messages.items
