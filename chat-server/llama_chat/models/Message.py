from llama_chat.extenstions import db
from llama_chat.models.User import User


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey(User.id))
    receiver_id = db.Column(db.Integer, db.ForeignKey(User.id))
    text = db.Column(db.String(1000))
    created_at = db.Column(db.DateTime)

    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender_id,
            "receiver": self.receiver_id,
            "text": self.text,
            "created_at": self.created_at,
        }
