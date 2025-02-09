# Kawa-face 后端
### **项目结构：**
```
├── app/                        # 主应用目录
│   ├── __init__.py             # 包初始化文件
│   ├── main.py                # FastAPI 主文件，负责启动应用
│   ├── api/                   # API 路由和控制器
│   │   ├── __init__.py        # 包初始化文件
│   │   ├── websocket.py       # WebSocket 相关处理
│   │   ├── chat.py            # 存储对话历史和查询
│   ├── services/              # 与第三方服务和模型相关的逻辑
│   │   ├── __init__.py        # 包初始化文件
│   │   ├── face_recognition.py # 处理 DeepFace 表情识别
│   │   ├── ai_response.py     # 处理 DeepSeek-R1 AI 对话请求
│   ├── models/                # 数据模型（可选）
│   │   ├── __init__.py        # 包初始化文件
│   │   ├── chat_model.py      # 对话数据模型
│   ├── utils/                 # 工具函数和公共功能
│   │   ├── __init__.py        # 包初始化文件
│   │   ├── mongodb.py         # MongoDB 连接和存储
│   │   ├── video_processing.py # OpenCV 处理视频帧
│
├── requirements.txt           # 项目依赖
├── config.py                  # 项目配置文件（API 密钥、MongoDB 配置等）
├── Dockerfile                 # Docker 构建文件（可选）
├── .env                       # 环境变量配置文件（可选）
├── logs/                      # 日志文件目录
│
└── README.md                  # 项目文档
```

### **详细代码实现**

#### **1. `app/main.py`** - FastAPI 主文件，负责启动应用

```python
from fastapi import FastAPI
from app.api.websocket import websocket_endpoint
import uvicorn

app = FastAPI()

# 注册 WebSocket 路由
app.websocket("/ws")(websocket_endpoint)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### **2. `app/api/websocket.py`** - WebSocket 相关处理

```python
from fastapi import WebSocket
from app.services.face_recognition import detect_expression
from app.services.ai_response import get_ai_response
from app.utils.mongodb import save_chat_data

async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket 连接已建立")

    try:
        while True:
            frame_data = await websocket.receive_bytes()
            expression = detect_expression(frame_data)
            ai_response = get_ai_response(expression)
            save_chat_data(expression, ai_response)
            await websocket.send_json({"expression": expression, "response": ai_response})
    except Exception as e:
        print(f"WebSocket 连接异常关闭: {e}")
    finally:
        await websocket.close()
```

#### **3. `app/services/face_recognition.py`** - 处理 DeepFace 表情识别

```python
import cv2
import numpy as np
from deepface import DeepFace

def detect_expression(frame_data):
    frame_np = np.frombuffer(frame_data, dtype=np.uint8)
    frame = cv2.imdecode(frame_np, cv2.IMREAD_COLOR)

    try:
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        if isinstance(result, list) and len(result) > 0:
            return result[0]['dominant_emotion']
    except Exception as e:
        print(f"表情识别错误: {e}")
    return "neutral"
```

#### **4. `app/services/ai_response.py`** - 处理 DeepSeek-R1 AI 对话请求

```python
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
```

#### **5. `app/utils/mongodb.py`** - MongoDB 连接和存储

```python
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
```

#### **6. `app/models/chat_model.py`** - 数据模型（可选）

```python
from pydantic import BaseModel
from datetime import datetime

class ChatModel(BaseModel):
    timestamp: datetime
    expression: str
    response: str
```

#### **7. `config.py`** - 项目配置文件（API 密钥、MongoDB 配置等）

```python
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat"
DEEPSEEK_API_KEY = "your-api-key"
MONGO_URI = "mongodb://localhost:27017"
```

#### **8. `requirements.txt`** - 项目依赖

```
fastapi
uvicorn
opencv-python
numpy
deepface
requests
pymongo
```

#### **9. `Dockerfile`** - Docker 构建文件（可选）

```Dockerfile
# 使用官方 Python 镜像
FROM python:3.9-slim

# 设置工作目录
WORKDIR /app

# 复制项目文件到容器
COPY . /app

# 安装依赖
RUN pip install --no-cache-dir -r requirements.txt

# 启动应用
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### **10. `.env`** - 环境变量配置文件（可选）

```env
DEEPSEEK_API_KEY=your-api-key
MONGO_URI=mongodb://localhost:27017
```

---

### **总结**

上述代码构建了一个后端系统，包含了 **FastAPI、WebSocket、DeepFace、DeepSeek-R1、MongoDB** 等多个组件，通过 **WebSocket** 实现实时视频流与 AI 交互，同时将识别到的表情和生成的回复存储到 MongoDB 进行管理。您可以根据需要进行扩展和优化，例如根据用户的历史情绪数据个性化回复，或在 DeepFace 中增加更多的预处理步骤等。

### **后端技术方案（FastAPI + OpenCV + DeepFace + WebSocket + DeepSeek-R1 + MongoDB）**

---

## **1. 概述**
本项目旨在构建一个**实时人脸表情识别并与 AI 对话**的应用，后端基于 FastAPI 实现。系统通过摄像头捕捉用户表情，使用 OpenCV 进行视频预处理，DeepFace 进行表情分析，并将识别到的表情传递给 AI 对话模型 DeepSeek-R1，最终返回智能回复。后端采用 WebSocket 实现前后端实时通信，并可选地使用 MongoDB 存储用户的历史对话数据。

---

## **2. 技术栈**
| **模块**       | **技术选型** |
|---------------|------------|
| Web 框架      | FastAPI（高性能，支持 WebSocket，易于扩展） |
| 图像处理      | OpenCV（预处理视频帧）、NumPy（数组计算） |
| 表情识别      | DeepFace（检测人脸并分析表情） |
| WebSocket     | 实现前后端实时通信 |
| AI 对话       | DeepSeek-R1（生成 AI 反馈） |
| 数据存储（可选） | MongoDB（存储用户历史对话） |

---

## **3. 系统架构**
### **数据流**
1. **前端捕获视频流**（摄像头）并将帧数据发送至后端。
2. **后端接收视频帧**，使用 OpenCV 进行预处理（灰度化、人脸检测）。
3. **DeepFace 分析表情**，返回用户当前的情绪状态（如“happy”、“sad”）。
4. **将表情输入 DeepSeek-R1**，生成 AI 反馈文本。
5. **通过 WebSocket 将响应返回前端**，同步显示在 UI 上。
6. **可选：存储对话数据至 MongoDB**，供未来分析或个性化推荐使用。

---

## **4. 详细后端实现**
### **4.1 FastAPI + WebSocket**
FastAPI 处理 HTTP API 端点，同时使用 WebSocket 实现前后端的实时通信。

#### **依赖安装**
```bash
pip install fastapi uvicorn opencv-python numpy deepface pymongo websockets requests
```

#### **FastAPI 后端代码**
```python
from fastapi import FastAPI, WebSocket
import cv2
import numpy as np
from deepface import DeepFace
import asyncio
import requests
from pymongo import MongoClient
from datetime import datetime

app = FastAPI()

# 连接 MongoDB（可选）
MONGO_URI = "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)
db = client["facial_expression_ai"]
collection = db["chat_history"]

# DeepSeek-R1 API 配置
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat"
DEEPSEEK_API_KEY = "your-api-key"

# WebSocket 处理
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket 连接已建立")

    try:
        while True:
            # 接收前端传来的视频帧
            frame_data = await websocket.receive_bytes()
            frame_np = np.frombuffer(frame_data, dtype=np.uint8)
            frame = cv2.imdecode(frame_np, cv2.IMREAD_COLOR)

            # 进行表情识别
            expression = detect_expression(frame)

            # 生成 AI 回复
            ai_response = get_ai_response(expression)

            # 存储对话记录（可选）
            save_chat_data(expression, ai_response)

            # 发送数据回前端
            await websocket.send_json({"expression": expression, "response": ai_response})

    except Exception as e:
        print(f"WebSocket 连接异常关闭: {e}")
    finally:
        await websocket.close()

# **表情识别**
def detect_expression(frame):
    try:
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        if isinstance(result, list) and len(result) > 0:
            return result[0]['dominant_emotion']  # 获取最主要的表情
    except Exception as e:
        print(f"表情识别错误: {e}")
    return "neutral"  # 识别失败返回默认表情

# **AI 对话处理**
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

# **存储聊天记录**
def save_chat_data(expression, ai_response):
    chat_entry = {
        "timestamp": datetime.utcnow(),
        "expression": expression,
        "response": ai_response
    }
    collection.insert_one(chat_entry)
```

---

## **5. 关键功能解析**
### **5.1 WebSocket 实现实时通信**
- `FastAPI` 的 `WebSocket` 处理前端与后端的**实时交互**。
- 通过 `websocket.receive_bytes()` 接收前端视频帧。
- 处理后，使用 `websocket.send_json()` 发送识别表情与 AI 回复。

### **5.2 OpenCV 处理视频流**
- OpenCV 处理摄像头帧数据，转换为 NumPy 数组格式，确保 DeepFace 兼容。

### **5.3 DeepFace 表情识别**
- 通过 `DeepFace.analyze(frame, actions=['emotion'])` 分析表情，返回主要情绪标签。

### **5.4 DeepSeek-R1 AI 对话**
- 通过 `requests.post()` 向 DeepSeek-R1 发送请求，并返回 AI 生成的文本回复。

### **5.5 MongoDB 存储用户对话（可选）**
- `MongoClient` 连接数据库，`collection.insert_one()` 存储识别的表情与 AI 回复。

---

## **6. 前端交互（简要）**
前端（React + TypeScript）主要完成：
1. **获取摄像头视频流**。
2. **使用 WebSocket 发送视频帧到后端**。
3. **实时接收 AI 反馈并渲染到 UI**。

---

## **7. 可能的优化点**
1. **优化 DeepFace 的检测速度**：
   - 预先加载模型，避免每次请求重新初始化。
   - 使用 `threading` 或 `asyncio` 提高并行处理能力。
   
2. **AI 对话改进**：
   - 根据用户的历史情绪数据个性化 AI 回复（如对长期“sad”状态的用户提供安慰）。
   - 调整 `DeepSeek-R1` 的 `max_tokens` 以优化回复长度。

3. **前端优化**：
   - 仅在用户表情发生变化时发送数据，减少 WebSocket 负载。

---

## **8. 总结**
本方案结合了 **FastAPI、WebSocket、OpenCV、DeepFace、DeepSeek-R1、MongoDB**，实现了实时人脸表情识别并 AI 对话的完整后端架构，支持高效、低延迟的交互体验。下一步可以扩展个性化 AI 交互，让系统更加智能化。

