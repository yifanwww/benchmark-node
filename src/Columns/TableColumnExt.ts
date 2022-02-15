import { Statistics } from '../Data';

import { TableColumn } from './TableColumn';

export class TableColumnExt {
    public static calculateMaxLen(column: TableColumn<unknown>, statsArr: Statistics[]): number {
        let maxLen = column.columnName.length;

        for (const _stats of statsArr) {
            const data = column.format(_stats);
            maxLen = Math.max(maxLen, data.length);
        }

        return maxLen;
    }

    public static drawColumnName = (column: TableColumn<unknown>, maxLen: number) => column.columnName.padStart(maxLen);

    public static drawSperator = (maxLen: number) => ''.padEnd(maxLen, '-');

    public static draw = (column: TableColumn<unknown>, maxLen: number, stats: Statistics) =>
        column.format(stats).padStart(maxLen);
}
