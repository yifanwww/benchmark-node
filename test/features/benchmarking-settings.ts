import crypto from 'crypto';

import { BenchmarkJob } from '../../src';

let testStr: Buffer;

new BenchmarkJob({
    delay: 50,
    initOps: 500,
    measurementCount: 10,
    minMeasurementTime: 50,
    warmupCount: 2,
})
    .setSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'), {
        delay: 10,
        initOps: 1_000,
    })
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'), {
        measurementCount: 5,
        minMeasurementTime: 100,
        warmupCount: 3,
    })
    .run();

/*
BenchmarkNode v0.7.2, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |     Error |    StdDev |
|---------:|----------:|----------:|----------:|
|      md5 | 13.421 us | 0.7367 us | 1.0299 us |
|   sha256 |  6.673 us | 0.6278 us | 0.5056 us |
 */
