import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {ThoughtBubble} from "./ThoughtBubble";


interface AIBubbleAnimationProps {
  isActive: boolean;
}

export const AIBubbleAnimation: React.FC<AIBubbleAnimationProps> = ({
  isActive,
}) => {
  const [audioLevel, setAudioLevel] = useState(0);

  // 添加音频分析
  useEffect(() => {
    if (!isActive) return;

    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 32;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateLevel = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 128); // 归一化到 0-1
          requestAnimationFrame(updateLevel);
        };

        updateLevel();
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    initAudio();

    return () => {
      audioContext?.close();
    };
  }, [isActive]);

  return (
    <div className="relative w-72 h-72">
      {/* 主要气泡动画 */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: isActive ? [1 + audioLevel * 0.3, 1] : [1, 1.15, 1],
          rotate: isActive ? [0, 360] : [0, 180, 360],
          opacity: 0.9,
        }}
        transition={{
          scale: {
            duration: isActive ? 0.5 : 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
          rotate: {
            duration: isActive ? 8 : 12,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        <ThoughtBubble color="#8B9FFF" opacity={0.9} />
      </motion.div>

      {/* 围绕的粒子动画 */}
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute w-4 h-4"
          style={{
            left: "50%",
            top: "50%",
            transform: `rotate(${index * 72}deg) translateX(120px)`,
          }}
          animate={{
            scale: isActive ? [1 + audioLevel * 0.2, 0.8] : [1, 0.8, 1],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.4,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: "#8B9FFF",
              filter: "blur(2px)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
