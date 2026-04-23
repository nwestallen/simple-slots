import { ReelProvider } from "./ReelContext";
import { SlotMachine } from "./components/SlotMachine";
import { ReelSettings } from "./components/ReelSettings";
import { PayTable } from "./components/PayTable";

function App() {
  return (
    <ReelProvider>
      <div className="bg-gray-900 min-h-screen h-full flex flex-col items-center">
        <h1 className="text-6xl font-bold text-white mt-16">Slot Simulation</h1>
        <div className="flex flex-row">
          <SlotMachine />
          <ReelSettings />
        </div>
        <div className='pt-12'>
          <PayTable />
        </div>
      </div>
    </ReelProvider>
  );
}

export default App;
