import { motion } from "framer-motion";

export const ThoughtBubble: React.FC<{ color: string; opacity: number }> = ({
  color,
  opacity,
}) => {
  return (
    <div
      className="w-full h-full relative"
      style={{
        background: `radial-gradient(circle at 30% 30%, ${color}, rgba(139, 159, 255, 0.6))`,
        opacity,
        borderRadius: "50%",
        filter: "blur(1px)",
        transform: `
          scale(1.1)
          rotate(45deg)
          perspective(100px)
          rotateX(5deg)
        `,
      }}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            transform: `rotate(${i * 72}deg)`,
            borderRadius: "60% 70% 60% 70%",
            background: color,
            opacity: 0.5,
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.6,
          }}
        />
      ))}
    </div>
  );
};
