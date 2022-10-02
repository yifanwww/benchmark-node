import type { TimeUnit } from '../../Tools/TimeUnit';

import type { ColumnInfo } from './ColumnInfo';

export interface TableProps {
    infos: ColumnInfo[];
    timeUnit: TimeUnit;
}
