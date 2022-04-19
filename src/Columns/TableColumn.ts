import { Statistics } from '../Data';

export type GetData<T> = (stats: Statistics) => T;

export class TableColumn<T> {
    protected declare _columnName: string;
    protected declare _getData: GetData<T>;

    get columnName() {
        return this._columnName;
    }

    get getData() {
        return this._getData;
    }

    constructor(columnName: string, getData: GetData<T>) {
        this._columnName = columnName;
        this._getData = getData;
    }
}
