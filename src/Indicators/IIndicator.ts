import type { Statistics } from '../Data';
import type { UnitType } from '../Tools/UnitType';

export interface IIndicator {
    /**
     * An unique identifier of the indicator.
     *
     * If there are several indicators with the same id, only one of them will be used.
     */
    get id(): string;

    /**
     * Display indicator title.
     */
    get indicatorName(): string;

    /**
     * Indicator description.
     */
    get legend(): string;

    /**
     * Defines how to format indicator's value.
     */
    get unitType(): UnitType;

    /**
     * Formatted value of this indicator.
     */
    getValue(statistics: Statistics): number;
}
