import { Stats } from '../tools/Stats';

export type GetData = (stats: Stats) => string | number;

export class Column {
    private _header: string;
    private _getData: GetData;

    private _maxLen: number = 0;

    public constructor(header: string, getData: GetData) {
        this._header = header;
        this._getData = getData;
    }

    public calculateMaxLen(stats: Stats[]): void {
        let maxLen = 0;
        for (const _stats of stats) {
            const data = this._getData(_stats);
            // 3 is the length of ' ns'
            maxLen = Math.max(maxLen, typeof data === 'string' ? data.length : data.toFixed(4).length + 3);
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
        if (typeof data === 'string') {
            return data.padStart(this._maxLen);
        } else {
            return `${data.toFixed(4)} ns`.padStart(this._maxLen);
        }
    }
}
