import { Statistics } from '../Data';
import { ColumnType } from './ColumnType';

export type GetData<T> = (stats: Statistics) => T;

export class BaseColumn<T> {
    protected declare _type: ColumnType;
    protected declare _columnName: string;

    protected declare _getData: GetData<T>;

    get type() {
        return this._type;
    }

    get columnName() {
        return this._columnName;
    }

    get getData() {
        return this._getData;
    }

    constructor(type: ColumnType, name: string, getData: GetData<T>) {
        this._type = type;
        this._columnName = name;

        this._getData = getData;
    }
}
