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
      className={`rounded-xl p-6 border ${
        isWrong
          ? "bg-red-500/10 border-red-500/20 text-red-200"
          : "bg-green-500/10 border-green-500/20 text-green-200"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        {isWrong ? (
          <XCircle className="w-6 h-6 text-red-500" />
        ) : (
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        )}
        <h3 className={`text-lg font-semibold ${isWrong ? "text-red-500" : "text-green-500"}`}>
          {isWrong ? "Standard Output" : "Final Answer"}
        </h3>
      </div>
      <div className="text-lg">
        <StreamingText text={content} />
      </div>
    </motion.div>
  );
}
