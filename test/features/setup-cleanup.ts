import { BenchmarkJob } from '../../src';

function factorial(n: number) {
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

new BenchmarkJob()
    .setSetup(() => console.log('Global Setup!\n'))
    .setCleanup(() => console.log('Global Cleanup!\n'))
    .add(
        'factorial',
        () => {
            let res;
            for (let a = 1; a <= 20; a++) {
                for (let b = 1; b <= 20; b++) {
                    res = (factorial(a - 1) * factorial(b - 1)) / factorial(a + b - 1);
                }
            }
            return res;
        },
        {
            setup: () => console.log('Iteration Setup!'),
            cleanup: () => console.log('Iteration Cleanup!'),
        },
    )
    .run();
