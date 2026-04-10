import {describe, expect, test } from 'vitest'
import { reelSlice } from './utils'


describe('arrWindow function', () => {
const eightArr = [0, 1, 2, 3, 4, 5, 6, 7]

test('array window of size 3 centered', () => {
    expect(reelSlice(eightArr, 3, 3)).toStrictEqual([3, 4, 5])
})


test('array window of size 3 wrap', () => {
    expect(reelSlice(eightArr, 3, 7)).toStrictEqual([7, 0, 1])
})
})
