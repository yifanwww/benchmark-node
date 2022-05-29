import { Formatter } from '../Tools/Formatter';
import { BaseColumn } from './BaseColumn';
import { ColumnType } from './ColumnType';

export class ParameterColumn extends BaseColumn<string> {
    constructor(title: string, index: number) {
        super(ColumnType.Parameter, title, (stats) => {
            const data = stats.params![index];

            // If parameter is too long
            const arg = Formatter.limitStringLength(String(data));

            return arg;
        });
    }
}
