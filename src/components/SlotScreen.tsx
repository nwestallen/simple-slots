import { Reel } from "./Reel"
import { useReelContext } from "../ReelContext"

interface SlotScreenProps {
    currentIndices: number[];
    destinations: number[] | null;
    onReelStop: (reelIndex: number, finalIdx: number) => void;
}

export const SlotScreen = ({ currentIndices, destinations, onReelStop }: SlotScreenProps) => {
    const { reels, rowCount } = useReelContext();
    return (
        <div
            className="w-full justify-center border-8 border-grey-800 flex flex-row overflow-clip"
            style={{ height: `${rowCount * 10}vh` }}
        >
            {reels.map((symbols, i) => (
                <Reel
                    key={i}
                    symbols={symbols}
                    reelIndex={i}
                    currentIdx={currentIndices[i]}
                    destinationIdx={destinations ? destinations[i] : null}
                    onStop={(finalIdx) => onReelStop(i, finalIdx)}
                />
            ))}
        </div>
    )
}
