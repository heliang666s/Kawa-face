import React from "react";

interface MessageDisplayProps {
  userMessage: string;
  aiResponse: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  userMessage,
  aiResponse,
}) => {
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
    </div>
  );
};

export default MessageDisplay;
