# app/api/websocket.py
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
            print(f"检测到的表情: {expression}")
    except Exception as e:
        print(f"WebSocket 连接异常关闭: {e}")
    finally:
        await websocket.close()
