import type { Arguments } from './Parameterization';
import type { UnknownFn } from './types.internal';

/* ----- Types ----- */

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

export type TestFn = UnknownFn;

export interface BenchmarkingSettings {
    /**
     * The delay between test cycles (ms).
     *
     * Default is `5`, minimum is `1`.
     */
    delay?: Millisecond;
    /**
     * The initial number of ops to run in a benchmark.
     *
     * Default is `16`, minimum is `1`.
     */
    initOps?: number;
    /**
     * The count of measurements required to perform statistical analysis.
     *
     * Default is `15`, minimum is `3`.
     */
    measurementCount?: number;
    /**
     * The minimum time a benchmark uses.
     *
     * Default is `250`, minimum is `1`.
     */
    minMeasurementTime?: Millisecond;
    /**
     * Warm up before formal benchmarking.
     *
     * Default is `7`, minimum is `1`.
     */
    warmupCount?: number;
}

export interface BenchmarkTestFnOptions<T extends TestFn> {
    /**
     * Used for pilot benchmarking and formal benchmarking.
     */
    args?: LooseArray<Arguments<Parameters<T>>>;
    /**
     * Used for jitting benchmarking. The arguments provided in `args` will be also added into `preArgs`.
     */
    jitArgs?: LooseArray<Arguments<Parameters<T>>>;
    /**
     * Set iteration setup.
     * A callback function to be executed exactly once before each benchmark function invocation.
     *
     * Warning: This may change in the future.
     */
    setup?: () => void;
    /**
     * Set iteration cleanup.
     * A callback function to be executed exactly once after each benchmark function invocation.
     *
     * Warning: This may change in the future.
     */
    cleanup?: () => void;
}

/* ----- Type Utils ----- */

export type LooseArray<T> = T | readonly T[];
