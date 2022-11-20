import type { Statistics } from '../../Data';
import type { IIndicator } from '../../Indicators';

export type StatisticGroup = Statistics[];

export interface BenchmarkResult {
    readonly argLen: number;
    readonly indicators: readonly IIndicator[];
    readonly paramNames: readonly string[];
    readonly statisticGroups: readonly StatisticGroup[];
}
