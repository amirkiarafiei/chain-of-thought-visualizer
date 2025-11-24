"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Calculator, Lightbulb, MessageSquareQuote, Shapes } from "lucide-react";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  category: string;
};

const challenges: Challenge[] = [
  {
    id: "arithmetic",
    title: "Arithmetic",
    description: "A deceptive math problem.",
    prompt: "The cafeteria had 23 apples. They used 20 for lunch and bought 6 more. How many now?",
    icon: <Calculator className="w-8 h-8 text-blue-400" />,
    category: "Math",
  },
  {
    id: "symbolic",
    title: "Symbolic",
    description: "String manipulation task.",
    prompt: "Take the last letters of the words 'Amy Brown' and concatenate them.",
    icon: <Shapes className="w-8 h-8 text-purple-400" />,
    category: "Symbolic",
  },
  {
    id: "logic",
    title: "Logic",
    description: "Multi-step logical reasoning.",
    prompt: "Roger has 5 tennis balls. He buys 2 cans of 3 balls each. How many balls does he have?",
    icon: <Brain className="w-8 h-8 text-pink-400" />,
    category: "Logic",
  },
  {
    id: "commonsense",
    title: "Commonsense",
    description: "Real-world physics/logic.",
    prompt: "If it takes 1 hour to dry 3 shirts in the sun, how long does it take to dry 30 shirts?",
    icon: <Lightbulb className="w-8 h-8 text-yellow-400" />,
    category: "Commonsense",
  },
  {
    id: "riddle",
    title: "Riddle",
    description: "Abstract thinking.",
    prompt: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    icon: <MessageSquareQuote className="w-8 h-8 text-green-400" />,
    category: "Riddle",
  },
];

interface ChallengeGridProps {
  onSelectChallenge: (challenge: Challenge) => void;
}

export default function ChallengeGrid({ onSelectChallenge }: ChallengeGridProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
          CoT Visualizer
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          Explore how Chain-of-Thought reasoning changes the way AI thinks.
          Select a challenge to begin.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
         <AnimatePresence>
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                layoutId={`card-${challenge.id}`}
                onClick={() => onSelectChallenge(challenge)}
                className="cursor-pointer"
              >
                <Card className="h-full bg-zinc-900 border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700">{challenge.icon}</div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {challenge.category}
                      </span>
                    </div>
                    <CardTitle className="text-xl text-white">{challenge.title}</CardTitle>
                    <CardDescription className="text-white/60">
                      {challenge.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
