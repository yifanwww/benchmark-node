import type { StatisticColumn } from '../../Columns';
import type { Statistics } from '../../Data';

export type StatisticGroup = Statistics[];

export interface BenchmarkResult {
    readonly argLen: number;
    readonly columns: readonly StatisticColumn[];
    readonly paramNames: readonly string[];
    readonly statisticGroups: readonly StatisticGroup[];
}
