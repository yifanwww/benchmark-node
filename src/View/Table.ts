import { ConsoleLogger } from '../tools/ConsoleLogger';
import { Stats } from '../tools/Stats';
import { Column } from './Column';

export class Table {
    private _columns: Column[] = [];
    private _stats: Stats[] = [];

    public addColumn(column: Column): void {
        this._columns.push(column);
    }

    public addStats(stats: Stats[]): void {
        this._stats.push(...stats);
    }

    public draw(): void {
        for (const column of this._columns) {
            column.calculateMaxLen(this._stats);
        }

        const logger = ConsoleLogger.default;
        logger.writeLineStatistic(`| ${this._columns.map((column) => column.drawHeader()).join(' | ')} |`);
        logger.writeLineStatistic(`|-${this._columns.map((column) => column.drawSperator()).join('-|-')}-|`);
        for (const stats of this._stats) {
            logger.writeLineStatistic(`| ${this._columns.map((column) => column.draw(stats)).join(' | ')} |`);
        }
    }
}
