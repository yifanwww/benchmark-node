import { Arguments, BenchmarkJob } from '../../src';

new BenchmarkJob()
    .add('test1', () => {})
    .add(function test2() {})
    .add('test3', (_1: number | string, _2: number | string, arg: number | string) => arg, {
        args: [new Arguments(1, 2, 3), new Arguments('a', 'b', 'c')],
    })
    .run();

/*
BenchmarkNode v0.5.2, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function | arg 0 | arg 1 | arg 2 |      Mean |     Error |    StdDev |
|----------|-------|-------|-------|-----------|-----------|-----------|
|    test1 |     ? |     ? |     ? | 0.0043 ns | 0.0011 ns | 0.0019 ns |
|    test2 |     ? |     ? |     ? | 0.0090 ns | 0.0039 ns | 0.0070 ns |
|    test3 |     1 |     2 |     3 | 0.8082 ns | 0.0040 ns | 0.0073 ns |
|    test3 |     a |     b |     c | 0.8495 ns | 0.0251 ns | 0.0454 ns |
 */
