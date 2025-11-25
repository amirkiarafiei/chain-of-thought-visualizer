"use client";

import { useState } from "react";
import ChallengeGrid, { Challenge } from "@/components/ChallengeGrid";
import ComparisonArena from "@/components/ComparisonArena";
import Footer from "@/components/Footer";

export default function Home() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 flex flex-col">
        <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />

        <div className="flex-1 flex flex-col min-h-0 relative z-10">
          {selectedChallenge ? (
              <ComparisonArena
                  challenge={selectedChallenge}
                  onBack={() => setSelectedChallenge(null)}
              />
          ) : (
              <ChallengeGrid onSelectChallenge={setSelectedChallenge} />
          )}
        </div>

        <Footer />
    </main>
  );
}
