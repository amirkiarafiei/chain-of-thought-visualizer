"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Calculator, Lightbulb, MessageSquareQuote, Shapes, Sparkles, Users, Coins, Flag } from "lucide-react";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: React.ReactNode;
  category: string;
  color: string; // Add color for dynamic styling
};

const challenges: Challenge[] = [
  {
    id: "arithmetic",
    title: "Arithmetic",
    description: "A deceptive math problem.",
    prompt: "The cafeteria had 23 apples. They used 20 for lunch and bought 6 more. How many now?",
    icon: <Calculator className="w-8 h-8 text-blue-400" />,
    category: "Math",
    color: "group-hover:text-blue-400",
  },
  {
    id: "symbolic",
    title: "Symbolic",
    description: "String manipulation task.",
    prompt: "Take the last letters of the words 'Amy Brown' and concatenate them.",
    icon: <Shapes className="w-8 h-8 text-purple-400" />,
    category: "Symbolic",
    color: "group-hover:text-purple-400",
  },
  {
    id: "logic",
    title: "Logic",
    description: "Multi-step logical reasoning.",
    prompt: "Roger has 5 tennis balls. He buys 2 cans of 3 balls each. How many balls does he have?",
    icon: <Brain className="w-8 h-8 text-pink-400" />,
    category: "Logic",
    color: "group-hover:text-pink-400",
  },
  {
    id: "commonsense",
    title: "Commonsense",
    description: "Real-world physics/logic.",
    prompt: "If it takes 1 hour to dry 3 shirts in the sun, how long does it take to dry 30 shirts?",
    icon: <Lightbulb className="w-8 h-8 text-yellow-400" />,
    category: "Commonsense",
    color: "group-hover:text-yellow-400",
  },
  {
    id: "riddle",
    title: "Riddle",
    description: "Abstract thinking.",
    prompt: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    icon: <MessageSquareQuote className="w-8 h-8 text-green-400" />,
    category: "Riddle",
    color: "group-hover:text-green-400",
  },
  {
    id: "pattern",
    title: "Pattern",
    description: "Sequence recognition.",
    prompt: "What are the next two letters in this sequence: M, T, W, T, F, ...?",
    icon: <Sparkles className="w-8 h-8 text-orange-400" />,
    category: "Pattern",
    color: "group-hover:text-orange-400",
  },
  {
    id: "age",
    title: "Age Logic",
    description: "A classic reasoning trap.",
    prompt: "When I was 6, my sister was half my age. Now I am 70, how old is my sister?",
    icon: <Users className="w-8 h-8 text-cyan-400" />,
    category: "Logic",
    color: "group-hover:text-cyan-400",
  },
  {
    id: "cost",
    title: "Cost Trap",
    description: "System 1 vs System 2 thinking.",
    prompt: "A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost?",
    icon: <Coins className="w-8 h-8 text-rose-400" />,
    category: "Math",
    color: "group-hover:text-rose-400",
  },
  {
    id: "race",
    title: "The Race",
    description: "A quick logic trap.",
    prompt: "You are running a race and you pass the person in second place. What place are you in?",
    icon: <Flag className="w-8 h-8 text-indigo-400" />,
    category: "Logic",
    color: "group-hover:text-indigo-400",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
         <AnimatePresence>
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: index * 0.1 
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
                whileHover={{ 
                    scale: 1.03, 
                    y: -5,
                    transition: { type: "spring", stiffness: 400, damping: 10 } 
                }}
                whileTap={{ scale: 0.95 }}
                layoutId={`card-${challenge.id}`}
                onClick={() => onSelectChallenge(challenge)}
                className="cursor-pointer h-full"
              >
                <Card className="h-full bg-zinc-900/40 border-white/10 group-hover:border-blue-500/50 hover:bg-zinc-800/60 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)] transition-all duration-300 backdrop-blur-md group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardHeader className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-white/5 ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                            {challenge.icon}
                        </div>
                        </div>
                        <CardTitle className={`text-xl text-white mb-2 ${challenge.color} transition-colors`}>{challenge.title}</CardTitle>
                        <CardDescription className="text-white/50 group-hover:text-white/80 transition-colors">
                        {challenge.description}
                        </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
