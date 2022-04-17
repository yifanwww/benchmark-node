export type Optional<T> = T | null;

export type Hrtime = [number, number];

export type AnyFn = (...args: unknown[]) => unknown;

/**
 * Used for generic function to infer function parameters.
 *
 * Example:
 *
 * ```ts
 * function fn<T extends UnknownFn>(cb: T): void {}
 * ```
 */
export type UnknownFn = (...args: never[]) => unknown;
