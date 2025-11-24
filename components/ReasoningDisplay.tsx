"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Terminal } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import StreamingText from "./StreamingText";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReasoningDisplayProps {
  content: string;
  isComplete: boolean;
}

export default function ReasoningDisplay({ content, isComplete }: ReasoningDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
             scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [content]);

  return (
    <div className="w-full mb-4">
      <motion.div
        layout
        className="rounded-lg border border-yellow-500/30 bg-black/40 overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-4 py-2 bg-yellow-500/10 cursor-pointer hover:bg-yellow-500/20 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
            <Terminal className="w-4 h-4" />
            <span>Thinking Process</span>
            {!isComplete && (
               <motion.span
                 animate={{ opacity: [1, 0.5, 1] }}
                 transition={{ repeat: Infinity, duration: 1.5 }}
                 className="w-2 h-2 rounded-full bg-yellow-500 ml-2"
               />
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-yellow-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-yellow-500" />
          )}
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ScrollArea className="h-[200px] w-full p-4 font-mono text-sm text-yellow-200/80" ref={scrollRef}>
                <StreamingText text={content} />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
