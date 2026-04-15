import { useState, useRef, useCallback } from "react";
import { SlotScreen } from "./components/SlotScreen";
import { ReelProvider } from "./ReelContext";
import { randIdx } from "./utils";
import { ReelSettings } from "./components/ReelSettings";

const defaultReels: (string | number)[][] = [
  ["🍋", "🍊", "🎰", "🍒", "🍇", "🔔", "🍀"],
  ["🍋", "🍊", "🎰", "🍒", "🍇", "🔔", "🍀"],
  ["🍋", "🍊", "🎰", "🍒", "🍇", "🔔", "🍀"],
];

function App() {
  const [reels, setReels] = useState(defaultReels);
  const [reelIndices, setReelIndices] = useState(() => reels.map(() => 0));
  const [prevReelCount, setPrevReelCount] = useState(reels.length);
  const [destinations, setDestinations] = useState<number[] | null>(null);
  const [spinning, setSpinning] = useState(false);
  const completedCount = useRef(0);

  if (reels.length !== prevReelCount) {
    setPrevReelCount(reels.length);
    setReelIndices((prev) => reels.map((_, i) => prev[i] ?? 0));
  }

  const spinReels = () => {
    if (spinning) return;
    completedCount.current = 0;
    const dests = reels.map((reel) => randIdx(reel.length));
    setDestinations(dests);
    setSpinning(true);
  };

  const handleReelStop = useCallback(
    (reelIndex: number, finalIdx: number) => {
      setReelIndices((prev) => {
        const next = [...prev];
        next[reelIndex] = finalIdx;
        return next;
      });
      completedCount.current += 1;
      if (completedCount.current >= reels.length) {
        setDestinations(null);
        setSpinning(false);
      }
    },
    [reels.length],
  );

  return (
    <ReelProvider>
      <div className="bg-gray-900 min-h-screen h-full flex flex-col items-center">
        <h1 className="text-6xl font-bold text-white mt-16">Slot Simulation</h1>
        <div className="flex flex-row">
          <div className="flex flex-col items-center bg-gray-300 p-8 mt-16 rounded-lg">
            <div>
              <SlotScreen
                reels={reels}
                currentIndices={reelIndices}
                destinations={destinations}
                onReelStop={handleReelStop}
              />
            </div>
            <div id='slot scoreboard' className="flex flex-row my-8 justify-between w-full">
              <div className="bg-black text-white py-1 px-2 mx-1 rounded-sm">CREDITS: 1200</div>
              <div className="bg-black text-white py-1 px-2 mx-1 rounded-sm">WIN: </div>
              <div className="bg-black text-white py-1 px-2 mx-1 rounded-sm">BET: 3</div>
            </div>
            <button
              className={`bg-red-500 text-white p-2 rounded-xl font-bold text-2xl
              ${spinning ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={spinReels}
              disabled={spinning}
            >
              SPIN
            </button>
          </div>
          <ReelSettings />
        </div>
      </div>
    </ReelProvider>
  );
}

export default App;
