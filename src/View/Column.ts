import { Stats } from '../Data';

export type GetData = (stats: Stats) => string;

export class Column {
    protected _header: string;
    protected _getData: GetData;

    protected _maxLen: number = 0;

    public constructor(header: string, getData: GetData) {
        this._header = header;
        this._getData = getData;
    }

    public static drawTime = (time: number) => `${time.toFixed(4)} ns`;

    public calculateMaxLen(stats: Stats[]): void {
        let maxLen = this._header.length;

        for (const _stats of stats) {
            const data = this._getData(_stats);
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
        const data = this._getData(stats);
        return data.padStart(this._maxLen);
    }
}
