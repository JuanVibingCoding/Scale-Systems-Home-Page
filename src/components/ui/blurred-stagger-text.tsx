"use client"

import * as React from "react"
import { motion } from "motion/react"

export const BlurredStagger = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
    },
  };

  const letterAnimation = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
    show: {
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  const words = text.split(" ");
  let charCounter = 0; // To keep track of stagger delay across words

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {words.map((word, wordIndex) => (
        <React.Fragment key={wordIndex}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((char, charIndex) => {
              const currentDelay = charCounter * 0.015;
              charCounter++;
              return (
                <motion.span
                  key={`${wordIndex}-${charIndex}`}
                  variants={letterAnimation}
                  transition={{ duration: 0.3, delay: currentDelay }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 && (
            <React.Fragment>
              {" "}
              {/* Increment counter for the space so timing gap remains */}
              {(() => { charCounter++; return null; })()}
            </React.Fragment>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
};
