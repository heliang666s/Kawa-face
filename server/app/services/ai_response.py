# app/services/ai_response.py
import requests
from config import DEEPSEEK_API_URL, DEEPSEEK_API_KEY

def get_ai_response(expression):
    prompt = f"用户的表情是 {expression}，请提供相应的智能回复。"
    headers = {"Authorization": f"Bearer {DEEPSEEK_API_KEY}"}
    data = {"prompt": prompt, "max_tokens": 100}

    try:
        response = requests.post(DEEPSEEK_API_URL, json=data, headers=headers)
        return response.json().get("response", "无法生成回答")
    except Exception as e:
        print(f"DeepSeek-R1 请求错误: {e}")
        return "AI 暂时无法响应"
