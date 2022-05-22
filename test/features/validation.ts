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
[No.2 Benchmark] The name of benchmark cannot be the anonymous function name, please give a specific name
[No.3 Benchmark] The name of benchmark cannot be the anonymous function name, please give a specific name
[No.1 BenchmarkJob] An benchmark job can only have one global setup function
[No.1 BenchmarkJob] An benchmark job can only have one global cleanup function
 */
