import { createContext, useContext, useState, useMemo, type ReactNode } from "react";

interface ReelContextValue {
    reels: (string | number)[][];
    rowCount: number;
    extraCycles: number[];
    speed: number;
    setReels: (reels: (string | number)[][]) => void;
    setRowCount: (n: number) => void;
    setExtraCycles: (arr: number[]) => void;
    setSpeed: (n: number) => void;
}

const ReelContext = createContext<ReelContextValue | null>(null);

const defaultReels: (string | number)[][] = [
    ["🍋", "🍊", "🎰", "🍒", "🍇", "🔔", "🍀"],
    ["🍋", "🍊", "🎰", "🍒", "🍇", "🔔", "🍀"],
    ["🍋", "🍊", "🎰", "🍒", "🍇", "🔔", "🍀"],
];

interface ReelProviderProps {
    children: ReactNode;
    initialReels?: (string | number)[][];
    initialRowCount?: number;
    initialExtraCycles?: number[];
    initialSpeed?: number;
}

export const ReelProvider = ({
    children,
    initialReels = defaultReels,
    initialRowCount = 3,
    initialExtraCycles = [2, 3, 4],
    initialSpeed = 1.1,
}: ReelProviderProps) => {
    const [reels, setReels] = useState(initialReels);
    const [rowCount, setRowCount] = useState(initialRowCount);
    const [extraCycles, setExtraCycles] = useState(initialExtraCycles);
    const [speed, setSpeed] = useState(initialSpeed);

    const value = useMemo(
        () => ({ reels, rowCount, extraCycles, speed, setReels, setRowCount, setExtraCycles, setSpeed }),
        [reels, rowCount, extraCycles, speed]
    );

    return <ReelContext.Provider value={value}>{children}</ReelContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useReelContext = () => {
    const ctx = useContext(ReelContext);
    if (!ctx) throw new Error("useReelContext must be used within a ReelProvider");
    return ctx;
};
