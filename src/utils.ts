export const reelSlice = (array: (string|number)[], count: number, topIdx: number): (string|number)[] => {
    const l = array.length;
    const res = new Array(count);
    for (let i = 0; i < count; i++) {
        let pos = (topIdx + i) % l;
        if (pos < 0) pos += l;
        res[i] = array[pos];
    }
    return res;
};

export const randIdx = (len: number): number => Math.floor(Math.random() * len);

export const getPayOut = (payMap: Map<string, number>, payLine: number[], reels: (string|number)[][]): number => {
    const line = payLine.map((p, i) => reels[i][p]).join("");
    return  payMap.get(line) ?? 0;
}