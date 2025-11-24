"use client";

import { motion } from "framer-motion";

export default function StreamingText({ text, className }: { text: string; className?: string }) {
  // We can just render the text. The "streaming" feel comes from the update frequency.
  // We can add a blinking cursor at the end.
  return (
    <div className={className}>
      <span className="whitespace-pre-wrap font-mono">{text}</span>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-4 bg-current ml-1 align-middle"
      />
    </div>
  );
}
