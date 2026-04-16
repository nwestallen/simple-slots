import {describe, expect, test } from 'vitest'
import { checkWin, reelSlice } from './utils'


describe('reelSlice function', () => {
const eightArr = [0, 1, 2, 3, 4, 5, 6, 7]

test('array window of size 3 centered', () => {
    expect(reelSlice(eightArr, 3, 3)).toStrictEqual([3, 4, 5])
})


test('array window of size 3 wrap', () => {
    expect(reelSlice(eightArr, 3, 7)).toStrictEqual([7, 0, 1])
})
})

describe('checkWin function', () => {
    const reelsArr = [["A", "A", "B"], ["B", "A", "C"], ["C", "A", "A"]];

    test('center line win', () => {
        expect(checkWin([1, 1, 1], reelsArr)).toStrictEqual(true)
    })

    test('top line loses', () => {
        expect(checkWin([0, 0, 0], reelsArr)).toStrictEqual(false)
    })

    test('diagonal win', () => {
        expect(checkWin([0, 1, 2], reelsArr)).toStrictEqual(true)
    })
})
