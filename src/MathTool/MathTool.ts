export class MathTool {
    public static sum<T extends number>(arr: T[]): T {
        let sum = 0;
        for (const num of arr) sum += num;
        return sum as T;
    }

    public static mean<T extends number>(arr: T[]): T {
        return (MathTool.sum(arr) / arr.length) as T;
    }

    public static variance(arr: number[], mean: number): number {
        return arr.reduce((sum, curr) => sum + (curr - mean) ** 2, 0) / (arr.length - 1);
    }

    public static getStudentTDistributionCriticalValue(degreeOfFreedom: number): number {
        return degreeOfFreedom in MathTool.tDistributionTable
            ? MathTool.tDistributionTable[degreeOfFreedom]
            : MathTool.tDistributionTable.infinity;
    }

    /**
     * T-Distribution two-tailed critical values for 95% confidence.
     * For more info see http://www.itl.nist.gov/div898/handbook/eda/section3/eda3672.htm.
     */
    private static tDistributionTable: Record<number | 'infinity', number> = {
        1: 12.706,
        2: 4.303,
        3: 3.182,
        4: 2.776,
        5: 2.571,
        6: 2.447,
        7: 2.365,
        8: 2.306,
        9: 2.262,
        10: 2.228,
        11: 2.201,
        12: 2.179,
        13: 2.16,
        14: 2.145,
        15: 2.131,
        16: 2.12,
        17: 2.11,
        18: 2.101,
        19: 2.093,
        20: 2.086,
        21: 2.08,
        22: 2.074,
        23: 2.069,
        24: 2.064,
        25: 2.06,
        26: 2.056,
        27: 2.052,
        28: 2.048,
        29: 2.045,
        30: 2.042,
        31: 2.04,
        32: 2.037,
        33: 2.035,
        34: 2.032,
        35: 2.03,
        36: 2.028,
        37: 2.026,
        38: 2.024,
        39: 2.023,
        40: 2.021,
        41: 2.02,
        42: 2.018,
        43: 2.017,
        44: 2.015,
        45: 2.014,
        46: 2.013,
        47: 2.012,
        48: 2.011,
        49: 2.01,
        50: 2.009,
        51: 2.008,
        52: 2.007,
        53: 2.006,
        54: 2.005,
        55: 2.004,
        56: 2.003,
        57: 2.002,
        58: 2.002,
        59: 2.001,
        60: 2,
        61: 2,
        62: 1.999,
        63: 1.998,
        64: 1.998,
        65: 1.997,
        66: 1.997,
        67: 1.996,
        68: 1.995,
        69: 1.995,
        70: 1.994,
        71: 1.994,
        72: 1.993,
        73: 1.993,
        74: 1.993,
        75: 1.992,
        76: 1.992,
        77: 1.991,
        78: 1.991,
        79: 1.99,
        80: 1.99,
        81: 1.99,
        82: 1.989,
        83: 1.989,
        84: 1.989,
        85: 1.988,
        86: 1.988,
        87: 1.988,
        88: 1.987,
        89: 1.987,
        90: 1.987,
        91: 1.986,
        92: 1.986,
        93: 1.986,
        94: 1.986,
        95: 1.985,
        96: 1.985,
        97: 1.985,
        98: 1.984,
        99: 1.984,
        100: 1.984,
        infinity: 1.96,
    };
}
