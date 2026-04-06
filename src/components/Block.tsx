
export interface BlockProps {
    symbol: string;
}

export const Block = ({symbol}: BlockProps) => {
    return (
        <div className="bg-stone-50 p-1 text-9xl w-3xs aspect-square flex items-center
         justify-center border border-solid border-gray-300">
            {symbol}
            </div>
    )
    
}

