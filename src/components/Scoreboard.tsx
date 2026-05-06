import { Scorecard } from "./Scorecard";

interface ScoreboardProps {
    credits: number;
    win: string | number;
    bet: number;
}

export const Scoreboard = ({ credits, win, bet }: ScoreboardProps) => {
    return (
        <div id='slot scoreboard' className="flex flex-row my-4 justify-between w-full">
            <Scorecard label="CREDITS" value={credits} className="w-3/7" />
            <Scorecard label="WIN" value={win} className="w-1/3" />
            <Scorecard label="BET" value={bet} className="w-1/5" />
        </div>
    );
};