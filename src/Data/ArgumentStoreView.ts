import { Arguments } from '../Parameterization';
import { Optional } from '../types.internal';
import { ArgumentStore } from './ArgumentStore';

const NO_ARGUMENT_INDEX = -1;

export class ArgumentStoreView {
    private declare _store: ArgumentStore;
    private declare _index: number;

    public get maxArgsLength() {
        return this._store.maxArgsLength;
    }

    public constructor(store: ArgumentStore, argIndex: Optional<number>) {
        this._store = store;
        this._index = argIndex ?? NO_ARGUMENT_INDEX;
    }

    public hasArgs(): boolean {
        return this._index !== NO_ARGUMENT_INDEX;
    }

    public get args() {
        return this._store.argsList[this._index];
    }

    private *getJitArgsEnumerator() {
        for (const args of this._store.jitArgsList) {
            yield args;
        }
    }

    public hasJitArgs(): boolean {
        return this._store.jitArgsList.length > 0;
    }

    public get jitArgsList(): Generator<Arguments, void> {
        return this.getJitArgsEnumerator();
    }
}
