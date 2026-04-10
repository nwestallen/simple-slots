import { bench } from "vitest"
import { reelSlice } from "./utils"

const eightArr = [0, 1, 2, 3, 4, 5, 6, 7]

bench('arrWindow', () => {
    reelSlice(eightArr, 3, 7)
}, {time: 1000})

