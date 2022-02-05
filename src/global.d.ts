/* ----- Types ----- */

type AnyFn = (...args: unknown[]) => unknown;

/**
 * Used for generic function to infer function parameters.
 *
 * Example:
 *
 * ```ts
 * function fn<T extends UnknownFn>(cb: T): void {}
 * ```
 */
type UnknownFn = (...args: never[]) => unknown;

/* ----- Type Utils ----- */

type Optional<T> = T | null;

type ValueOf<T> = T[keyof T];
