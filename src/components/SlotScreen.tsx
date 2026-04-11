import { Reel } from "./Reel"
import { useReelContext } from "../ReelContext"

interface SlotScreenProps {
    symbols: (string | number)[];
    currentIndices: number[];
    destinations: number[] | null;
    onReelStop: (reelIndex: number, finalIdx: number) => void;
}

export const SlotScreen = ({ symbols, currentIndices, destinations, onReelStop }: SlotScreenProps) => {
    const { rowCount } = useReelContext();
    return (
        <div
            className="w-full justify-center border border-red-500 flex flex-row overflow-clip"
            style={{ height: `${rowCount * 10}vh` }}
        >
            {currentIndices.map((currentIdx, i) => (
                <Reel
                    key={i}
                    symbols={symbols}
                    reelIndex={i}
                    currentIdx={currentIdx}
                    destinationIdx={destinations ? destinations[i] : null}
                    onStop={(finalIdx) => onReelStop(i, finalIdx)}
                />
            ))}
        </div>
    )
}
