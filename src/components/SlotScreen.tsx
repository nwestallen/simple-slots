import { Reel } from "./Reel"
import { useReelContext } from "../ReelContext"

interface SlotScreenProps {
    currentIndices: number[];
    destinations: number[] | null;
    onReelStop: (reelIndex: number, finalIdx: number) => void;
    highlights?: number[];
}

export const SlotScreen = ({ currentIndices, destinations, onReelStop, highlights }: SlotScreenProps) => {
    const { reels, rowCount } = useReelContext();
    return (
        <div className="w-full border-8 border-gray-800">
            <div
                className="justify-center flex flex-row overflow-clip"
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
                        highlightIdx={highlights ? highlights[i] : undefined}
                    />
                ))}
            </div>
        </div>
    )
}
