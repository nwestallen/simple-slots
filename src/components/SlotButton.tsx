interface SlotButtonProps {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    className?: string;
}

export const SlotButton = ({ onClick, disabled = false, children, className = "" }: SlotButtonProps) => {
    return (
        <button
            className={`bg-white py-1 px-2 rounded-md font-bold text-xl
                border-black border-b-5 border-r-5 border-t-2 border-l-2 shadow-md
                ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};