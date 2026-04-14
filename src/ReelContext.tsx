import { createContext, useContext, useState, useMemo, type ReactNode } from "react";

interface ReelContextValue {
    rowCount: number;
    extraCycles: number[];
    speed: number;
    setRowCount: (n: number) => void;
    setExtraCycles: (arr: number[]) => void;
    setSpeed: (n: number) => void;
}

const ReelContext = createContext<ReelContextValue | null>(null);

interface ReelProviderProps {
    children: ReactNode;
    initialRowCount?: number;
    initialExtraCycles?: number[];
    initialSpeed?: number;
}

export const ReelProvider = ({
    children,
    initialRowCount = 3,
    initialExtraCycles = [2, 3, 4],
    initialSpeed = 1.1,
}: ReelProviderProps) => {
    const [rowCount, setRowCount] = useState(initialRowCount);
    const [extraCycles, setExtraCycles] = useState(initialExtraCycles);
    const [speed, setSpeed] = useState(initialSpeed);

    const value = useMemo(
        () => ({ rowCount, extraCycles, speed, setRowCount, setExtraCycles, setSpeed }),
        [rowCount, extraCycles, speed]
    );

    return <ReelContext.Provider value={value}>{children}</ReelContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useReelContext = () => {
    const ctx = useContext(ReelContext);
    if (!ctx) throw new Error("useReelContext must be used within a ReelProvider");
    return ctx;
};
