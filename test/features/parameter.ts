import crypto, { BinaryToTextEncoding } from 'crypto';

import { Arguments, BenchmarkJob, Params } from '../../src';

let testStr: Buffer;

new BenchmarkJob()
    .setSetup(
        (size: number) => {
            testStr = crypto.randomBytes(size);
        },
        [new Params(1000, 10_000)],
    )
    .add('md5', (encoding: BinaryToTextEncoding) => crypto.createHash('md5').update(testStr).digest(encoding), {
        args: [new Arguments<[BinaryToTextEncoding]>('hex'), new Arguments<[BinaryToTextEncoding]>('base64')],
        measurementCount: 5,
    })
    .add('sha256', (encoding: BinaryToTextEncoding) => crypto.createHash('sha256').update(testStr).digest(encoding), {
        args: [new Arguments<[BinaryToTextEncoding]>('hex'), new Arguments<[BinaryToTextEncoding]>('base64')],
        measurementCount: 5,
    })
    .run();

/*
BenchmarkNode v0.7.2-next.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |  size |  arg 0 |      Mean |     Error |    StdDev |
|---------:|------:|-------:|----------:|----------:|----------:|
|      md5 |  1000 |    hex |  2.672 us | 0.0891 us | 0.0717 us |
|      md5 |  1000 | base64 |  2.659 us | 0.0310 us | 0.0250 us |
|   sha256 |  1000 |    hex |  1.919 us | 0.0465 us | 0.0374 us |
|   sha256 |  1000 | base64 |  1.919 us | 0.0507 us | 0.0408 us |
|      md5 | 10000 |    hex | 13.056 us | 0.2621 us | 0.2111 us |
|      md5 | 10000 | base64 | 13.214 us | 0.2194 us | 0.1767 us |
|   sha256 | 10000 |    hex |  6.433 us | 0.2580 us | 0.2078 us |
|   sha256 | 10000 | base64 |  6.444 us | 0.1125 us | 0.0906 us |
*/
