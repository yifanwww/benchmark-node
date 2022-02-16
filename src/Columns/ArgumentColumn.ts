import { TableColumn } from './TableColumn';

export class ArgumentColumn extends TableColumn<ReadonlyArray<unknown> | undefined> {
    private _index: number;

    public get index() {
        return this._index;
    }

    public constructor(index: number) {
        super(`arg ${index}`, (stats) => stats.args?.args);

        this._index = index;
    }
}
