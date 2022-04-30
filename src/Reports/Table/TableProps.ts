import { TimeUnit } from '../../Tools/TimeUnit';
import { ColumnInfo } from './ColumnInfo';

export interface TableProps {
    infos: ColumnInfo[];
    timeUnit: TimeUnit;
}
