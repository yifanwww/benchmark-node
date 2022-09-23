import crypto from 'crypto';

import { BenchmarkJob, Column } from '../../src';

let testStr: Buffer;

new BenchmarkJob({ columns: [Column.Ops] })
    .setSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'))
    .run();

/*
BenchmarkNode v0.7.2-next.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |     Error |    StdDev |    Op/s |
|---------:|----------:|----------:|----------:|--------:|
|      md5 | 13.127 us | 0.1297 us | 0.2343 us |  76,177 |
|   sha256 |  6.476 us | 0.0503 us | 0.0909 us | 154,427 |
 */
