from fastapi import FastAPI
from app.api.websocket import websocket_endpoint
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "FastAPI is running!"}

# 注册 WebSocket 路由
app.websocket("/ws")(websocket_endpoint)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)