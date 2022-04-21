import { MultiIndexIterator } from '../Tools/MultiIndexIterator';
import { GlobalSetup } from './GlobalSetup';

export class GlobalSetupView {
    private declare _setup: GlobalSetup;
    private declare _params: readonly unknown[];

    constructor(setup: GlobalSetup, indexes: readonly number[]) {
        this._setup = setup;

        this._params = indexes.map((index, i) => this._setup.params[i].values[index]);
    }

    execute(): void {
        this._setup.fn?.(...this._params);
    }

    static *iteratesGlobalSetupExecutors(globalSetup: GlobalSetup): Generator<GlobalSetupView, void> {
        if (globalSetup.params.length === 0) {
            yield new GlobalSetupView(globalSetup, []);
        } else {
            const iter = new MultiIndexIterator(globalSetup.params.map((param) => param.values.length));
            for (const indexes of iter) {
                yield new GlobalSetupView(globalSetup, indexes);
            }
        }
    }
}
