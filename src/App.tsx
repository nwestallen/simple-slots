import { useState } from "react";
import { SlotScreen } from "./components/SlotScreen";
import { arrWindow } from "./utils";

function App() {

  const reel1 = ["🍋", "🍊", "🎰", "🍒", "🍇", "🔔", "🍀"];
  const [reels, setReels] = useState([
    arrWindow(reel1, 3, 0), 
    arrWindow(reel1, 3, 2), 
    arrWindow(reel1, 3, 6)])

  return (
    <div className='bg-slate-500 min-h-screen h-full'>
        <div className="flex flex-col items-center pt-16">
          <h1 className="text-6xl font-bold text-white">
            Slot Simulation
            </h1>
        <div className='m-16'>
        <SlotScreen reels={reels}/>
        </div>
        </div>
    </div>
  )
}

export default App
