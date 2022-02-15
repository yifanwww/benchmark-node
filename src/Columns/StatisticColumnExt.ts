import { Statistics } from '../Data';
import { TimeTool, TimeUnit } from '../Tools/TimeTool';
import { StatisticColumn } from './StatisticColumn';

export class StatisticColumnExt {
    public static findMinNumber(column: StatisticColumn, statsArr: Statistics[]): TimeUnit {
        let min = Number.MAX_SAFE_INTEGER;

        for (const stats of statsArr) {
            const data = column.getData(stats);
            min = Math.min(min, data);
        }

        return min;
    }

    public static chooseTimeUnit(time: number): TimeUnit {
        if (time <= 1e3) {
            return TimeUnit.NS;
        } else if (time <= 1e6) {
            return TimeUnit.US;
        } else if (time <= 1e9) {
            return TimeUnit.MS;
        } else {
            return TimeUnit.S;
        }
    }

    public static findFractionDigit(column: StatisticColumn, statsArr: Statistics[]): number {
        let min = Number.MAX_SAFE_INTEGER;

        for (const _stats of statsArr) {
            const data = TimeTool.convert(column.getData(_stats), TimeUnit.NS, column.timeUnit);
            min = Math.min(min, data);
        }

        if (min <= 1) {
            return 4;
        } else if (min <= 10) {
            return 3;
        } else if (min <= 100) {
            return 2;
        } else if (min <= 1000) {
            return 1;
        } else {
            return 0;
        }
    }
}
