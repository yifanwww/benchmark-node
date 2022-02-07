# benchmark-node

A Node.js benchmarking library for accurate performance test.

## Usage

It's easy to write benchmarks.

```ts
import { Arguments, Benchmark } from 'benchmark-node';
import crypto from 'crypto';

let testStr: Buffer;

const benchmark = new Benchmark({ order: [Column.Median, Column.Min, Column.Max] });

benchmark.addSetup(() => {
    testStr = crypto.randomBytes(10_000);
});

benchmark.add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'));
benchmark.add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'));

benchmark.run();
```

`benchmark-node` will run the benchmarks, aggregates the measurements and print a summary table.

```md
| Function |       Mean |    StdErr |    StdDev |     Median |        Min |        Max |
|----------|------------|-----------|-----------|------------|------------|------------|
|   sha256 |  6.0104 us | 0.0146 us | 0.0564 us |  6.0148 us |  5.9302 us |  6.1005 us |
|      md5 | 12.5607 us | 0.0281 us | 0.1089 us | 12.6098 us | 12.3578 us | 12.7009 us |
```

## Develop this package

Execute `npm run dev` to watch the building.

Execute `npm run test` or `npm run test-full` to do unit test.

Execute `npm run build-test` or `yarn build-test` to build both source code and test code,
then can run js files in folder `dist/test` to view the output of benchmarking.

## Build this package

Execute `npm run build` or `yarn build` to build this package.
