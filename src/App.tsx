import { useState, useRef, useCallback } from "react";
import { SlotScreen } from "./components/SlotScreen";
import { randIdx } from "./utils";

const WINDOW_SIZE = 4;
const EXTRA_CYCLES = [2, 3, 4];
const SPIN_SPEED = 1; // multiplier: >1 faster, <1 slower

function App() {
  const reel1 = ["🍋", "🍊", "🎰", "🍒", "🍇", "🔔", "🍀"];

  const [reelIndices, setReelIndices] = useState([0, 2, 6]);
  const [destinations, setDestinations] = useState<number[] | null>(null);
  const [spinning, setSpinning] = useState(false);
  const completedCount = useRef(0);

  const spinReels = () => {
    if (spinning) return;
    completedCount.current = 0;
    const dests = [
      randIdx(reel1.length),
      randIdx(reel1.length),
      randIdx(reel1.length),
    ];
    setDestinations(dests);
    setSpinning(true);
  };

  const handleReelStop = useCallback((reelIndex: number, finalIdx: number) => {
    setReelIndices(prev => {
      const next = [...prev];
      next[reelIndex] = finalIdx;
      return next;
    });
    completedCount.current += 1;
    if (completedCount.current >= reelIndices.length) {
      setDestinations(null);
      setSpinning(false);
    }
  }, [reelIndices.length]);

  return (
    <div className='bg-slate-500 min-h-screen h-full'>
      <div className="flex flex-col items-center pt-16">
        <h1 className="text-6xl font-bold text-white">
          Slot Simulation
        </h1>
        <div className='m-16'>
          <SlotScreen
            symbols={reel1}
            windowSize={WINDOW_SIZE}
            currentIndices={reelIndices}
            destinations={destinations}
            extraCycles={EXTRA_CYCLES}
            speed={SPIN_SPEED}
            onReelStop={handleReelStop}
          />
        </div>
        <button
          className={`bg-red-500 text-white p-2 rounded-xl font-bold text-2xl
            ${spinning ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={spinReels}
          disabled={spinning}
        >
          SPIN
        </button>
      </div>
    </div>
  )
}

export default App
