import { ArgumentColumn } from './ArgumentColumn';
import { BaseColumnHelper } from './BaseColumnHelper';

export class ArgumentColumnHelper extends BaseColumnHelper<string> {
    protected declare _column: ArgumentColumn;
}
