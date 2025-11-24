"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import StreamingText from "./StreamingText";

interface ResultDisplayProps {
  content: string;
  isWrong?: boolean; // For the standard model
}

export default function ResultDisplay({ content, isWrong = false }: ResultDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl p-4 border ${
        isWrong
          ? "bg-red-950/20 border-red-500/30 text-red-100"
          : "bg-green-950/20 border-green-500/30 text-green-100"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {isWrong ? (
          <XCircle className="w-5 h-5 text-red-400" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        )}
        <h3 className={`text-base font-semibold ${isWrong ? "text-red-400" : "text-green-400"}`}>
          {isWrong ? "Standard Output" : "Final Answer"}
        </h3>
      </div>
      <div className="text-base leading-relaxed">
        <StreamingText text={content} />
      </div>
    </motion.div>
  );
}
