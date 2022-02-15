export class Params {
    private _values: unknown[];

    public constructor(...values: unknown[]) {
        this._values = values;
    }

    public get values() {
        return this._values;
    }
}
