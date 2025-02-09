from pydantic import BaseModel
from datetime import datetime

class ChatModel(BaseModel):
    timestamp: datetime
    expression: str
    response: str