
export interface BlockProps {
    symbol: (string|number);
}

export const Block = ({symbol}: BlockProps) => {
    return (
        <div className={`bg-stone-50 text-[4em] p-2 aspect-square flex items-center
         justify-center border-x border-solid border-gray-600 h-[10vh]`}>
            {symbol}
            </div>
    )
    
}

