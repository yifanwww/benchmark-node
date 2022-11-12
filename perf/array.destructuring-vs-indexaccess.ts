import { Arguments, BenchmarkJob } from '../src';

type Arr = [number, number, number];

function arrayDestructuring(a: Arr, b: Arr) {
    const [a1, a2, a3] = a;
    const [b1, b2, b3] = b;
    return ((a1 + a2 + a3) << 1) + (b1 << 1) + (b2 << 1) + (b3 << 1);
}

function arrayIndexAccess(a: Arr, b: Arr) {
    return ((a[0] + a[1] + a[2]) << 1) + (b[0] << 1) + (b[1] << 1) + (b[2] << 1);
}

const job = new BenchmarkJob();

job.add('array-destructuring', arrayDestructuring, {
    args: [
        new Arguments<[Arr, Arr]>([1, 2, 3], [4, 5, 6]),
        new Arguments<[Arr, Arr]>([100, 200, 300], [400, 500, 600]),
        new Arguments<[Arr, Arr]>([1000, 2000, 3000], [4000, 5000, 6000]),
    ],
});
job.add('array-index-access', arrayIndexAccess, {
    args: [
        new Arguments<[Arr, Arr]>([1, 2, 3], [4, 5, 6]),
        new Arguments<[Arr, Arr]>([100, 200, 300], [400, 500, 600]),
        new Arguments<[Arr, Arr]>([1000, 2000, 3000], [4000, 5000, 6000]),
    ],
});

job.run();

/*

BenchmarkNode v0.8.0-next.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.17.1 (V8 9.4.146.26-node.22)

|            Function |         arg 0 |         arg 1 |     Mean |     Error |    StdDev |
|--------------------:|--------------:|--------------:|---------:|----------:|----------:|
| array-destructuring |         1,2,3 |         4,5,6 | 5.999 ns | 0.0443 ns | 0.0801 ns |
| array-destructuring | 100,200,30... | 400,500,60... | 6.244 ns | 0.0304 ns | 0.0548 ns |
| array-destructuring | 1000,2000,... | 4000,5000,... | 6.008 ns | 0.0339 ns | 0.0613 ns |
|  array-index-access |         1,2,3 |         4,5,6 | 1.674 ns | 0.0130 ns | 0.0236 ns |
|  array-index-access | 100,200,30... | 400,500,60... | 1.674 ns | 0.0096 ns | 0.0174 ns |
|  array-index-access | 1000,2000,... | 4000,5000,... | 1.448 ns | 0.0090 ns | 0.0162 ns |

*/
