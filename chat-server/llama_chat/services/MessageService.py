from llama_chat.DAO.MessageDAO import MessageDAO


class MessageService:
    @staticmethod
    def send_message(sender_id, receiver_id, text, created_at):
        new_msg = MessageDAO.create(sender_id, receiver_id, text, created_at)
        return new_msg

    @staticmethod
    def get_messages(user_id1, user_id2, page):
        messages = MessageDAO.get_conversation(user_id1, user_id2, page)
        messages_serialized = [msg.serialize() for msg in messages]
        return messages_serialized
