
export interface BlockProps {
    symbol: (string|number);
}

export const Block = ({symbol}: BlockProps) => {
    return (
        <div className="bg-stone-50 text-[4em] p-1 aspect-square flex items-center
         justify-center border border-solid border-gray-300">
            {symbol}
            </div>
    )
    
}

