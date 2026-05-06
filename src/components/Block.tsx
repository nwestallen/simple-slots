
export interface BlockProps {
    symbol: (string|number);
    highlighted?: boolean;
}

export const Block = ({symbol, highlighted}: BlockProps) => {
    return (
        <div className={`bg-stone-50 text-[4em] p-2 aspect-square flex items-center
         justify-center border-x border-solid border-gray-600 h-[10vh]
         ${highlighted ? "border-red-500 border-x-6 border-y-6" : ""}`}>
            {symbol}
            </div>
    )
    
}

