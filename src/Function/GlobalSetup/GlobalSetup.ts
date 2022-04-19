import { Params } from '../../Parameterization';
import { MultiIndexIterator } from '../../Tools/MultiIndexIterator';
import { Optional } from '../../types.internal';
import { FunctionInfo } from '../FunctionInfo';
import { GlobalSetupView } from './GlobalSetupView';

export class GlobalSetup {
    static EMPTY = new GlobalSetup(null, []);

    private declare _fn: Optional<(...args: readonly unknown[]) => void>;
    private declare _paramNames: readonly string[];
    private declare _params: readonly Params[];

    constructor(fn: Optional<(...args: unknown[]) => void>, params: readonly Params[]) {
        this._fn = fn;
        this._paramNames = fn ? FunctionInfo.getParameterNames(fn) : [];
        this._params = params;
    }

    get fn() {
        return this._fn;
    }

    get paramNames() {
        return this._paramNames;
    }

    get params() {
        return this._params;
    }

    *getViewEnumerator(): Generator<GlobalSetupView, void> {
        if (this._params.length === 0) {
            yield new GlobalSetupView(this, []);
        } else {
            const iter = new MultiIndexIterator(this._params.map((param) => param.values.length));
            for (const indexes of iter) {
                yield new GlobalSetupView(this, indexes);
            }
        }
    }
}
