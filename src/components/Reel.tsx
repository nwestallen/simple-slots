import { Block } from "./Block"

interface ReelProps {
    blocks: string[]
}

export const Reel = ({blocks}: ReelProps) => {
    return(
        <div className="flex flex-col">
            {blocks.map((block) => (
                <Block symbol={block}/>
            ))}
        </div>
    )
}