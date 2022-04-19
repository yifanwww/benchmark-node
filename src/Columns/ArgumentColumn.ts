import { TableColumn } from './TableColumn';

export class ArgumentColumn extends TableColumn<ReadonlyArray<unknown> | undefined> {
    private declare readonly _index: number;

    get index() {
        return this._index;
    }

    constructor(index: number) {
        super(`arg ${index}`, (stats) => stats.args?.args);

        this._index = index;
    }
}
