import { motion } from 'motion/react';

export const RobotIcon = ({ mousePos, className = "", isDark = false }: { mousePos: {x: number, y: number}, className?: string, isDark?: boolean }) => {
  const eyeOffsetX = mousePos.x * 4;
  const eyeOffsetY = mousePos.y * 4;

  const color = isDark ? "#171810" : "#03fa6e";
  const bgColor = isDark ? "#03fa6e" : "transparent";

  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 14V8H28" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10" y="14" width="28" height="22" rx="6" stroke={color} strokeWidth="3" fill={bgColor} />
      <path d="M6 25H10" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M38 25H42" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <motion.rect
        x={18} y={21} width="3" height="8" rx="1.5" fill={color}
        animate={{ x: eyeOffsetX, y: eyeOffsetY }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
      <motion.rect
        x={27} y={21} width="3" height="8" rx="1.5" fill={color}
        animate={{ x: eyeOffsetX, y: eyeOffsetY }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
    </svg>
  );
};
