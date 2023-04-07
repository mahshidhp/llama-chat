from llama_chat.DAO.MessageDAO import MessageDAO


class MessageService:
    @staticmethod
    def send_message(sender_id, receiver_id, text, created_at):
        MessageDAO.create(sender_id, receiver_id, text, created_at)

    @staticmethod
    def get_messages(user_id1, user_id2, page):
        messages = MessageDAO.get_conversation(user_id1, user_id2, page)
        return messages
