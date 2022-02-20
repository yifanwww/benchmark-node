# benchmark-node

Node.js benchmarking library for accurate performance testing.

Up to now, this project mainly refers to [BenchmarkDotNet] for development.

[benchmarkdotnet]: https://github.com/dotnet/BenchmarkDotNet

## Usage

It's easy to write benchmarks.

```ts
import { BenchmarkJob, Column } from 'benchmark-node';
import crypto from 'crypto';

let buffer: Buffer;

new BenchmarkJob({ columns: [Column.Median, Column.Min, Column.Max, Column.Ops] })
    .addSetup(() => {
        buffer = crypto.randomBytes(10_000);
    })
    .add('md5', () => crypto.createHash('md5').update(buffer).digest('hex'))
    .add('sha1', () => crypto.createHash('sha1').update(buffer).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(buffer).digest('hex'))
    .add('sha384', () => crypto.createHash('sha384').update(buffer).digest('hex'))
    .add('sha512', () => crypto.createHash('sha512').update(buffer).digest('hex'))
    .run();
```

`benchmark-node` will run the benchmarks, aggregates the measurements and print a summary table.

```md
BenchmarkNode v0.5.2, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |    Error |    StdDev |    Median |       Min |       Max |    Op/s |
|----------|-----------|----------|-----------|-----------|-----------|-----------|---------|
|      md5 | 12,401 ns | 58.84 ns | 106.25 ns | 12,405 ns | 12,182 ns | 12,632 ns |  80,641 |
|     sha1 |  5,656 ns | 31.44 ns |  56.77 ns |  5,639 ns |  5,609 ns |  5,828 ns | 176,799 |
|   sha256 |  5,916 ns | 25.85 ns |  46.68 ns |  5,922 ns |  5,845 ns |  5,997 ns | 169,028 |
|   sha384 | 11,529 ns | 82.97 ns | 149.82 ns | 11,545 ns | 11,307 ns | 11,815 ns |  86,740 |
|   sha512 | 11,475 ns | 72.68 ns | 131.25 ns | 11,472 ns | 11,296 ns | 11,841 ns |  87,146 |
```

For more usages, check:
- [basic]
- [benchmark-settings]
- [columns.arithmetic]
- [columns.ci]
- [columns.iterations]
- [columns.ops]
- [setup-cleanup.global]
- [validation]

[basic]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/basic.ts
[benchmark-settings]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/benchmark-settings.ts
[columns.arithmetic]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/columns.arithmetic.ts
[columns.ci]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/columns.ci.ts
[columns.iterations]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/columns.iterations.ts
[columns.ops]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/columns.ops.ts
[setup-cleanup.global]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/setup-cleanup.global.ts
[validation]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/validation.ts

## Development

Execute `npm run build` or `yarn build` to build this project.

Execute `npm run dev` to watch the building.

Execute `npm run test` or `npm run test-full` to do unit test.

Execute `npm run build-test` or `yarn build-test` to build both source code and test code,
then can run js files in folder `dist/test` to view the output of benchmarking.
