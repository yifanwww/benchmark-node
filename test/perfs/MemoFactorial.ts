import { Benchmark } from '../../src';

function factorial(n: number) {
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

let memoized: number[];

function memoFactorial(n: number) {
    if (n < memoized.length) return memoized[n];

    let i = memoized.length;
    memoized.length = n + 1;
    for (; i <= n; i++) memoized[i] = memoized[i - 1] * i;

    return memoized[n];
}

const benchmark = new Benchmark();

benchmark.add('factorial', () => factorial(20));
benchmark.add('memo-factorial', () => memoFactorial(20), {
    setup: () => {
        memoized = [1, 1];
    },
});
benchmark.add('factorial-multi', () => {
    let res;
    for (let a = 1; a <= 20; a++) {
        for (let b = 1; b <= 20; b++) {
            res = (factorial(a - 1) * factorial(b - 1)) / factorial(a + b - 1);
        }
    }
    return res;
});
benchmark.add(
    'memo-factorial-multi',
    () => {
        let res;
        for (let a = 1; a <= 20; a++) {
            for (let b = 1; b <= 20; b++) {
                res = (memoFactorial(a - 1) * memoFactorial(b - 1)) / memoFactorial(a + b - 1);
            }
        }
        return res;
    },
    {
        setup: () => {
            memoized = [1, 1];
        },
    },
);

benchmark.run();
