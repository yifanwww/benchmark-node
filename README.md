# benchmark-node

Node.js benchmarking library for accurate performance testing.

Part of the design reference [BenchmarkDotNet].

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
BenchmarkNode v0.6.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |      Mean |     Error |    StdDev |    Median |       Min |       Max |    Op/s |
|----------|-----------|-----------|-----------|-----------|-----------|-----------|---------|
|      md5 | 12.624 us | 0.0537 us | 0.0970 us | 12.624 us | 12.433 us | 12.766 us |  79,216 |
|     sha1 |  5.727 us | 0.0183 us | 0.0330 us |  5.719 us |  5.695 us |  5.815 us | 174,610 |
|   sha256 |  5.998 us | 0.0273 us | 0.0493 us |  5.990 us |  5.922 us |  6.065 us | 166,729 |
|   sha384 | 11.586 us | 0.0671 us | 0.1211 us | 11.579 us | 11.391 us | 11.809 us |  86,310 |
|   sha512 | 11.639 us | 0.0538 us | 0.0971 us | 11.652 us | 11.488 us | 11.826 us |  85,919 |
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

Execute `npm run build` or `yarn build` to build this project.

Execute `npm run dev` to watch the building.

Execute `npm run test` or `npm run test-full` to do unit test.

Execute `npm run build-test` or `yarn build-test` to build both source code and test code,
then can run js files in folder `dist/test` to view the output of benchmarking.
