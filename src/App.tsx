import { useState } from 'react'
import { Reel } from './components/Reel'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-slate-500 min-h-screen h-full'>
        <div className="flex flex-col items-center pt-16">
          <h1 className="text-3xl font-bold text-green-500">
            Get started
            </h1>
        <button
          className="mt-4 bg-sky-500 text-white font-bold p-2 rounded-lg"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
        <br/>
        <div className="w-128 border border-red-500">
        <Reel blocks={["🍋","$", "A", "🍊", "🎰"]}/>
        </div>
        </div>
    </div>
  )
}

export default App
