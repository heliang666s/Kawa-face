from fastapi import WebSocket
from app.services.face_recognition import detect_expression
from app.services.ai_response import get_ai_response
from app.utils.mongodb import save_chat_data

async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket 连接已建立")

    try:
        while True:
            # 接收视频帧数据
            frame_data = await websocket.receive_bytes()

            # 将接收到的二进制数据转换为图像
            image = Image.open(io.BytesIO(frame_data))
            frame = np.array(image)

            # 调用表情识别服务
            expression = detect_expression(frame)

            # 获取 AI 响应
            ai_response = get_ai_response(expression)

            # 保存聊天数据（表情与AI回应）
            save_chat_data(expression, ai_response)

            # 将结果发送回前端
            await websocket.send_json({
                "expression": expression,
                "response": ai_response
            })

            print(f"检测到的表情: {expression}")
            
    except Exception as e:
        print(f"WebSocket 连接异常关闭: {e}")
    finally:
        await websocket.close()
