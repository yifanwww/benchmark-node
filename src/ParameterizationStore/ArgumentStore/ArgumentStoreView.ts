import type { Arguments } from '../../Parameterization';
import type { Optional } from '../../types.internal';

import type { ArgumentStore } from './ArgumentStore';

const NO_ARGUMENT_INDEX = -1;

export class ArgumentStoreView {
    private declare readonly _store: ArgumentStore;
    private declare readonly _index: number;

    get argsLength() {
        return this._store.argsLength;
    }

    get maxArgsLength() {
        return this._store.maxArgsLength;
    }

    private constructor(store: ArgumentStore, argIndex: Optional<number>) {
        this._store = store;
        this._index = argIndex ?? NO_ARGUMENT_INDEX;
    }

    hasArgs(): boolean {
        return this._index !== NO_ARGUMENT_INDEX;
    }

    get args() {
        return this._store.argsList[this._index];
    }

    private *_getJitArgsEnumerator() {
        for (const args of this._store.jitArgsList) {
            yield args;
        }
    }

    hasJitArgs(): boolean {
        return this._store.jitArgsList.length > 0;
    }

    get jitArgsList(): Generator<Arguments, void> {
        return this._getJitArgsEnumerator();
    }

    static *iteratesStoreArgs(store: ArgumentStore): Generator<ArgumentStoreView, void> {
        if (store.argsList.length === 0) {
            yield new ArgumentStoreView(store, null);
        } else {
            for (let i = 0; i < store.argsList.length; i++) {
                yield new ArgumentStoreView(store, i);
            }
        }
    }
}
