import { GlobalSetup } from './GlobalSetup';

export class GlobalSetupView {
    private declare _setup: GlobalSetup;
    private declare _params: readonly unknown[];

    public constructor(setup: GlobalSetup, indexes: readonly number[]) {
        this._setup = setup;

        this._params = indexes.map((index, i) => this._setup.params[i].values[index]);
    }

    public execute(): void {
        this._setup.fn?.(...this._params);
    }
}
