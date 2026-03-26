import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface MascotProps {
  className?: string;
}
export function Mascot({ className }: MascotProps) {
  return (
    <motion.div
      animate={{
        y: [0, -12, 0],
        rotate: [0, 3, -3, 0]
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={cn("relative inline-block", className)}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]"
      >
        {/* Potato Body */}
        <path
          d="M40 100C40 60 70 30 110 30C150 30 170 60 170 100C170 140 140 170 100 170C60 170 40 140 40 100Z"
          fill="#E6B959"
          stroke="black"
          strokeWidth="8"
        />
        {/* Animated Eyes Group */}
        <motion.g
          animate={{
            scaleY: [1, 1, 0, 1, 1, 1, 0, 1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            times: [0, 0.45, 0.5, 0.55, 0.6, 0.85, 0.9, 0.95, 1],
            ease: "easeInOut"
          }}
          style={{ transformOrigin: "center 85px" }}
        >
          {/* Eyes */}
          <circle cx="80" cy="85" r="10" fill="black" />
          <circle cx="130" cy="85" r="10" fill="black" />
          {/* Small shine in eyes */}
          <circle cx="83" cy="82" r="3" fill="white" />
          <circle cx="133" cy="82" r="3" fill="white" />
        </motion.g>
        {/* Smile */}
        <path
          d="M80 125C80 125 95 145 115 145C135 145 150 125 150 125"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Blush */}
        <circle cx="65" cy="115" r="10" fill="#F87171" fillOpacity="0.4" />
        <circle cx="155" cy="115" r="10" fill="#F87171" fillOpacity="0.4" />
      </svg>
    </motion.div>
  );
}