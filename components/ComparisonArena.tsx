"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Challenge } from "./ChallengeGrid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, RefreshCw, HelpCircle, Settings, Zap } from "lucide-react";
import ReasoningDisplay from "./ReasoningDisplay";
import ResultDisplay from "./ResultDisplay";
import SettingsSidebar from "./SettingsSidebar";
import { parseCoTStream, parseStandardStream } from "@/lib/streamParser";
import { useRateLimit } from "@/lib/useRateLimit";

interface ComparisonArenaProps {
  challenge: Challenge;
  onBack: () => void;
}

export default function ComparisonArena({ challenge, onBack }: ComparisonArenaProps) {
  const [isRunning, setIsRunning] = useState(false);

  // Standard Model State
  const [standardResult, setStandardResult] = useState("");
  const [standardLoading, setStandardLoading] = useState(false);
  const [standardError, setStandardError] = useState("");

  // CoT Model State
  const [cotReasoning, setCotReasoning] = useState("");
  const [cotResult, setCotResult] = useState("");
  const [cotLoading, setCotLoading] = useState(false);
  const [cotReasoningDone, setCotReasoningDone] = useState(false);
  const [cotError, setCotError] = useState("");

  // Custom LLM State
  const [useCustomLLM, setUseCustomLLM] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Rate Limiting
  const { 
    usesRemaining, 
    usesUsed, 
    maxUses, 
    canUse, 
    isLimitReached, 
    isLoading: rateLimitLoading,
    incrementUsage,
    getTimeUntilReset 
  } = useRateLimit();

  const canRunCustom = customApiKey.trim() !== "" && customModel.trim() !== "";
  const canRun = useCustomLLM ? canRunCustom : (canUse && !rateLimitLoading);

  const runSimulation = async () => {
    if (!canRun) return;
    
    // Only increment usage for default mode
    if (!useCustomLLM) {
      const allowed = incrementUsage();
      if (!allowed) return;
    }
    
    setIsRunning(true);

    // Reset States
    setStandardResult("");
    setCotReasoning("");
    setCotResult("");
    setCotReasoningDone(false);
    setStandardError("");
    setCotError("");

    setStandardLoading(true);
    setCotLoading(true);

    // Run both in parallel
    runStandard();
    runCoT();
  };

  const runStandard = async () => {
    try {
      const endpoint = useCustomLLM ? "/api/openrouter" : "/api/generate";
      const body = useCustomLLM 
        ? { prompt: challenge.prompt, mode: "standard", apiKey: customApiKey, model: customModel }
        : { prompt: challenge.prompt, mode: "standard" };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate response");
      }

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
      setStandardError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setStandardLoading(false);
    }
  };

  const runCoT = async () => {
    try {
      const endpoint = useCustomLLM ? "/api/openrouter" : "/api/generate";
      const body = useCustomLLM 
        ? { prompt: challenge.prompt, mode: "cot", apiKey: customApiKey, model: customModel }
        : { prompt: challenge.prompt, mode: "cot" };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate response");
      }

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
      setCotError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setCotLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-4">
      {/* Settings Sidebar - Fixed/Floating */}
      <SettingsSidebar
        isOpen={settingsOpen}
        setIsOpen={setSettingsOpen}
        useCustomLLM={useCustomLLM}
        setUseCustomLLM={setUseCustomLLM}
        customApiKey={customApiKey}
        setCustomApiKey={setCustomApiKey}
        customModel={customModel}
        setCustomModel={setCustomModel}
      />
        {/* Header */}
        <motion.div
          layoutId={`card-${challenge.id}`}
          className="bg-zinc-800/40 border border-white/20 backdrop-blur-md rounded-xl p-4 mb-4 flex flex-row justify-between items-center gap-4 shrink-0"
        >
          <div className="flex items-center gap-4 min-w-0">
              <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-white/10 shrink-0">
                  <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="p-2 rounded-lg bg-white/5 shrink-0">{challenge.icon}</div>
              <div className="min-w-0">
                  <h2 className="text-lg font-bold text-white truncate">{challenge.title}</h2>
                  <p className="text-white/60 text-sm truncate">&quot;{challenge.prompt}&quot;</p>
              </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Settings</span>
            </Button>

            {/* Usage Indicator - Only show in default mode */}
            {!useCustomLLM && !rateLimitLoading && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <Zap className={`w-3.5 h-3.5 ${isLimitReached ? "text-red-400" : "text-yellow-400"}`} />
                <div className="flex items-center gap-1.5">
                  {/* Progress dots */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: maxUses }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          i < usesUsed 
                            ? "bg-white/30" 
                            : "bg-blue-400"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${isLimitReached ? "text-red-400" : "text-white/60"}`}>
                    {usesRemaining}/{maxUses}
                  </span>
                </div>
              </div>
            )}

            {/* Mode Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className={`w-2 h-2 rounded-full ${useCustomLLM ? "bg-purple-500" : "bg-blue-500"}`} />
              <span className="text-xs text-white/60 font-mono">
                {useCustomLLM ? (customModel || "custom") : "gemini-2.5-flash-lite"}
              </span>
            </div>
            <Button
                size="sm"
                onClick={runSimulation}
                disabled={standardLoading || cotLoading || !canRun}
                className={`text-white shadow-lg shrink-0 ${
                  useCustomLLM 
                    ? "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20" 
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                }`}
            >
                {isRunning ? <RefreshCw className={`w-4 h-4 mr-2 ${(standardLoading || cotLoading) ? 'animate-spin' : ''}`} /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? "Rerun" : "Run"}
            </Button>
          </div>
        </motion.div>

        {/* Rate Limit Warning */}
        {!useCustomLLM && isLimitReached && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-4 shrink-0">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <p className="text-sm text-red-200 font-medium">Daily limit reached</p>
                <p className="text-xs text-red-200/70">
                  Resets in {getTimeUntilReset()}. Use your own API key in Settings for unlimited access.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Validation Warning */}
        {useCustomLLM && !canRunCustom && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-2 mb-4 text-sm text-yellow-200/80 shrink-0">
            Please enter your OpenRouter API key and model name in the settings panel.
          </div>
        )}

        {/* Arena Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">

          {/* Standard Model */}
          <div className="flex flex-col gap-3 bg-white/5 rounded-xl p-3 border border-white/10 h-full overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-white/60 uppercase tracking-wider text-xs">Standard (Fast)</span>
                    <div className="relative group">
                      <HelpCircle className="w-3.5 h-3.5 text-yellow-500/70 cursor-help" />
                      <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-zinc-800 border border-yellow-500/30 rounded-lg text-xs text-yellow-200/90 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] shadow-xl pointer-events-none">
                        <span className="font-semibold text-yellow-400">Demo Mode:</span> This model is intentionally prompted to give wrong answers to demonstrate the value of Chain-of-Thought reasoning.
                        <div className="absolute bottom-full left-4 border-4 border-transparent border-b-zinc-800" />
                      </div>
                    </div>
                  </div>
                  {standardLoading && <span className="text-xs text-blue-400 animate-pulse">Generating...</span>}
              </div>

              <div className="flex-1 overflow-auto">
                  {standardError && (
                    <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-4 text-red-200 text-sm">
                      Error: {standardError}
                    </div>
                  )}
                  {standardResult && (
                      <ResultDisplay content={standardResult} isWrong={true} />
                  )}
              </div>
          </div>

          {/* CoT Model */}
          <div className="flex flex-col gap-3 bg-white/5 rounded-xl p-3 border border-white/10 h-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between pb-2 border-b border-white/10 z-10 shrink-0">
                  <span className="font-semibold text-blue-400 uppercase tracking-wider text-xs">Chain-of-Thought (Reasoning)</span>
                   {cotLoading && <span className="text-xs text-blue-400 animate-pulse">Thinking...</span>}
              </div>

              <div className="flex-1 flex flex-col overflow-hidden z-10 gap-3">
                  {cotError && (
                    <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-4 text-red-200 text-sm">
                      Error: {cotError}
                    </div>
                  )}
                  <ReasoningDisplay content={cotReasoning} isComplete={cotReasoningDone} />

                  {cotResult && (
                      <ResultDisplay content={cotResult} />
                  )}
              </div>
          </div>

        </div>
    </div>
  );
}
