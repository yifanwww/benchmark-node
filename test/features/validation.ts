/* eslint-disable func-names */

import { BenchmarkJob } from '../../src';

new BenchmarkJob()
    .setSetup(() => {})
    .setSetup(() => {})
    .setCleanup(() => {})
    .setCleanup(() => {})
    .add('', () => {})
    .add(function () {})
    .add(() => {})
    .validate();

/*
Validating benchmarks...
[No.1 Benchmark] The name of this benchmark cannot be an empty string
[No.2 Benchmark] No name provided, cannot get the name of `testFn`, it's an anonymous function
[No.3 Benchmark] No name provided, cannot get the name of `testFn`, it's an anonymous function
[No.1 BenchmarkJob] An benchmark job can only have one global setup function
[No.1 BenchmarkJob] An benchmark job can only have one global cleanup function
 */
