export interface MutableRefObject<T> {
    current: T;
}

export function createRef<T>(initialValue: T): MutableRefObject<T>;
export function createRef<T = undefined>(): MutableRefObject<T | undefined>;

export function createRef<T>(initialValue?: T): MutableRefObject<T | undefined> {
    return { current: initialValue };
}
