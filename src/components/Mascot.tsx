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
        y: [0, -10, 0],
        rotate: [0, 2, -2, 0]
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className={cn("relative inline-block", className)}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
      >
        {/* Potato Body */}
        <path
          d="M40 100C40 60 70 30 110 30C150 30 170 60 170 100C170 140 140 170 100 170C60 170 40 140 40 100Z"
          fill="#E6B959"
          stroke="black"
          strokeWidth="8"
        />
        {/* Eyes */}
        <circle cx="80" cy="85" r="10" fill="black" />
        <circle cx="130" cy="85" r="10" fill="black" />
        {/* Small shine in eyes */}
        <circle cx="83" cy="82" r="3" fill="white" />
        <circle cx="133" cy="82" r="3" fill="white" />
        {/* Smile */}
        <path
          d="M80 120C80 120 95 140 115 140C135 140 150 120 150 120"
          stroke="black"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Blush */}
        <circle cx="65" cy="110" r="8" fill="#F87171" fillOpacity="0.4" />
        <circle cx="155" cy="110" r="8" fill="#F87171" fillOpacity="0.4" />
      </svg>
    </motion.div>
  );
}