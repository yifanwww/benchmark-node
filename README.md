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

benchmark.add('md5', () => crypto.createHash('md5').update(testStr).digest('hex'));
benchmark.add('sha1', () => crypto.createHash('sha1').update(testStr).digest('hex'));
benchmark.add('sha256', () => crypto.createHash('sha256').update(testStr).digest('hex'));
benchmark.add('sha384', () => crypto.createHash('sha384').update(testStr).digest('hex'));
benchmark.add('sha512', () => crypto.createHash('sha512').update(testStr).digest('hex'));

benchmark.run();
```

`benchmark-node` will run the benchmarks, aggregates the measurements and print a summary table.

```md
| Function |      Mean |    StdErr |    StdDev |    Median |       Min |       Max |
|----------|-----------|-----------|-----------|-----------|-----------|-----------|
|      md5 | 12.647 us | 0.0230 us | 0.0892 us | 12.663 us | 12.491 us | 12.792 us |
|     sha1 |  5.763 us | 0.0113 us | 0.0440 us |  5.757 us |  5.691 us |  5.852 us |
|   sha256 |  6.062 us | 0.0160 us | 0.0620 us |  6.069 us |  5.965 us |  6.193 us |
|   sha384 | 11.698 us | 0.0248 us | 0.0959 us | 11.718 us | 11.522 us | 11.865 us |
|   sha512 | 11.694 us | 0.0308 us | 0.1195 us | 11.694 us | 11.470 us | 11.928 us |
```

## Develop this package

Execute `npm run dev` to watch the building.

Execute `npm run test` or `npm run test-full` to do unit test.

Execute `npm run build-test` or `yarn build-test` to build both source code and test code,
then can run js files in folder `dist/test` to view the output of benchmarking.

## Build this package

Execute `npm run build` or `yarn build` to build this package.
