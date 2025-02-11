import React from "react";

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
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-opacity-20 bg-black backdrop-blur-sm">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full aspect-video object-cover"
      />
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
