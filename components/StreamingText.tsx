"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface StreamingTextProps {
  text: string;
  className?: string;
  throttle?: number; // ms per character
  onUpdate?: () => void;
}

export default function StreamingText({ text, className, throttle = 15, onUpdate }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const isStreamComplete = useRef(false);
  const lastTextLength = useRef(0);

  useEffect(() => {
    // If text is reset or significantly shorter, reset displayed text immediately
    if (text.length < lastTextLength.current) {
      setDisplayedText("");
      lastTextLength.current = 0;
      isStreamComplete.current = false;
    }
    
    lastTextLength.current = text.length;
  }, [text]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateText = () => {
      setDisplayedText((current) => {
        if (current.length < text.length) {
          // Calculate how many characters to add based on catch-up logic
          // If we are very far behind, speed up slightly, otherwise 1 char at a time
          const delta = text.length - current.length;
          const chunk = delta > 50 ? 5 : delta > 20 ? 2 : 1;
          
          return text.slice(0, current.length + chunk);
        } else {
          isStreamComplete.current = true;
          return current;
        }
      });
      
      // Notify parent of update
      if (onUpdate) onUpdate();

      // Schedule next update
      if (displayedText.length < text.length) {
         timeoutId = setTimeout(updateText, throttle);
      }
    };

    // Start the loop
    timeoutId = setTimeout(updateText, throttle);

    return () => clearTimeout(timeoutId);
  }, [text, displayedText, throttle]);

  return (
    <div className={className}>
      <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 max-w-none">
        <ReactMarkdown
          components={{
             // Override some elements to ensure they fit the theme
             p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
             ul: ({children}) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
             ol: ({children}) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
             li: ({children}) => <li className="mb-1">{children}</li>,
             code: ({children}) => <code className="bg-white/10 rounded px-1 py-0.5 text-sm font-mono">{children}</code>,
             pre: ({children}) => <pre className="p-3 rounded-lg overflow-x-auto my-2 bg-black/30 border border-white/10">{children}</pre>,
             h1: ({children}) => <h1 className="text-lg font-bold mt-4 mb-2">{children}</h1>,
             h2: ({children}) => <h2 className="text-base font-bold mt-3 mb-2">{children}</h2>,
             h3: ({children}) => <h3 className="text-sm font-bold mt-2 mb-1">{children}</h3>,
             strong: ({children}) => <strong className="font-bold text-yellow-200/90">{children}</strong>,
          }}
        >
          {displayedText}
        </ReactMarkdown>
      </div>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-4 bg-current ml-1 align-middle"
      />
    </div>
  );
}
