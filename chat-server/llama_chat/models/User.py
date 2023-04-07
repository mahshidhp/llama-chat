from llama_chat.extenstions import db


user_contacts = db.Table(
    'user_contacts',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('contact_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    extend_existing=True
)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(50))
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    profile_url = db.Column(db.String(1000), nullable=True)
    bio = db.Column(db.String(1000), nullable=True)

    contacts = db.relationship(
        'User',
        secondary=user_contacts,
        primaryjoin=user_contacts.c.user_id == id,
        secondaryjoin=user_contacts.c.contact_id == id
    )

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "profile_url": self.profile_url,
            "bio": self.bio,
        }
