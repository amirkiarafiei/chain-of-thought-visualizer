"use client";

import { useState } from "react";
import ChallengeGrid, { Challenge } from "@/components/ChallengeGrid";
import ComparisonArena from "@/components/ComparisonArena";

export default function Home() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30">
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

        {selectedChallenge ? (
            <ComparisonArena
                challenge={selectedChallenge}
                onBack={() => setSelectedChallenge(null)}
            />
        ) : (
            <ChallengeGrid onSelectChallenge={setSelectedChallenge} />
        )}
    </main>
  );
}
