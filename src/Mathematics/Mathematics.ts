export class Mathematics {
    static sum<T extends number>(arr: T[]): T {
        let sum = 0;
        for (const num of arr) sum += num;
        return sum as T;
    }

    static mean<T extends number>(arr: T[]): T {
        return (Mathematics.sum(arr) / arr.length) as T;
    }

    static variance(arr: number[], mean: number): number {
        return arr.reduce((sum, curr) => sum + (curr - mean) ** 2, 0) / (arr.length - 1);
    }
}
