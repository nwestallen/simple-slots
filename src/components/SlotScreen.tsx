import { Reel } from "./Reel"

interface SlotScreenProps {
    symbols: (string | number)[];
    windowSize: number;
    currentIndices: number[];
    destinations: number[] | null;
    extraCycles: number[];
    speed: number;
    onReelStop: (reelIndex: number, finalIdx: number) => void;
}

export const SlotScreen = ({ symbols, windowSize, currentIndices, destinations, extraCycles, speed, onReelStop }: SlotScreenProps) => {
    return (
        <div
            className="w-full justify-center border border-red-500 flex flex-row overflow-clip"
            style={{ height: `${windowSize * 10}vh` }}
        >
            {currentIndices.map((currentIdx, i) => (
                <Reel
                    key={i}
                    symbols={symbols}
                    windowSize={windowSize}
                    currentIdx={currentIdx}
                    destinationIdx={destinations ? destinations[i] : null}
                    extraCycles={extraCycles[i]}
                    speed={speed}
                    onStop={(finalIdx) => onReelStop(i, finalIdx)}
                />
            ))}
        </div>
    )
}
