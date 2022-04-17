export class Arguments<Args extends readonly unknown[]> {
    private declare readonly _args: Args;

    public constructor(...args: Args) {
        this._args = args;
    }

    public get args() {
        return this._args;
    }
}
