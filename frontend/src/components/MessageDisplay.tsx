import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface MessageDisplayProps {
  userMessage: string;
  aiResponse: string;
}

const sendTextMessage = async (message: string) => {
  const response = await fetch("http://localhost:5000/api/text", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  return response.json();
};

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  userMessage,
  aiResponse,
}) => {
  const [message, setMessage] = useState(userMessage);

  // React Query 的 mutation 用于发送消息到后端
  const mutation = useMutation({
    mutationFn: sendTextMessage,
    onSuccess: (data) => {
      console.log("Message sent successfully", data);
    },
    onError: (error) => {
      console.error("Error sending message", error);
    },
  });

  // 发送消息的函数
  const handleSendMessage = () => {
    if (message) {
      mutation.mutate(message); // 触发 mutation 发送消息到后端
      setMessage(""); // 发送后清空输入框
    }
  };

  return (
    <div className="mt-8 p-6 rounded-2xl bg-black bg-opacity-20 backdrop-blur-sm">
      <div className="space-y-4">
        {userMessage && (
          <div className="text-white bg-indigo-600 bg-opacity-50 p-4 rounded-lg">
            <p className="font-medium">你说：{userMessage}</p>
          </div>
        )}
        {aiResponse && (
          <div className="text-white bg-blue-600 bg-opacity-50 p-4 rounded-lg">
            <p className="font-medium">AI回复：{aiResponse}</p>
          </div>
        )}
      </div>

      {/* 输入框和发送按钮 */}
      <div className="mt-4">
        <input
          type="text"
          className="p-2 rounded-lg w-full bg-white text-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入你的消息"
        />
        <button
          onClick={handleSendMessage}
          className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default MessageDisplay;
