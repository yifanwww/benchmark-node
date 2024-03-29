import type { Optional } from '../../types.internal';

import type { ParameterStore } from './ParameterStore';

export class ParameterStoreView {
    private declare readonly _store: ParameterStore;
    private declare readonly _index: number;

    get params(): readonly unknown[] {
        return this._store.getParams(this._index)!;
    }

    get strs(): readonly string[] {
        return this.params.map((param, index) => `${this._store.names[index]}=${String(param)}`);
    }

    private constructor(store: ParameterStore, index: number) {
        this._store = store;
        this._index = index;
    }

    static *iterateStore(store: Optional<ParameterStore>): Generator<Optional<ParameterStoreView>, void> {
        if (!store?.hasParams()) {
            yield null;
        } else {
            for (let i = 0; i < store.count; i++) {
                yield new ParameterStoreView(store, i);
            }
        }
    }
}
