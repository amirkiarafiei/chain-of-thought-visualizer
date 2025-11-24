"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Challenge } from "./ChallengeGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, RefreshCw } from "lucide-react";
import ReasoningDisplay from "./ReasoningDisplay";
import ResultDisplay from "./ResultDisplay";
import { parseCoTStream, parseStandardStream } from "@/lib/streamParser";

interface ComparisonArenaProps {
  challenge: Challenge;
  onBack: () => void;
}

export default function ComparisonArena({ challenge, onBack }: ComparisonArenaProps) {
  const [isRunning, setIsRunning] = useState(false);

  // Standard Model State
  const [standardResult, setStandardResult] = useState("");
  const [standardLoading, setStandardLoading] = useState(false);

  // CoT Model State
  const [cotReasoning, setCotReasoning] = useState("");
  const [cotResult, setCotResult] = useState("");
  const [cotLoading, setCotLoading] = useState(false);
  const [cotReasoningDone, setCotReasoningDone] = useState(false);

  const runSimulation = async () => {
    setIsRunning(true);

    // Reset States
    setStandardResult("");
    setCotReasoning("");
    setCotResult("");
    setCotReasoningDone(false);

    setStandardLoading(true);
    setCotLoading(true);

    // Run both in parallel
    runStandard();
    runCoT();
  };

  const runStandard = async () => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: challenge.prompt, mode: "standard" }),
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        buffer += chunk;

        const result = parseStandardStream(buffer);
        setStandardResult(result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStandardLoading(false);
    }
  };

  const runCoT = async () => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: challenge.prompt, mode: "cot" }),
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        buffer += chunk;

        const { thinking, finalAnswer, isReasoningDone } = parseCoTStream(buffer);

        setCotReasoning(thinking);
        setCotResult(finalAnswer);
        setCotReasoningDone(isReasoningDone);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCotLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 flex flex-col h-[90vh]">
      {/* Header */}
      <motion.div
        layoutId={`card-${challenge.id}`}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
           <div className="flex items-center gap-3 mb-2">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700">{challenge.icon}</div>
                <h2 className="text-2xl font-bold text-white">{challenge.title}</h2>
           </div>
           <p className="text-zinc-400 text-lg md:text-xl font-medium pl-14">&quot;{challenge.prompt}&quot;</p>
        </div>
        <Button
            size="lg"
            onClick={runSimulation}
            disabled={standardLoading || cotLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
        >
            {isRunning ? <RefreshCw className={`w-5 h-5 mr-2 ${(standardLoading || cotLoading) ? 'animate-spin' : ''}`} /> : <Play className="w-5 h-5 mr-2" />}
            {isRunning ? "Rerun Simulation" : "Run Simulation"}
        </Button>
      </motion.div>

      {/* Arena Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">

        {/* Standard Model */}
        <div className="flex flex-col gap-4 bg-zinc-900 rounded-xl p-4 border border-zinc-800 h-full overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="font-semibold text-zinc-500 uppercase tracking-wider text-sm">Standard Prompting (Baseline)</span>
                {standardLoading && <span className="text-xs text-blue-400 animate-pulse">Generating...</span>}
            </div>

            <div className="flex-1 overflow-auto">
                {standardResult && (
                    <ResultDisplay content={standardResult} isWrong={true} />
                )}
            </div>
        </div>

        {/* CoT Model */}
        <div className="flex flex-col gap-4 bg-zinc-900 rounded-xl p-4 border border-zinc-800 h-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 z-10">
                <span className="font-semibold text-blue-400 uppercase tracking-wider text-sm">Chain-of-Thought (Hero)</span>
                 {cotLoading && <span className="text-xs text-blue-400 animate-pulse">Thinking...</span>}
            </div>

            <div className="flex-1 overflow-auto z-10 space-y-4">
                {cotReasoning && (
                    <ReasoningDisplay content={cotReasoning} isComplete={cotReasoningDone} />
                )}

                {cotResult && (
                    <ResultDisplay content={cotResult} />
                )}
            </div>
        </div>

      </div>
    </div>
  );
}
