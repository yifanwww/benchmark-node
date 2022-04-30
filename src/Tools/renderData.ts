import { Formatter } from './Formatter';
import { TimeTool } from './TimeTool';
import { TimeUnit, TimeUnitHelper } from './TimeUnit';
import { UnitType } from './UnitType';

export function renderData(value: number | string, type: UnitType, fractionDigit: number, timeUnit: TimeUnit) {
    switch (type) {
        case UnitType.Dimensionless:
            return Formatter.beautifyNumber((value as number).toFixed(fractionDigit));

        case UnitType.DimensionlessInteger:
            return Formatter.beautifyNumber(Math.round(value as number));

        case UnitType.Origin:
            return String(value);

        case UnitType.Time: {
            const data = TimeTool.convert(value as number, TimeUnit.NS, timeUnit);
            const num = Formatter.beautifyNumber(data.toFixed(fractionDigit));
            return `${num} ${TimeUnitHelper.getUnitStr(timeUnit)}`;
        }
    }
}
