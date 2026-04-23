import { useRef, useState } from "react";
import { SlotScreen } from "./SlotScreen";
import { Scoreboard } from "./Scoreboard";
import { SlotButton } from "./SlotButton";
import { useReelContext } from "../ReelContext";
import { checkWin, payoutMap, randIdx, reelSlice } from "../utils";

export const SlotMachine = () => {
    const { reels, rowCount } = useReelContext();
    const [reelIndices, setReelIndices] = useState(() => reels.map(() => 0));
    const reelIndicesRef = useRef(reelIndices);
    const [prevReelCount, setPrevReelCount] = useState(reels.length);
    const [destinations, setDestinations] = useState<number[] | null>(null);
    const [spinning, setSpinning] = useState(false);
    const completedCountRef = useRef(0);
    const [bet, setBet] = useState(1);
    const [credits, setCredits] = useState(1500);
    const [maxBet, setMaxBet] = useState(3);
    const [maxxed, setMaxxed] = useState(false);
    const [win, setWin] = useState<string | number>("")

    if (reels.length !== prevReelCount) {
        setPrevReelCount(reels.length);
        setReelIndices((prev) => reels.map((_, i) => prev[i] ?? 0));
    }

    const spinReels = () => {
        if (spinning) return;
        setCredits(c => c - bet);
        setWin("");
        reelIndicesRef.current = reelIndices;
        completedCountRef.current = 0;
        const dests = reels.map((reel) => randIdx(reel.length));
        setDestinations(dests);
        setSpinning(true);
    };

    const handleReelStop = (reelIndex: number, finalIdx: number) => {
        const nextIndices = reelIndicesRef.current.map((v, i) => i === reelIndex ? finalIdx : v);
        reelIndicesRef.current = nextIndices;
        setReelIndices(nextIndices);
        completedCountRef.current += 1;

        if (completedCountRef.current >= reels.length) {
            console.log("reels stopped");

            const midRow = Math.floor(rowCount / 2);
            const finalVisible = reels.map((symbols, i) =>
                reelSlice(symbols, rowCount, nextIndices[i] - midRow)
            );
            const payLine = reels.map(() => midRow);

            setDestinations(null);
            setSpinning(false);
            setMaxxed(false);

            if (checkWin(payLine, finalVisible)) {
                const winSymbol = finalVisible[0][midRow] as keyof typeof payoutMap;
                setWin(payoutMap[winSymbol] * bet);
                setCredits(c => c + payoutMap[winSymbol] * bet);
            }
        }
    };

    const handleBet = () => {
        if (bet == maxBet) {
            setBet(1);
        } else if (bet == maxBet - 1) {
            setBet(maxBet);
            setMaxxed(true);
        } else {
            setBet(b => b + 1)
        }
    }

    const handleMaxBet = () => {
        setBet(maxBet);
        setMaxxed(true);
        spinReels();
    }
    

    return (
        <div className="flex flex-col items-center bg-gray-300 p-8 mt-16 rounded-lg">
            <div>
                <SlotScreen
                    currentIndices={reelIndices}
                    destinations={destinations}
                    onReelStop={handleReelStop}
                />
            </div>
            <Scoreboard credits={credits} win={win} bet={bet} />
            <div className='flex flex-row justify-evenly w-full'>
            <SlotButton onClick={handleBet} disabled={maxxed || spinning}>
                BET ONE
            </SlotButton>
            <SlotButton onClick={handleMaxBet} disabled={spinning}>
                BET MAX
            </SlotButton>
            <SlotButton onClick={spinReels} disabled={spinning}>
                SPIN
            </SlotButton>
            </div>
        </div>
    );
};
