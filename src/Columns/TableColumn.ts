import { Statistics } from '../Data';

export type GetData<Value> = (stats: Statistics) => Value;

export class TableColumn<Value> {
    protected _columnName: string;
    protected _getData: GetData<Value>;

    public get columnName() {
        return this._columnName;
    }

    public get getData() {
        return this._getData;
    }

    public constructor(columnName: string, getData: GetData<Value>) {
        this._columnName = columnName;
        this._getData = getData;
    }

    public format(stats: Statistics): string {
        const data = this._getData(stats);
        return String(data);
    }
}
