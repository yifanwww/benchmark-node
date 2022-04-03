export class Params {
    private declare readonly _values: unknown[];

    public constructor(...values: unknown[]) {
        this._values = values;
    }

    public get values() {
        return this._values;
    }
}
