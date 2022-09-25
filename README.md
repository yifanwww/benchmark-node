# benchmark-node

Node.js benchmarking library for accurate performance testing.

Part of the design reference [BenchmarkDotNet].

[benchmarkdotnet]: https://github.com/dotnet/BenchmarkDotNet

## Usage

It's easy to write benchmarks.

```ts
import { BenchmarkJob, Column, Params } from 'benchmark-node';
import crypto from 'crypto';

let buffer: Buffer;

new BenchmarkJob({ columns: [Column.Median, Column.Min, Column.Max, Column.Ops] })
    .setSetup(
        (size: number) => {
            buffer = crypto.randomBytes(size);
        },
        [new Params(1000, 10_000)],
    )
    .add('md5', () => crypto.createHash('md5').update(buffer).digest('hex'))
    .add('sha1', () => crypto.createHash('sha1').update(buffer).digest('hex'))
    .add('sha256', () => crypto.createHash('sha256').update(buffer).digest('hex'))
    .add('sha384', () => crypto.createHash('sha384').update(buffer).digest('hex'))
    .add('sha512', () => crypto.createHash('sha512').update(buffer).digest('hex'))
    .run();
```

`benchmark-node` will run the benchmarks, aggregates the measurements and print a summary table.

```md
BenchmarkNode v0.7.2, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |  size |      Mean |     Error |    StdDev |    Median |       Min |       Max |    Op/s |
|---------:|------:|----------:|----------:|----------:|----------:|----------:|----------:|--------:|
|      md5 |  1000 |  2.637 us | 0.0277 us | 0.0499 us |  2.648 us |  2.564 us |  2.727 us | 379,279 |
|     sha1 |  1000 |  1.796 us | 0.0163 us | 0.0295 us |  1.799 us |  1.729 us |  1.848 us | 556,839 |
|   sha256 |  1000 |  1.874 us | 0.0363 us | 0.0655 us |  1.892 us |  1.786 us |  2.033 us | 533,478 |
|   sha384 |  1000 |  2.553 us | 0.0256 us | 0.0462 us |  2.564 us |  2.475 us |  2.635 us | 391,714 |
|   sha512 |  1000 |  2.570 us | 0.0395 us | 0.0714 us |  2.578 us |  2.472 us |  2.714 us | 389,091 |
|      md5 | 10000 | 12.984 us | 0.1017 us | 0.1836 us | 13.005 us | 12.556 us | 13.302 us |  77,019 |
|     sha1 | 10000 |  5.952 us | 0.0375 us | 0.0678 us |  5.963 us |  5.775 us |  6.084 us | 168,015 |
|   sha256 | 10000 |  6.307 us | 0.0344 us | 0.0621 us |  6.285 us |  6.235 us |  6.477 us | 158,564 |
|   sha384 | 10000 | 12.109 us | 0.1626 us | 0.2937 us | 12.092 us | 11.764 us | 12.978 us |  82,584 |
|   sha512 | 10000 | 12.126 us | 0.1664 us | 0.3005 us | 12.102 us | 11.798 us | 12.790 us |  82,468 |
```

For more usages, check:
- [basic]
- [benchmark-settings]
- [columns.arithmetic]
- [columns.ci]
- [columns.iterations]
- [columns.ops]
- [parameter]
- [setup-cleanup.global]
- [validation]

[basic]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/basic.ts
[benchmark-settings]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/benchmark-settings.ts
[columns.arithmetic]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/columns.arithmetic.ts
[columns.ci]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/columns.ci.ts
[columns.iterations]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/columns.iterations.ts
[columns.ops]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/columns.ops.ts
[parameter]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/parameter.ts
[setup-cleanup.global]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/setup-cleanup.global.ts
[validation]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/validation.ts

## Development

Execute `pnpm run build` to build this project.

Execute `pnpm run dev` to watch the building.

Execute `pnpm run test` or `pnpm run test-full` to do unit test.

Execute `pnpm run build-test` or to build both source code and test code,
then can run js files in folder `dist/test` to view the output of benchmarking.
