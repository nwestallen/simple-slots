export const arrWindow = (array: (string|number)[], winLength: number, idx: number): number[] => {

    const l = array.length;
    const half = Math.floor(winLength / 2);
    const res = new Array(winLength);
    
    for (let i = 0; i < winLength; i++) {
        let pos = (idx - half + i) % l;
        if (pos < 0) pos += l;
        res[i] = array[pos];
    }
    return res;
};
