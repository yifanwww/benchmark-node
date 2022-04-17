import { ParamIterator, Params } from '../Parameterization';
import { FunctionInfo } from './FunctionInfo';

export class GlobalSetup extends FunctionInfo {
    private declare _fn: (...args: readonly unknown[]) => void;

    private declare _iter: ParamIterator;
    private declare _hasParams: boolean;

    public constructor(fn: (...args: unknown[]) => void, params: readonly Params<unknown>[]) {
        super(fn);

        this._fn = fn;
        this._iter = new ParamIterator(params);
        this._hasParams = params.length > 0;
    }

    public get fn() {
        return this._fn;
    }

    public hasParams(): boolean {
        return this._hasParams;
    }

    public get params(): Generator<unknown[], void> {
        return this._iter[Symbol.iterator]();
    }
}
