import type { Statistics } from '../Data';

import type { ColumnType } from './ColumnType';

export type GetData<T> = (stats: Statistics) => T;

export class BaseColumn<T> {
    protected declare _type: ColumnType;
    protected declare _name: string;

    protected declare _getData: GetData<T>;

    get type() {
        return this._type;
    }

    get name() {
        return this._name;
    }

    get getData() {
        return this._getData;
    }

    constructor(type: ColumnType, name: string, getData: GetData<T>) {
        this._type = type;
        this._name = name;

        this._getData = getData;
    }
}
