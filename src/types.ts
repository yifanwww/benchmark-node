import { Arguments } from './ConfigOptions';

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

export type TestFn = (...args: never[]) => unknown;

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

export interface BenchmarkJobTestFnOptions<T extends TestFn> {
    /**
     * Used for pilot benchmarking and formal benchmarking.
     */
    args?: Arguments<Parameters<T>> | ReadonlyArray<Arguments<Parameters<T>>>;
    /**
     * Used for jitting benchmarking. The arguments provided in `args` will be also added into `preArgs`.
     */
    jitArgs?: Arguments<Parameters<T>> | ReadonlyArray<Arguments<Parameters<T>>>;
    /**
     * Set iteration setup.
     * A callback function to be executed exactly once before each benchmark function invocation.
     */
    setup?: () => void;
    /**
     * Set iteration cleanup.
     * A callback function to be executed exactly once after each benchmark function invocation.
     */
    cleanup?: () => void;
}

export interface BenchmarkJobOptions<T extends TestFn> extends BenchmarkJobSettings, BenchmarkJobTestFnOptions<T> {}
