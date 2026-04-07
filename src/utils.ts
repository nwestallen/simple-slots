const absMod = (n:number, d:number):number => ((n % d) + d) % d; 

export const arrWindow = (array:number[], length:number, idx:number):number[] => {
    if (length == 1) {
        return [array[idx]];
    } else {
        const res = [];
        for (let i = 0; i < length; i++) {
            res.push(array[absMod(i+(idx-1),array.length)])
        }
        return res;
    }
};
