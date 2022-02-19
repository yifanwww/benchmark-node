# benchmark-node

A Node.js benchmarking library for accurate performance test.

## Usage

It's easy to write benchmarks.

```ts
import { Benchmark, Column } from 'benchmark-node';
import crypto from 'crypto';

let testStr: Buffer;

const benchmark = new Benchmark({ columns: [Column.Median, Column.Min, Column.Max, Column.Ops] });

benchmark.addSetup(() => {
    testStr = crypto.randomBytes(10_000);
});

benchmark.add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'));
benchmark.add('sha1', () => crypto.createHash('sha1').update(testStr).digest('hex'));
benchmark.add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'));
benchmark.add('sha384', () => crypto.createHash('sha384').update(testStr).digest('hex'));
benchmark.add('sha512', () => crypto.createHash('sha512').update(testStr).digest('hex'));

benchmark.run();
```

`benchmark-node` will run the benchmarks, aggregates the measurements and print a summary table.

```md
| Function |      Mean |    Error |    StdDev |    Median |       Min |       Max |    Op/s |
|----------|-----------|----------|-----------|-----------|-----------|-----------|---------|
|      md5 | 12,401 ns | 58.84 ns | 106.25 ns | 12,405 ns | 12,182 ns | 12,632 ns |  80,641 |
|     sha1 |  5,656 ns | 31.44 ns |  56.77 ns |  5,639 ns |  5,609 ns |  5,828 ns | 176,799 |
|   sha256 |  5,916 ns | 25.85 ns |  46.68 ns |  5,922 ns |  5,845 ns |  5,997 ns | 169,028 |
|   sha384 | 11,529 ns | 82.97 ns | 149.82 ns | 11,545 ns | 11,307 ns | 11,815 ns |  86,740 |
|   sha512 | 11,475 ns | 72.68 ns | 131.25 ns | 11,472 ns | 11,296 ns | 11,841 ns |  87,146 |
```

## Develop this package

Execute `npm run dev` to watch the building.

Execute `npm run test` or `npm run test-full` to do unit test.

Execute `npm run build-test` or `yarn build-test` to build both source code and test code,
then can run js files in folder `dist/test` to view the output of benchmarking.

## Build this package

Execute `npm run build` or `yarn build` to build this package.
