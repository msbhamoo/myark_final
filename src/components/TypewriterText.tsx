import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterTextProps {
  words: string[];
  className?: string;
  onWordChange?: (index: number) => void;
}

const TypewriterText = ({ words, className = "", onWordChange }: TypewriterTextProps) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0] || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(100);

  useEffect(() => {
    // Start with the first word displayed, then begin deleting after a delay
    if (displayText === words[0] && !isDeleting) {
      const timer = setTimeout(() => {
        setIsDeleting(true);
        setSpeed(50);
      }, 2000); // Wait 2 seconds before starting to delete
      return () => clearTimeout(timer);
    }

    const handleType = () => {
      const currentWord = words[currentWordIndex];

      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        setSpeed(100);

        if (displayText === currentWord) {
          setSpeed(2000);
          setIsDeleting(true);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        setSpeed(50);

        if (displayText === "") {
          setIsDeleting(false);
          const nextIndex = (currentWordIndex + 1) % words.length;
          setCurrentWordIndex(nextIndex);
          onWordChange?.(nextIndex);
          setSpeed(500);
        }
      }
    };

    const timer = setTimeout(handleType, speed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIndex, words, speed, onWordChange]);

  return (
    <span className={className}>
      <span className="inline-block min-h-[1.2em]">
        {displayText}
      </span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[3px] h-[0.8em] bg-current ml-1 align-baseline translate-y-[-0.1em]"
      />
    </span>
  );
};

export default TypewriterText;
