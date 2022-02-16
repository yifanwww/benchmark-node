import { Statistics } from '../Data';

export type GetData<T> = (stats: Statistics) => T;

export class TableColumn<T> {
    protected _columnName: string;
    protected _getData: GetData<T>;

    public get columnName() {
        return this._columnName;
    }

    public get getData() {
        return this._getData;
    }

    public constructor(columnName: string, getData: GetData<T>) {
        this._columnName = columnName;
        this._getData = getData;
    }
}
