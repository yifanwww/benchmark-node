import crypto from 'crypto';

import { BenchmarkJob, StatisticIndicator } from '../../src';

let testStr: Buffer;

new BenchmarkJob({ indicators: [StatisticIndicator.Iterations] })
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
BenchmarkNode v0.8.0-next.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.17.1 (V8 9.4.146.26-node.22)

| Function |      Mean |     Error |    StdDev | Iterations |
|---------:|----------:|----------:|----------:|-----------:|
|      md5 | 12.757 us | 0.2592 us | 0.4681 us |         15 |
|   sha256 |  6.314 us | 0.7559 us | 0.6088 us |          5 |
 */
