import { MultiIndexIterator } from '../Tools/MultiIndexIterator';
import { Params } from './Params';

export class ParamIterator {
    private declare _params: readonly Params<unknown>[];

    public constructor(params: readonly Params<unknown>[]) {
        this._params = params;
    }

    public *[Symbol.iterator]() {
        const iter = new MultiIndexIterator(this._params.map((param) => param.values.length));

        for (const indexes of iter) {
            yield indexes.map((index, i) => this._params[i].values[index]);
        }
    }
}