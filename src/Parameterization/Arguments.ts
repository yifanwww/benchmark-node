export class Arguments<Args extends ReadonlyArray<unknown>> {
    private _args: Args;

    public constructor(...args: Args) {
        this._args = args;
    }

    public get args() {
        return this._args;
    }
}
