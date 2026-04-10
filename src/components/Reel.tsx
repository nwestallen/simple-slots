import { useEffect, useRef, useState, useCallback } from "react"
import { Block } from "./Block"
import { reelSlice } from "../utils"

interface ReelProps {
    symbols: (string | number)[];
    windowSize: number;
    currentIdx: number;
    destinationIdx: number | null;
    extraCycles: number;
    speed: number;
    onStop: (finalIdx: number) => void;
}

const idleStrip = (symbols: (string | number)[], windowSize: number, centerIdx: number) => {
    const topIdx = centerIdx - Math.floor(windowSize / 2);
    return reelSlice(symbols, windowSize + 1, topIdx - 1);
};

export const Reel = ({ symbols, windowSize, currentIdx, destinationIdx, extraCycles, speed, onStop }: ReelProps) => {
    const topIdx = useRef(currentIdx - Math.floor(windowSize / 2));
    const stepsRemaining = useRef(0);
    const totalSteps = useRef(0);
    const isAnimating = useRef(false);

    // Idle: n+1 blocks with extra at top, shifted up by -10vh to hide it
    const [durationMs, setDurationMs] = useState(50);
    const [offset, setOffset] = useState("-10vh");
    const [transitionOn, setTransitionOn] = useState(false);
    const [blocks, setBlocks] = useState<(string | number)[]>(
        idleStrip(symbols, windowSize, currentIdx)
    );

    const doStep = useCallback(() => {
        const progress = 1 - (stepsRemaining.current / totalSteps.current);
        setDurationMs(Math.round((50 + 200 * (progress ** 2)) / speed));

        // Strip: [incoming_top, ...n visible blocks] — extra at top
        setBlocks(reelSlice(symbols, windowSize + 1, topIdx.current - 1));
        setTransitionOn(true);

        requestAnimationFrame(() => {
            // Slide down to 0: incoming block enters from top, bottom exits
            setOffset("0vh");
        });
    }, [symbols, windowSize, speed]);

    const handleTransitionEnd = useCallback(() => {
        if (!isAnimating.current) return;

        // Advance: topIdx decrements (reel scrolls downward)
        const reelLen = symbols.length;
        topIdx.current = (topIdx.current - 1 + reelLen) % reelLen;
        stepsRemaining.current -= 1;

        // Instant reset: disable transition, snap back to -10vh
        setTransitionOn(false);
        setOffset("-10vh");
        setBlocks(reelSlice(symbols, windowSize + 1, topIdx.current - 1));

        if (stepsRemaining.current > 0) {
            requestAnimationFrame(() => doStep());
        } else {
            isAnimating.current = false;
            const finalCenter = (topIdx.current + Math.floor(windowSize / 2) + symbols.length) % symbols.length;
            // Stay at n+1 blocks for seamless look
            setBlocks(idleStrip(symbols, windowSize, finalCenter));
            onStop(finalCenter);
        }
    }, [symbols, windowSize, doStep, onStop]);

    useEffect(() => {
        if (destinationIdx === null || isAnimating.current) return;

        isAnimating.current = true;
        topIdx.current = currentIdx - Math.floor(windowSize / 2);

        const destTop = destinationIdx - Math.floor(windowSize / 2);
        const reelLen = symbols.length;
        // Decrementing direction: how many steps to go from current to dest
        const raw = ((topIdx.current - destTop) % reelLen + reelLen) % reelLen;
        const total = raw + extraCycles * reelLen;

        stepsRemaining.current = total;
        totalSteps.current = total;

        requestAnimationFrame(() => doStep());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [destinationIdx]);

    return (
        <div
            className={`flex flex-col w-full ${transitionOn ? 'transition-transform' : ''}`}
            style={{
                transform: `translateY(${offset})`,
                transitionDuration: `${durationMs}ms`,
                transitionTimingFunction: 'linear',
            }}
            onTransitionEnd={handleTransitionEnd}
        >
            {blocks.map((symbol, i) => (
                <Block key={i} symbol={symbol} />
            ))}
        </div>
    )
}
