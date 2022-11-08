import { Formatter } from './Formatter';
import { TimeTool } from './TimeTool';
import { TimeUnit, TimeUnitHelper } from './TimeUnit';
import { UnitType } from './UnitType';

export function renderData(value: number | string, type: UnitType, fractionDigit: number, timeUnit: TimeUnit) {
    switch (type) {
        case UnitType.DIMENSIONLESS:
            return Formatter.beautifyNumber((value as number).toFixed(fractionDigit));

        case UnitType.DIMENSIONLESS_INTEGER:
            return Formatter.beautifyNumber(Math.round(value as number));

        case UnitType.ORIGIN:
            return String(value);

        case UnitType.TIME: {
            const data = TimeTool.convert(value as number, TimeUnit.NS, timeUnit);
            const num = Formatter.beautifyNumber(data.toFixed(fractionDigit));
            return `${num} ${TimeUnitHelper.getUnitStr(timeUnit)}`;
        }
    }
}
