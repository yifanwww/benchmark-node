export class Params<T> {
    private declare readonly _values: readonly T[];

    public constructor(...values: readonly T[]) {
        if (values.length === 0) {
            throw new Error(`\`${Params.name}\` received no value.`);
        }

        this._values = values;
    }

    public get values() {
        return this._values;
    }
}

type ArgsIteration<Prev extends readonly unknown[], Rest extends readonly unknown[]> = Rest extends readonly [
    infer T,
    ...infer _Rest
]
    ? ArgsIteration<readonly [...Prev, Params<T>], _Rest>
    : Rest extends readonly [infer T]
    ? ArgsIteration<readonly [...Prev, Params<T>], []>
    : Prev;

export type MapToParams<Args extends readonly unknown[]> = ArgsIteration<[], Args>;
