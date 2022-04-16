import { ParamIterator, Params } from '../Parameterization';

export class Setup {
    private declare _fn: (...args: readonly unknown[]) => void;
    private declare _iterator: ParamIterator;
    private declare _hasParams: boolean;

    public constructor(fn: (...args: unknown[]) => void, params: readonly Params<unknown>[]) {
        this._fn = fn;
        this._iterator = new ParamIterator(params);
        this._hasParams = params.length > 0;
    }

    public get fn() {
        return this._fn;
    }

    public hasParams(): boolean {
        return this._hasParams;
    }

    public get params(): Generator<unknown[], void> {
        return this._iterator.iter;
    }
}
