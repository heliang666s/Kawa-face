from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
import numpy as np
from deepface import DeepFace
import cv2
import io
from PIL import Image
from app.services.face_recognition import detect_expression
from app.services.ai_response import get_ai_response
from app.utils.mongodb import save_chat_data

app = FastAPI()

@app.get("/")
async def get():
    html = """
    <html>
        <head>
            <title>Face and Speech Recognition</title>
        </head>
        <body>
            <h1>WebSocket Connection Established</h1>
        </body>
    </html>
    """
    return HTMLResponse(content=html, status_code=200)


# WebSocket 端点，接收前端视频帧和文字信息
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket 连接已建立")

    try:
        while True:
            # 接收数据，这里可以接收文字数据或视频帧数据
            data = await websocket.receive_bytes()

            if data[:4] == b'frame':  # 假设视频帧的数据以 'frame' 开头
                frame_data = data[4:]  # 移除帧标识

                # 将接收到的二进制数据转换为图像
                image = Image.open(io.BytesIO(frame_data))
                frame = np.array(image)

                # 调用表情识别服务
                expression = detect_expression(frame)

                # 获取 AI 响应
                ai_response = get_ai_response(expression)

                # 保存聊天数据（表情与AI回应）
                save_chat_data(expression, ai_response)

                # 将表情和响应数据发送回前端
                await websocket.send_json({
                    "expression": expression,
                    "response": ai_response
                })
                print(f"检测到的表情: {expression}")
            
            elif data[:7] == b'textmsg':  # 假设文字数据以 'textmsg' 开头
                text_message = data[7:].decode('utf-8')

                # 将接收到的文字消息传递给AI处理（假设这个函数返回AI的回复）
                ai_response = get_ai_response(text_message)
                
                # 保存聊天数据（文字与AI回应）
                save_chat_data(text_message, ai_response)

                # 发送AI的回复给前端
                await websocket.send_json({
                    "expression": "文本消息",
                    "response": ai_response
                })

    except WebSocketDisconnect:
        print("WebSocket 连接已断开")
        await websocket.close()
    except Exception as e:
        print(f"WebSocket 连接异常关闭: {e}")
        await websocket.close()

