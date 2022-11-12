import { BenchmarkJob } from '../src';

let a: number;
let b: number;
let c: number;
let d: number;
let e: number;
let f: number;
let g: number;

const job = new BenchmarkJob();

job.setSetup(() => {
    a = 1;
    b = 2;
    c = 3;
    d = 4;
    e = 5;
    f = 6;
    g = 7;
});

job.add('arr-1', () => [a]);
job.add('obj-1-1', () => ({ a }));
job.add('obj-1-2', () => ({ 0: a }));

job.add('arr-2', () => [a, b]);
job.add('obj-2-1', () => ({ a, b }));
job.add('obj-2-2', () => ({ 0: a, 1: b }));

job.add('arr-3', () => [a, b, c]);
job.add('obj-3-1', () => ({ a, b, c }));
job.add('obj-3-2', () => ({ 0: a, 1: b, 2: c }));

job.add('arr-4', () => [a, b, c, d]);
job.add('obj-4-1', () => ({ a, b, c, d }));
job.add('obj-4-2', () => ({ 0: a, 1: b, 2: c, 3: d }));

job.add('arr-5', () => [a, b, c, d, e]);
job.add('obj-5-1', () => ({ a, b, c, d, e }));
job.add('obj-5-2', () => ({ 0: a, 1: b, 2: c, 3: d, 4: e }));

job.add('arr-6', () => [a, b, c, d, e, f]);
job.add('obj-6-1', () => ({ a, b, c, d, e, f }));
job.add('obj-6-2', () => ({ 0: a, 1: b, 2: c, 3: d, 4: e, 5: f }));

job.add('arr-7', () => [a, b, c, d, e, f, g]);
job.add('obj-7-1', () => ({ a, b, c, d, e, f, g }));
job.add('obj-7-2', () => ({ 0: a, 1: b, 2: c, 3: d, 4: e, 5: f, 6: g }));

job.run();

/*

BenchmarkNode v0.6.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |       Mean |     Error |    StdDev |
|----------|------------|-----------|-----------|
|    arr-1 |   2.925 ns | 0.0217 ns | 0.0391 ns |
|  obj-1-1 |   1.897 ns | 0.0059 ns | 0.0106 ns |
|  obj-1-2 |  44.988 ns | 0.1274 ns | 0.2300 ns |
|    arr-2 |   3.778 ns | 0.0163 ns | 0.0294 ns |
|  obj-2-1 |   2.766 ns | 0.0149 ns | 0.0269 ns |
|  obj-2-2 |  81.019 ns | 0.2431 ns | 0.4389 ns |
|    arr-3 |   4.063 ns | 0.0170 ns | 0.0307 ns |
|  obj-3-1 |   3.180 ns | 0.0100 ns | 0.0180 ns |
|  obj-3-2 | 117.813 ns | 0.4636 ns | 0.8372 ns |
|    arr-4 |   4.643 ns | 0.0327 ns | 0.0590 ns |
|  obj-4-1 |   3.652 ns | 0.0127 ns | 0.0230 ns |
|  obj-4-2 | 152.717 ns | 0.3836 ns | 0.6927 ns |
|    arr-5 |   5.149 ns | 0.0189 ns | 0.0342 ns |
|  obj-5-1 |   4.000 ns | 0.0139 ns | 0.0251 ns |
|  obj-5-2 | 189.763 ns | 0.5509 ns | 0.9947 ns |
|    arr-6 |   5.646 ns | 0.0206 ns | 0.0372 ns |
|  obj-6-1 |   4.930 ns | 0.0314 ns | 0.0567 ns |
|  obj-6-2 | 227.171 ns | 4.1496 ns | 7.4932 ns |
|    arr-7 |   6.178 ns | 0.0244 ns | 0.0440 ns |
|  obj-7-1 |   5.352 ns | 0.0148 ns | 0.0267 ns |
|  obj-7-2 | 261.651 ns | 0.6278 ns | 1.1337 ns |

*/
