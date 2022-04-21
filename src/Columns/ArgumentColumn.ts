import { BaseColumn } from './BaseColumn';
import { ColumnType } from './ColumnType';

export class ArgumentColumn extends BaseColumn<ReadonlyArray<unknown> | undefined> {
    private declare readonly _index: number;

    get index() {
        return this._index;
    }

    constructor(index: number) {
        super(ColumnType.FnArgument, `arg ${index}`, (stats) => stats.args?.args);

        this._index = index;
    }
}
