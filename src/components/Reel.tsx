import { useLayoutEffect, useRef, useState } from "react"
import { Block } from "./Block"
import { reelSlice } from "../utils"
import { useReelContext } from "../ReelContext"

interface ReelProps {
    symbols: (string | number)[];
    reelIndex: number;
    currentIdx: number;
    destinationIdx: number | null;
    onStop: (finalIdx: number) => void;
    highlightIdx?: number;
}

export const Reel = ({ symbols, reelIndex, currentIdx, destinationIdx, onStop, highlightIdx }: ReelProps) => {
    const { rowCount, extraCycles: extraCyclesArr, speed } = useReelContext();
    const extraCycles = extraCyclesArr[reelIndex] ?? extraCyclesArr[extraCyclesArr.length - 1];
    const elRef = useRef<HTMLDivElement>(null);
    const [spinBlocks, setSpinBlocks] = useState<(string | number)[] | null>(null);

    const blocks = spinBlocks ?? reelSlice(symbols, rowCount + 1, currentIdx - Math.floor(rowCount / 2) - 1);

    useLayoutEffect(() => {
        if (destinationIdx === null || !elRef.current) return;

        const reelLen = symbols.length;
        const initialTopIdx = currentIdx - Math.floor(rowCount / 2);
        const destTop = destinationIdx - Math.floor(rowCount / 2);
        const baseSteps = ((initialTopIdx - destTop) % reelLen + reelLen) % reelLen;
        const totalSteps = baseSteps + extraCycles * reelLen;

        const strip = reelSlice(symbols, totalSteps + 1 + rowCount, initialTopIdx - 1 - totalSteps);
        setSpinBlocks(strip);

        // Piecewise-linear deceleration + overshoot rebound.
        // Each linear step moves the strip 10vh in (30 + 120·p²)/speed ms; the
        // discrete velocity drops give the mechanical "brake" feel. After the
        // final step, the reel overshoots 5vh past the destination then snaps
        // back — momentum that a physical slot reel would have.
        const stepMs = (i: number) => (30 + 40 * (i / totalSteps) ** 8) / speed;
        const overshootMs = 90 / speed;
        const reboundMs = 140 / speed;
        const overshootVh = 5;

        let linearMs = 0;
        for (let i = 0; i < totalSteps; i++) linearMs += stepMs(i);
        const totalDuration = linearMs + overshootMs + reboundMs;

        const keyframes: Keyframe[] = [];
        let elapsed = 0;
        for (let i = 0; i <= totalSteps; i++) {
            keyframes.push({
                offset: elapsed / totalDuration,
                transform: `translateY(${-(totalSteps + 1 - i) * 10}vh)`,
                easing: 'linear',
            });
            if (i < totalSteps) elapsed += stepMs(i);
        }
        elapsed += overshootMs;
        keyframes.push({
            offset: elapsed / totalDuration,
            transform: `translateY(${-10 + overshootVh}vh)`,
            easing: 'linear',
        });
        keyframes.push({
            offset: 1,
            transform: 'translateY(-10vh)',
            easing: 'ease-out',
        });

        const anim = elRef.current.animate(keyframes, { duration: totalDuration, fill: 'both' });

        anim.finished.then(() => {
            anim.cancel();
            setSpinBlocks(null);
            onStop(destinationIdx);
        }).catch(() => {});

        return () => anim.cancel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [destinationIdx]);

    return (
        <div ref={elRef} className="flex flex-col w-full" style={{ transform: 'translateY(-10vh)' }}>
            {blocks.map((symbol, i) => (
                <Block key={i} symbol={symbol} highlighted={i == highlightIdx}/>
            ))}
        </div>
    )
}
