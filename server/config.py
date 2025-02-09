# config.py
import os
from dotenv import load_dotenv

load_dotenv()  # 加载 .env 文件中的环境变量

DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat"
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
MONGO_URI = os.getenv("MONGO_URI")
