import { useState, useRef, useCallback, useMemo } from "react";
import { SlotScreen } from "./SlotScreen";
import { useReelContext } from "../ReelContext";
import { randIdx, reelSlice } from "../utils";

export const SlotMachine = () => {
    const { reels, rowCount } = useReelContext();
    const [reelIndices, setReelIndices] = useState(() => reels.map(() => 0));
    const [prevReelCount, setPrevReelCount] = useState(reels.length);
    const [destinations, setDestinations] = useState<number[] | null>(null);
    const [spinning, setSpinning] = useState(false);
    const completedCount = useRef(0);

    if (reels.length !== prevReelCount) {
        setPrevReelCount(reels.length);
        setReelIndices((prev) => reels.map((_, i) => prev[i] ?? 0));
    }

    const visibleSymbols = useMemo(() =>
        reels.map((symbols, i) =>
            reelSlice(symbols, rowCount, reelIndices[i] - Math.floor(rowCount / 2))
        ),
        [reels, reelIndices, rowCount]
    );

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
        <div className="flex flex-col items-center bg-gray-300 p-8 mt-16 rounded-lg">
            <div>
                <SlotScreen
                    currentIndices={reelIndices}
                    destinations={destinations}
                    onReelStop={handleReelStop}
                />
            </div>
            <div id='slot scoreboard' className="flex flex-row my-4 justify-between w-full">
                <div className="bg-black text-white font-bold py-1 px-2 mx-1 rounded-sm w-1/3">CREDITS: 1200</div>
                <div className="bg-black text-white font-bold py-1 px-2 mx-1 rounded-sm w-1/4">WIN: </div>
                <div className="bg-black text-white font-bold py-1 px-2 mx-1 rounded-sm w-1/5">BET: 3</div>
            </div>
            <button
                className={`bg-white py-1 px-2 rounded-md font-bold text-xl
                border-black border-b-5 border-r-5 border-t-2 border-l-2 shadow-md
              ${spinning ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={spinReels}
                disabled={spinning}
            >
                SPIN
            </button>
        </div>
    );
};
