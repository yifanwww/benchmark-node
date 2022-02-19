import { Benchmark } from '../../src';

function factorial(n: number) {
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

new Benchmark()
    .addSetup(() => console.log('Setup!\n'))
    .addCleanup(() => console.log('Cleanup!\n'))
    .add('factorial', () => {
        let res;
        for (let a = 1; a <= 20; a++) {
            for (let b = 1; b <= 20; b++) {
                res = (factorial(a - 1) * factorial(b - 1)) / factorial(a + b - 1);
            }
        }
        return res;
    })
    .run();
