import { ParamIterator, Params } from '../Parameterization';
import { FunctionInfo } from '../Tools/FunctionInfo';

export class Setup extends FunctionInfo {
    private declare _fn: (...args: readonly unknown[]) => void;
    private declare _fnInfo: FunctionInfo;
    private declare _iterator: ParamIterator;
    private declare _hasParams: boolean;

    public constructor(fn: (...args: unknown[]) => void, params: readonly Params<unknown>[]) {
        super(fn, 'global-setup');

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
