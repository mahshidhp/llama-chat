from redis import Redis
from datetime import datetime
from dotenv import dotenv_values

config = dotenv_values(".env")

redis_db = Redis(
    host=config["REDIS_HOST"],
    port=config["REDIS_PORT"],
    password=config["REDIS_PASS"]
)

SECONDS_IN_WEEK = 7*24*60*60


class OnlineService:
    @staticmethod
    def set_last_seen(username):
        redis_db.set(username, datetime.now().timestamp(), ex=SECONDS_IN_WEEK)

    @staticmethod
    def get_last_seen(username):
        redis_db.get(username)

    @staticmethod
    def get_bulk_last_seen(usernames):
        last_seen = redis_db.mget(usernames)
        last_seen = [float(l_s.decode(encoding="utf-8")) if l_s else None for l_s in last_seen]
        contacts_last_seen = dict(zip(usernames, last_seen))
        return contacts_last_seen
