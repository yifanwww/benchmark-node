export enum TimeUnit {
    NS,
    US,
    MS,
    S,
}

const TimeUnitStr = {
    [TimeUnit.NS]: 'ns',
    [TimeUnit.US]: 'us',
    [TimeUnit.MS]: 'ms',
    [TimeUnit.S]: 's',
};

const TimeUnitDescription = {
    [TimeUnit.NS]: '1 Nanosecond (0.000000001 sec)',
    [TimeUnit.US]: '1 Microsecond (0.000001 sec)',
    [TimeUnit.MS]: '1 Millisecond (0.001 sec)',
    [TimeUnit.S]: '1 Second',
};

export class TimeUnitHelper {
    static getUnitStr(unit: TimeUnit) {
        return TimeUnitStr[unit];
    }

    static getUnitDescription(unit: TimeUnit) {
        return TimeUnitDescription[unit];
    }

    static getFullDescription(unit: TimeUnit, maxHeaderLen: number) {
        const unitStr = TimeUnitHelper.getUnitStr(unit).padEnd(maxHeaderLen - 2);
        const unitDesc = TimeUnitHelper.getUnitDescription(unit);
        return `1 ${unitStr}: ${unitDesc}`;
    }

    static chooseUnit(time: number): TimeUnit {
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
}
