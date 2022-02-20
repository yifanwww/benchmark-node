import crypto from 'crypto';

import { BenchmarkJob, Column, ConfidenceLevel } from '../../src';

let testStr: Buffer;

new BenchmarkJob({
    columns: [
        Column.CIError(ConfidenceLevel.L50),
        Column.CIError(ConfidenceLevel.L70),
        Column.CIError(ConfidenceLevel.L75),
        Column.CIError(ConfidenceLevel.L80),
        Column.CIError(ConfidenceLevel.L85),
        Column.CIError(ConfidenceLevel.L90),
        Column.CIError(ConfidenceLevel.L92),
        Column.CIError(ConfidenceLevel.L95),
        Column.CIError(ConfidenceLevel.L96),
        Column.CIError(ConfidenceLevel.L97),
        Column.CIError(ConfidenceLevel.L98),
        Column.CIError(ConfidenceLevel.L99),
        Column.CIError(ConfidenceLevel.L999),
        Column.CIError(ConfidenceLevel.L9999),
    ],
})
    .addSetup(() => {
        testStr = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'))
    .run();

/* eslint-disable max-len */

/*
BenchmarkNode v0.6.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |     Error |    StdDev | CI50% Margin | CI70% Margin | CI75% Margin | CI80% Margin | CI85% Margin | CI90% Margin | CI92% Margin | CI95% Margin | CI96% Margin | CI97% Margin | CI98% Margin | CI99% Margin | CI99.9% Margin | CI99.99% Margin |
|----------|-----------|-----------|-----------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|--------------|----------------|-----------------|
|      md5 | 12.537 us | 0.0639 us | 0.1154 us |    0.0206 us |    0.0321 us |    0.0358 us |    0.0401 us |    0.0454 us |    0.0525 us |    0.0563 us |    0.0639 us |    0.0675 us |    0.0720 us |    0.0782 us |    0.0887 us |      0.1234 us |       0.1599 us |
|   sha256 |  6.039 us | 0.0311 us | 0.0561 us |    0.0100 us |    0.0156 us |    0.0174 us |    0.0195 us |    0.0221 us |    0.0255 us |    0.0274 us |    0.0311 us |    0.0328 us |    0.0350 us |    0.0380 us |    0.0431 us |      0.0600 us |       0.0777 us |
 */
