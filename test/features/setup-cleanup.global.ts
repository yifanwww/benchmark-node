import { BenchmarkJob } from '../../src';

function factorial(n: number) {
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

new BenchmarkJob()
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

/*
Validating benchmarks...
[No.1 Benchmark] The name of this benchmark cannot be an empty string
[No.2 Benchmark] No name provided, cannot get the name of `testFn`, it's an anonymous function
[No.3 Benchmark] No name provided, cannot get the name of `testFn`, it's an anonymous function
[No.1 BenchmarkJob] An benchmark job can only have one global setup function
[No.1 BenchmarkJob] An benchmark job can only have one global cleanup function
 */
