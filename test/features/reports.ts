import crypto from 'crypto';

import { BenchmarkJob, SummaryTable } from '../../src';

const summaryTable = new SummaryTable({});

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

const report = summaryTable.report!;

console.log('extra report:');
console.log('> runtime');
console.log(report.runtime);
console.log('> table');
console.log(report.table);
console.log('> description');
console.log(report.description);

/*
BenchmarkNode v0.8.0-next.1, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.17.1 (V8 9.4.146.26-node.22)

| Function |      Mean |     Error |    StdDev |
|---------:|----------:|----------:|----------:|
|      md5 | 12.709 us | 0.2010 us | 0.2810 us |
|   sha256 |  6.737 us | 0.9739 us | 0.7843 us |

Description:
- Mean  : Arithmetic mean of all measurements
- Error : Half of 95% confidence interval
- StdDev: Standard deviation of all measurements
- 1 us  : 1 Microsecond (0.000001 sec)

extra report:
> runtime
BenchmarkNode v0.8.0-next.1, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.17.1 (V8 9.4.146.26-node.22)
> table
| Function |      Mean |     Error |    StdDev |
|---------:|----------:|----------:|----------:|
|      md5 | 12.709 us | 0.2010 us | 0.2810 us |
|   sha256 |  6.737 us | 0.9739 us | 0.7843 us |
> description
Description:
- Mean  : Arithmetic mean of all measurements
- Error : Half of 95% confidence interval
- StdDev: Standard deviation of all measurements
- 1 us  : 1 Microsecond (0.000001 sec)
 */
