import { Block } from "./Block"

interface ReelProps {
    blocks: (string|number)[]
}

export const Reel = ({blocks}: ReelProps) => {
    return(
        <div className="flex flex-col w-full">
            {blocks.map((block) => (
                <Block symbol={block}/>
            ))}
        </div>
    )
}