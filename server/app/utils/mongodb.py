# app/utils/mongodb.py
from pymongo import MongoClient
from datetime import datetime

MONGO_URI = "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)
db = client["facial_expression_ai"]
collection = db["chat_history"]

def save_chat_data(expression, ai_response):
    chat_entry = {
        "timestamp": datetime.utcnow(),
        "expression": expression,
        "response": ai_response
    }
    collection.insert_one(chat_entry)
