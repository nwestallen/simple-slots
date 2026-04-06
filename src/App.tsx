import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className="flex flex-col items-center mt-16">
          <h1 className="text-3xl font-bold text-green-500">
            Get started
            </h1>
        <button
          className="mt-4 bg-sky-500 text-white font-bold p-2 rounded-lg"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
        </div>
    </>
  )
}

export default App
