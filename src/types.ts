import { Arguments } from './ConfigOptions/Arguments';

/**
 * The type representing millisecond.
 */
export type Millisecond = number & {};

/**
 * The type representing nanosecond.
 *
 * The maximum safe integer in Javascript is `2^53 - 1` (`Number.MAX_SAFE_INTEGER`), can represent nanosecond.
 */
export type Nanosecond = number & {};

export type TestFn = (...args: never[]) => void;

export interface BenchmarkJobCallbacks {
    /**
     * Called when benchmark starts running.
     */
    onStart?: () => void;
    /**
     * Called when the benchmark completes running.
     */
    onComplete?: () => void;
}

export interface BenchmarkJobSettings {
    /**
     * The delay between test cycles (ms).
     *
     * Default is `5`.
     */
    delay?: Millisecond;
    /**
     * The initial number of ops to run in a benchmark.
     *
     * Default is `16`.
     */
    initOps?: number;
    /**
     * The count of measurements required to perform statistical analysis.
     *
     * Default is `15`.
     */
    measurementCount?: number;
    /**
     * The minimum time a benchmark uses.
     *
     * Default is `100`.
     */
    minMeasurementTime?: Millisecond;
    /**
     * Warm up before formal benchmarking.
     *
     * Default is `7`
     */
    warmupCount?: number;
}

export interface BenchmarkJobTestFnOptions {
    /**
     * Used for pilot benchmarking and formal benchmarking.
     */
    args?: Arguments | Arguments[];
    /**
     * Used for jitting benchmarking. The arguments provided in `args` will be also added into `preArgs`.
     */
    jitArgs?: Arguments | Arguments[];
}

export interface BenchmarkJobOptions extends BenchmarkJobCallbacks, BenchmarkJobSettings, BenchmarkJobTestFnOptions {}
