import { Formatter } from '../Tools/Formatter';

import { BaseColumn } from './BaseColumn';
import { ColumnType } from './ColumnType';

export class ParameterColumn extends BaseColumn<string> {
    constructor(title: string, index: number) {
        super(ColumnType.PARAMETER, title, (stats) => {
            const param = stats.params![index];

            const typeofParam = typeof param;

            if (
                typeofParam === 'bigint' ||
                typeofParam === 'boolean' ||
                typeofParam === 'number' ||
                typeofParam === 'symbol' ||
                typeofParam === 'undefined'
            ) {
                return String(param);
            }

            if (typeofParam === 'function') {
                return 'function';
            }

            // If parameter is too long
            return Formatter.limitStringLength(String(param));
        });
    }
}
