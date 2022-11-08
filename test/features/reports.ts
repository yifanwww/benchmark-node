import crypto from 'crypto';

import { BenchmarkJob, SummaryTable } from '../../src';

const summaryTable = new SummaryTable({ description: false });

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
    .addReport(summaryTable)
    .run();

console.log();
console.log('extra report:');
console.log(summaryTable.report);

/*
BenchmarkNode v0.7.2, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.17.1 (V8 9.4.146.26-node.22)

| Function |      Mean |     Error |    StdDev |
|---------:|----------:|----------:|----------:|
|      md5 | 13.098 us | 0.8590 us | 1.2008 us |
|   sha256 |  6.313 us | 0.6304 us | 0.5077 us |

Description:
- Mean  : Arithmetic mean of all measurements
- Error : Half of 95% confidence interval
- StdDev: Standard deviation of all measurements
- 1 us  : 1 Microsecond (0.000001 sec)

extra report:
| Function |      Mean |     Error |    StdDev |
|---------:|----------:|----------:|----------:|
|      md5 | 13.098 us | 0.8590 us | 1.2008 us |
|   sha256 |  6.313 us | 0.6304 us | 0.5077 us |
 */
