import crypto from 'crypto';

import { BenchmarkJob, Column } from '../../src';

let testStr: Buffer;

new BenchmarkJob({ columns: [Column.Iterations] })
    .setSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'), {
        measurementCount: 5,
        minMeasurementTime: 100,
        warmupCount: 3,
    })
    .run();

/*
BenchmarkNode v0.7.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |     Error |    StdDev | Iterations |
|---------:|----------:|----------:|----------:|-----------:|
|      md5 | 13.246 us | 0.1042 us | 0.1882 us |         15 |
|   sha256 |  6.534 us | 0.2726 us | 0.2195 us |          5 |
 */
