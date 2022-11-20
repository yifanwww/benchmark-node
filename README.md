# benchmark-node

Node.js benchmarking library for accurate performance testing.

Part of the design reference [BenchmarkDotNet].

[benchmarkdotnet]: https://github.com/dotnet/BenchmarkDotNet

## Usage

It's easy to write benchmarks.

```ts
import { BenchmarkJob, Params, StatisticIndicator } from 'benchmark-node';
import crypto from 'crypto';

let buffer: Buffer;

new BenchmarkJob({
    indicators: [StatisticIndicator.Median, StatisticIndicator.Min, StatisticIndicator.Max, StatisticIndicator.Ops],
})
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
BenchmarkNode v0.8.0-next.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.17.1 (V8 9.4.146.26-node.22)

| Function |  size |      Mean |     Error |    StdDev |    Median |       Min |       Max |    Op/s |
|---------:|------:|----------:|----------:|----------:|----------:|----------:|----------:|--------:|
|      md5 |  1000 |  2.575 us | 0.0427 us | 0.0770 us |  2.562 us |  2.520 us |  2.781 us | 388,337 |
|     sha1 |  1000 |  1.873 us | 0.0276 us | 0.0499 us |  1.860 us |  1.827 us |  1.998 us | 533,997 |
|   sha256 |  1000 |  1.827 us | 0.0282 us | 0.0509 us |  1.839 us |  1.735 us |  1.903 us | 547,457 |
|   sha384 |  1000 |  2.573 us | 0.0121 us | 0.0218 us |  2.576 us |  2.538 us |  2.622 us | 388,592 |
|   sha512 |  1000 |  2.606 us | 0.0277 us | 0.0500 us |  2.596 us |  2.544 us |  2.702 us | 383,747 |
|      md5 | 10000 | 12.716 us | 0.2431 us | 0.4390 us | 12.523 us | 12.250 us | 13.358 us |  78,644 |
|     sha1 | 10000 |  5.847 us | 0.0308 us | 0.0557 us |  5.850 us |  5.765 us |  5.966 us | 171,036 |
|   sha256 | 10000 |  6.185 us | 0.0625 us | 0.1129 us |  6.143 us |  6.102 us |  6.451 us | 161,673 |
|   sha384 | 10000 | 11.909 us | 0.1568 us | 0.2831 us | 12.078 us | 11.392 us | 12.210 us |  83,972 |
|   sha512 | 10000 | 11.851 us | 0.1387 us | 0.2504 us | 11.963 us | 11.418 us | 12.220 us |  84,383 |
```

For more usages, check:
- [basic]
- [benchmark-settings]
- [indicators.arithmetic]
- [indicators.ci]
- [indicators.iterations]
- [indicators.ops]
- [parameter]
- [setup-cleanup.global]
- [validation]

[basic]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/basic.ts
[benchmark-settings]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/benchmark-settings.ts
[indicators.arithmetic]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/indicators.arithmetic.ts
[indicators.ci]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/indicators.ci.ts
[indicators.iterations]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/indicators.iterations.ts
[indicators.ops]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/indicators.ops.ts
[parameter]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/parameter.ts
[setup-cleanup.global]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/setup-cleanup.global.ts
[validation]: https://github.com/yifanwww/benchmark-node/blob/main/test/features/validation.ts

## Development

Execute `pnpm run build` to build this project.

Execute `pnpm run dev` to watch the building.

Execute `pnpm run test` or `pnpm run test-full` to do unit test.

Execute `pnpm run build-test` or to build both source code and test code,
then can run js files in folder `dist/test` to view the output of benchmarking.
