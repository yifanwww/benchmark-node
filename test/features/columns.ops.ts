import crypto from 'crypto';

import { BenchmarkJob, Column } from '../../src';

let testStr: Buffer;

new BenchmarkJob({ columns: [Column.Ops] })
    .addSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'))
    .run();

/*
BenchmarkNode v0.5.2, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |    Error |   StdDev |    Op/s |
|----------|-----------|----------|----------|---------|
|      md5 | 12,565 ns | 53.31 ns | 96.26 ns |  79,589 |
|   sha256 |  6,027 ns | 31.27 ns | 56.46 ns | 165,932 |
 */
