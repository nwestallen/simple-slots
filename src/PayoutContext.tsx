import { createContext, useContext, useState, type ReactNode } from "react";

interface PayoutContextValue {
    payOuts: Map<string, number>;
    setPayOuts: (m: Map<string, number>) => void;
}

const PayoutContext = createContext<PayoutContextValue | null>(null);

const defaultPayOuts = new Map<string, number>([
    ["🎰🎰🎰", 1000],
    ["🍀🍀🍀", 500],
    ["🔔🔔🔔", 250],
    ["🍒🍒🍒", 100],
    ["🍇🍇🍇", 75],
    ["🍊🍊🍊", 50],
    ["🍋🍋🍋", 25],
]);

interface PayoutProviderProps {
    children: ReactNode;
    initialPayOuts?: Map<string, number>;
}

export const PayoutProvider = ({
    children,
    initialPayOuts = defaultPayOuts,
}: PayoutProviderProps) => {
    const [payOuts, setPayOuts] = useState(initialPayOuts);

    const value = { payOuts, setPayOuts };

    return <PayoutContext.Provider value={value}>{children}</PayoutContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePayoutContext = () => {
    const ctx = useContext(PayoutContext);
    if (!ctx) throw new Error("usePayoutContext must be used within a PayoutProvider");
    return ctx;
};
