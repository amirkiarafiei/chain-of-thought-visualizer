"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Settings, ExternalLink, ShieldAlert, Key, Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsSidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  useCustomLLM: boolean;
  setUseCustomLLM: (value: boolean) => void;
  customApiKey: string;
  setCustomApiKey: (value: string) => void;
  customModel: string;
  setCustomModel: (value: string) => void;
}

export default function SettingsSidebar({
  isOpen,
  setIsOpen,
  useCustomLLM,
  setUseCustomLLM,
  customApiKey,
  setCustomApiKey,
  customModel,
  setCustomModel,
}: SettingsSidebarProps) {
  const maskApiKey = (key: string) => {
    if (key.length <= 4) return key;
    return "••••••••" + key.slice(-4);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-[300px] bg-zinc-900/95 backdrop-blur-xl border-r border-white/10 z-50 shadow-2xl"
          >
            <div className="p-5 h-full flex flex-col gap-4 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  <span className="text-lg font-semibold text-white">LLM Settings</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Toggle Switch */}
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-white/5 shrink-0">
                <span className="text-xs text-white/60 uppercase tracking-wider block mb-3">Mode</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={!useCustomLLM ? "default" : "ghost"}
                    onClick={() => setUseCustomLLM(false)}
                    className={`flex-1 ${!useCustomLLM ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-white/10"}`}
                  >
                    Default
                  </Button>
                  <Button
                    size="sm"
                    variant={useCustomLLM ? "default" : "ghost"}
                    onClick={() => setUseCustomLLM(true)}
                    className={`flex-1 ${useCustomLLM ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-white/10"}`}
                  >
                    Custom
                  </Button>
                </div>
              </div>

              {/* Custom LLM Settings */}
              <AnimatePresence>
                {useCustomLLM && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 overflow-hidden shrink-0"
                  >
                    {/* API Key Input */}
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-white/5">
                      <label className="flex items-center gap-2 text-xs text-white/60 uppercase tracking-wider mb-2">
                        <Key className="w-3 h-3" />
                        OpenRouter API Key
                      </label>
                      <input
                        type="password"
                        value={customApiKey}
                        onChange={(e) => setCustomApiKey(e.target.value)}
                        placeholder="sk-or-..."
                        className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      {customApiKey && (
                        <p className="text-xs text-white/40 mt-2">
                          Key: {maskApiKey(customApiKey)}
                        </p>
                      )}
                    </div>

                    {/* Model Input */}
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-white/5">
                      <label className="flex items-center gap-2 text-xs text-white/60 uppercase tracking-wider mb-2">
                        <Bot className="w-3 h-3" />
                        Model Name
                      </label>
                      <input
                        type="text"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder="google/gemma-3-27b-it:free"
                        className="w-full bg-black/30 border border-white/10 rounded-md px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      />
                      <a
                        href="https://openrouter.ai/models"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 mt-2 transition-colors"
                      >
                        Browse models on OpenRouter
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    {/* Security Disclaimer */}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                        <div className="text-xs text-yellow-200/80 leading-relaxed">
                          <p className="font-medium text-yellow-400 mb-1">Security Notice</p>
                          <p>
                            Your API key is stored in memory only and is never sent to our servers. 
                            This is an{" "}
                            <a
                              href="https://github.com/amirkiarafiei/chain-of-thought-visualizer"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-yellow-300"
                            >
                              open-source project
                            </a>
                            . For safety, use temporary or limited-scope keys.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Current Mode Indicator */}
              <div className="mt-auto pt-4 border-t border-white/10 shrink-0">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2.5 h-2.5 rounded-full ${useCustomLLM ? "bg-purple-500" : "bg-blue-500"}`} />
                  <span className="text-white/60">
                    Using: <span className="text-white/90 font-mono">{useCustomLLM ? (customModel || "Custom Model") : "gemini-2.5-flash-lite"}</span>
                  </span>
                </div>
              </div>

              {/* Close hint */}
              <div className="flex items-center justify-center gap-2 text-xs text-white/30 pt-2">
                <span>Click outside or press</span>
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50">ESC</kbd>
                <span>to close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
