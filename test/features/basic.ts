import { Arguments, BenchmarkJob } from '../../src';

new BenchmarkJob()
    .add('test1', () => {})
    .add(function test2() {})
    .add('test3', (_1: number | string, _2: number | string, arg: number | string) => arg, {
        args: [new Arguments(1, 2, 3), new Arguments('a', 'b', 'c')],
    })
    .run();

/*
BenchmarkNode v0.7.1, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function | arg 0 | arg 1 | arg 2 |      Mean |     Error |    StdDev |
|---------:|------:|------:|------:|----------:|----------:|----------:|
|    test1 |     ? |     ? |     ? | 0.0059 ns | 0.0048 ns | 0.0088 ns |
|    test2 |     ? |     ? |     ? | 0.0111 ns | 0.0063 ns | 0.0114 ns |
|    test3 |     1 |     2 |     3 | 0.8408 ns | 0.0237 ns | 0.0428 ns |
|    test3 |     a |     b |     c | 0.7311 ns | 0.0202 ns | 0.0366 ns |
 */
