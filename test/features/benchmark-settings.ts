import crypto from 'crypto';

import { BenchmarkJob } from '../../src';

let testStr: Buffer;

new BenchmarkJob()
    .addSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'), {
        delay: 10,
        initOps: 1_000,
        measurementCount: 5,
        minMeasurementTime: 100,
        warmupCount: 3,
    })
    .run();

/*
BenchmarkNode v0.5.2, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |     Error |   StdDev |
|----------|-----------|-----------|----------|
|      md5 | 12,802 ns |  78.97 ns | 142.6 ns |
|   sha256 |  6,371 ns | 230.94 ns | 186.0 ns |
 */
