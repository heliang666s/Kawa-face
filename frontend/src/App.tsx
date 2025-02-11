import React, { useState, useRef, useEffect, useCallback } from "react";
import { AIBubbleAnimation } from "./components/AIBubbleAnimation";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Engine } from "tsparticles-engine";
import { FaMicrophone } from "react-icons/fa";
import VideoComponent from "./components/VideoComponent";
import MessageDisplay from "./components/MessageDisplay";

const App: React.FC = () => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const recognition = useRef<SpeechRecognition | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout>();

  const particlesInit = async (engine: Engine) => {
    await loadFull(engine);
  };

  const handleCamera = async () => {
    if (isCameraOn) {
      videoStream?.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      videoStream?.getTracks().forEach((track) => track.stop());
    };
  }, [videoStream]);

  const debounceSetMessage = useCallback((message: string) => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setUserMessage(message);
      setAiResponse(`收到您的消息：${message}`);
    }, 1000);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      recognition.current = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = "zh-CN";

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        debounceSetMessage(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }

    return () => {
      messageTimeoutRef.current && clearTimeout(messageTimeoutRef.current);
    };
  }, [debounceSetMessage]);

  const toggleListening = () => {
    if (!isListening) {
      recognition.current?.start();
      setIsListening(true);
    } else {
      recognition.current?.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-[#1a1c2e] to-[#16162c]">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            opacity: 0
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: ["#8B9FFF", "#93c5fd", "#60a5fa"]
            },
            links: {
              color: "#8B9FFF",
              distance: 150,
              enable: false,
              opacity: 0.4,
              width: 1,
              triangles: {
                enable: true,
                opacity: 0.05
              }
            },
            move: {
              enable: true,
              speed: 1.2,
              direction: "none",
              random: true,
              outModes: "bounce",
              attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200
              }
            },
            number: {
              value: 120,
              density: {
                enable: true,
                area: 800
              }
            },
            opacity: {
              value: 0.4,
              random: true,
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false
              }
            },
            size: {
              value: { min: 2, max: 4 },
              random: true,
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.1,
                sync: false
              }
            },
            shape: {
              type: ["circle", "triangle"]
            }
          },
          detectRetina: true,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab"
              },
              onClick: {
                enable: true,
                mode: "push"
              }
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.5
                }
              },
              push: {
                quantity: 4
              }
            }
          }
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <VideoComponent
            videoRef={videoRef}
            isCameraOn={isCameraOn}
            handleCamera={handleCamera}
          />

          <div
            className="relative aspect-video flex items-center justify-center 
                        bg-opacity-10 bg-black backdrop-blur-sm rounded-2xl shadow-2xl"
          >
            <div className="transform scale-75">
              <AIBubbleAnimation isActive={isListening} />
            </div>
          </div>
        </div>

        <MessageDisplay userMessage={userMessage} aiResponse={aiResponse} />

        <button
          onClick={toggleListening}
          className={`fixed bottom-8 right-8 p-4 rounded-full shadow-lg 
                    transition-all duration-300 ${
                      isListening
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
        >
          <FaMicrophone className="text-white text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default App;
