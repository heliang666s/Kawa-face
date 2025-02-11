import React, { useState, useRef, useEffect } from "react";

interface VideoComponentProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isCameraOn: boolean;
  handleCamera: () => void;
}

const VideoComponent: React.FC<VideoComponentProps> = ({
  videoRef,
  isCameraOn,
  handleCamera,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // 创建 WebSocket 连接
    const ws = new WebSocket("ws://localhost:5000/video-stream");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket 连接已建立");
    };

    ws.onerror = (err) => {
      console.error("WebSocket 错误:", err);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // 使用 Canvas 进行视频帧捕获
  const captureFrame = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);

        // 将图像转换为 Blob
        canvas.toBlob((blob) => {
          if (blob && socket && socket.readyState === WebSocket.OPEN) {
            // 将 Blob 发送给后端
            socket.send(blob);
          }
        }, "image/jpeg");
      }
    }
  };

  // 捕获视频帧并每隔一段时间发送
  useEffect(() => {
    const interval = setInterval(captureFrame, 100); // 每 100ms 发送一次视频帧

    return () => clearInterval(interval);
  }, [videoRef, socket]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-opacity-20 bg-black backdrop-blur-sm">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full aspect-video object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <div className="absolute bottom-4 right-4">
        <button
          onClick={handleCamera}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white 
                    transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
        >
          {isCameraOn ? "关闭摄像头" : "打开摄像头"}
        </button>
      </div>
    </div>
  );
};

export default VideoComponent;
