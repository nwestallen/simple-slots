import {expect, test } from 'vitest'
import { arrWindow } from './utils'

const eightArr = [0, 1, 2, 3, 4, 5, 6, 7]

test('array window of size 3 centered', () => {
    expect(arrWindow(eightArr, 3, 3)).toStrictEqual([2,3,4])
})


test('array window of size 3 wrap', () => {
    expect(arrWindow(eightArr, 3, 7)).toStrictEqual([6,7,0])
})
