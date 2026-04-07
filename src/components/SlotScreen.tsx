import { Reel } from "./Reel"

interface SlotScreenProps {
    reels: (number|string)[][]
}

export const SlotScreen = ({reels}: SlotScreenProps) => {
    return(
        <div className="w-80 justify-center border border-red-500 flex flex-row">
            {reels.map(reel => (<Reel blocks={reel}/>))}
        </div>
    )
}