import { Stats } from '../Data';
import { Optional } from '../types.internal';

export type GetData<Value> = (stats: Stats) => Value;

export class Column<Value> {
    protected _header: string;
    protected _getData: Optional<GetData<Value>>;

    protected _maxLen: number = 0;

    public constructor(header: string, getData?: GetData<Value>) {
        this._header = header;
        this._getData = getData ?? null;
    }

    protected getDataWrapper(stats: Stats): string {
        if (!this._getData) return '';

        const data = this._getData(stats);
        return typeof data === 'string' ? data : String(data);
    }

    public calculateMaxLen(stats: Stats[]): void {
        let maxLen = this._header.length;

        for (const _stats of stats) {
            const data = this.getDataWrapper(_stats);
            maxLen = Math.max(maxLen, data.length);
        }

        this._maxLen = maxLen;
    }

    public drawHeader(): string {
        return this._header.padStart(this._maxLen);
    }

    public drawSperator(): string {
        return ''.padEnd(this._maxLen, '-');
    }

    public draw(stats: Stats): string {
        const data = this.getDataWrapper(stats);
        return data.padStart(this._maxLen);
    }
}
