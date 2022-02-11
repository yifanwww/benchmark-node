# CHANGELOG
## benchmark-node v0.5.2 (Unreleased)
### Bug Fixes

- Fix iteration setup and iteration cleanup not executing

## benchmark-node v0.5.1 (2022-02-07)
### Bug Fixes

- Fix the return type of `TestFn` to `unknown` for Typescript to infer the type of test function
- No global.d.ts anymore, for Typescript to load package types successfully

## benchmark-node v0.5.0 (2022-02-06)
### Features

- Add `BenchmarkJob` constructor overloading `BenchmarkJob(testFn, options)`
- Add support to benchmark overhead performance and workload performance to get the real performance of test function
- Add support to display arguments in Summary Table
- Add support to automatically change time units to improve readability
- Add callbacks `setup` and `cleanup` in Benchmark and BenchmarkJob
- Use generic types to check testFn's arguments and Arguments array

### Changes

- Changes stages
  1. `OverheadJitting`
  2. `WorkloadJitting`
  3. `WorkloadPilot`
  4. `OverheadWarmup`
  5. `OverheadActual`
  6. `WorkloadWarmup`
  7. `WorkloadActual`
  8. `WorkloadResult`

### Breaking Changes

- Rename `Benchmark`'s method `setEmptyTest` to `SetNoopTest`
- Change default value of `minMeasurementTime` to 250
- Delete callbacks `onStart` and `onComplete`

## benchmark-node v0.4.4 (2022-02-06)
### Bug Fixes

- Move `chalk` into dependencies

## benchmark-node v0.4.3 (2022-02-05)
### Bug Fixes

- Correct the lowest Node.js version support to 9

## benchmark-node v0.4.2 (2022-02-05)
### Bug Fixes

- Use npm script `prepare` to install husky

## benchmark-node v0.4.1 (2022-02-05)
### Changes

- Add npm.js keywords

## benchmark-node v0.4.0 (2022-02-05)

Ref to [CHANGELOG:@easy/benchmark-js] to see previous changelogs.

Check [@easy/benchmark-js in easy-projs] for previous Git commit history.

[changelog:@easy/benchmark-js]: https://github.com/yifanwww/benchmark-node/blob/main/CHANGELOG.md#easybenchmark-js-v040-2022-02-03
[@easy/benchmark-js in easy-projs]: https://github.com/yifanwww/easy-projs/tree/%40easy/benchmark-js_v0.4.0/packages/benchmark-js

-----

## Appended Changelogs from @easy/benchmark-js

### @easy/benchmark-js v0.4.0 (2022-02-03)
#### Features

- Add class `Arguments` to specify the arguments passed to test fn
- Print Node.js version
- Add more statistic data
  - ConfidenceInterval
  - Q0
  - Q1
  - Q2
  - Q3
  - Q4
- Add markdown table for printing benchmark results

#### Breaking Changes

- Remove `Benchmark.loggerLevel`
- Rename classes and interfaces
  - `BenchmarkGroup`            -> `Benchmark`
  - `Benchmark`                 -> `BenchmarkJob`
  - `BenchmarkOptions`          -> `BenchmarkJobOptions`
  - `BenchmarkSettings`         -> `BenchmarkJobSettings`
  - `BenchmarkTestFnOptions`    -> `BenchmarkJobTestFnOptions`
- Delete methods `Benchmark.writeTestersCode` and `BenchmarkJob.writeTesterCode`
- Change stages to Jitting, Pilot and Formal
- Change `BenchmarkJobOptions`

### @easy/benchmark-js v0.3.0 (2022-02-01)
#### Features

- Improve the accuracy of the minimum duration time.
- Add method `BenchmarkGroup.setEmptyTest` to get the maximum ops as a base line.
- Add methods `Benchmark.writeTesterCode` and `BenchmarkGroup.writeTestersCode` to print the tester source code.
- Add support to pass arguments to `testFn`.
- Add adjust-benchmarking stage after pre-benchmarking stage but before formal-benchmarking stage.
- Add support to set selections for each `testFn`'s argument.

#### Bug Fixes

- Fix a optimization problem that cause wrong performance test results.

#### Breaking Changes

- Rename option `maxPrepareTime` to `maxPreparingTime`, and change the default value to `50`.

### @easy/benchmark-js v0.2.0 (2022-01-15)
#### Features

- Add `BenchmarkGroup` to do group testing.
- Add method `writeResult` to `Benchmark`.
- Add logs, can change logger level by setting `Benchmark.loggerLevel`.

#### Breaking Changes

- Renamed to `@easy/benchmark-js`

### @easy/benchmark-javascript v0.1.0 (2021-11-16)
#### Features

- Add support to test javascript performance by using class `Benchmark`
