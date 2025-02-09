# app/services/face_recognition.py
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
