import cv2
import numpy as np
from deepface import DeepFace

def detect_expression(frame: np.ndarray) -> str:
    """
    使用 OpenCV 和 DeepFace 来检测面部表情。
    :param frame: 输入的图像帧（numpy 数组格式）
    :return: 检测到的表情
    """

    # 转换为灰度图像
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # 加载 OpenCV 的面部检测模型
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # 检测面部
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if len(faces) == 0:
        return "未检测到面部"

    # 假设只处理第一个检测到的面部
    (x, y, w, h) = faces[0]

    # 提取面部区域
    face_region = frame[y:y+h, x:x+w]

    # 使用 DeepFace 进行表情分析
    try:
        result = DeepFace.analyze(face_region, actions=['emotion'], enforce_detection=False)
        # DeepFace 返回的结果是一个字典，包含情感的概率分布
        emotion = result[0]['dominant_emotion']
        return emotion
    except Exception as e:
        print(f"表情识别失败: {e}")
        return "表情识别失败"
