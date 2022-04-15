/* eslint-disable max-classes-per-file */

import { BenchmarkJob } from '../src';

class A {
    private declare a: number;

    constructor(a: number) {
        this.a = a;
    }
}

class B {
    private declare a: number;
    private declare b: number;

    constructor(a: number, b: number) {
        this.a = a;
        this.b = b;
    }
}

class C {
    private declare a: number;
    private declare b: number;
    private declare c: number;

    constructor(a: number, b: number, c: number) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
}

class D {
    private declare a: number;
    private declare b: number;
    private declare c: number;
    private declare d: number;

    constructor(a: number, b: number, c: number, d: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
}

class E {
    private declare a: number;
    private declare b: number;
    private declare c: number;
    private declare d: number;
    private declare e: number;

    constructor(a: number, b: number, c: number, d: number, e: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
    }
}

class F {
    private declare a: number;
    private declare b: number;
    private declare c: number;
    private declare d: number;
    private declare e: number;
    private declare f: number;

    constructor(a: number, b: number, c: number, d: number, e: number, f: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }
}

class G {
    private declare a: number;
    private declare b: number;
    private declare c: number;
    private declare d: number;
    private declare e: number;
    private declare f: number;
    private declare g: number;

    constructor(a: number, b: number, c: number, d: number, e: number, f: number, g: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.g = g;
    }
}

let a: number;
let b: number;
let c: number;
let d: number;
let e: number;
let f: number;
let g: number;

const job = new BenchmarkJob();

job.addSetup(() => {
    a = 1;
    b = 2;
    c = 3;
    d = 4;
    e = 5;
    f = 6;
    g = 7;
});

job.add('class -1', () => new A(a));
job.add('object-1', () => ({ a }));

job.add('class -2', () => new B(a, b));
job.add('object-2', () => ({ a, b }));

job.add('class -3', () => new C(a, b, c));
job.add('object-3', () => ({ a, b, c }));

job.add('class -4', () => new D(a, b, c, d));
job.add('object-4', () => ({ a, b, c, d }));

job.add('class -5', () => new E(a, b, c, d, e));
job.add('object-5', () => ({ a, b, c, d, e }));

job.add('class -6', () => new F(a, b, c, d, e, f));
job.add('object-6', () => ({ a, b, c, d, e, f }));

job.add('class -7', () => new G(a, b, c, d, e, f, g));
job.add('object-7', () => ({ a, b, c, d, e, f, g }));

job.run();

/*

BenchmarkNode v0.6.0, Windows 10.0.22000
AMD Ryzen 7 5800H with Radeon Graphics, 1 CPU, 16 logical and 8 plysical cores
Node.JS 16.13.0 (V8 9.4.146.19-node.13)

| Function |     Mean |     Error |    StdDev |
|----------|----------|-----------|-----------|
| class -1 | 2.242 ns | 0.0208 ns | 0.0375 ns |
| object-1 | 2.113 ns | 0.0077 ns | 0.0139 ns |
| class -2 | 2.781 ns | 0.0154 ns | 0.0278 ns |
| object-2 | 2.746 ns | 0.0150 ns | 0.0271 ns |
| class -3 | 3.419 ns | 0.0287 ns | 0.0518 ns |
| object-3 | 2.964 ns | 0.0218 ns | 0.0394 ns |
| class -4 | 4.199 ns | 0.0260 ns | 0.0470 ns |
| object-4 | 3.644 ns | 0.0118 ns | 0.0213 ns |
| class -5 | 4.967 ns | 0.0139 ns | 0.0252 ns |
| object-5 | 3.948 ns | 0.0198 ns | 0.0358 ns |
| class -6 | 5.891 ns | 0.0359 ns | 0.0649 ns |
| object-6 | 5.127 ns | 0.1484 ns | 0.2680 ns |
| class -7 | 6.909 ns | 0.0816 ns | 0.1474 ns |
| object-7 | 5.646 ns | 0.1375 ns | 0.2484 ns |

*/
