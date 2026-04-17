interface ScorecardProps {
    label: string;
    value: string | number;
    className?: string;
}

export const Scorecard = ({ label, value, className = "" }: ScorecardProps) => {
    return (
        <div className={`bg-black text-white font-bold py-1 px-2 mx-1 rounded-sm ${className}`}>
            {label}: {value}
        </div>
    );
};