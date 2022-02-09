import { Millisecond, Nanosecond } from '../types';
import { Hrtime } from '../types.internal';

import { MathTool } from './MathTool';

export enum TimeUnit {
    NS,
    US,
    MS,
    S,
}

export const TimeUnitStr = {
    [TimeUnit.NS]: 'ns',
    [TimeUnit.US]: 'us',
    [TimeUnit.MS]: 'ms',
    [TimeUnit.S]: 's',
};

export class TimeTool {
    public static convert(time: number, from: TimeUnit, to: TimeUnit): number {
        return time * 1e3 ** (from - to);
    }

    public static ms2ns = (ms: Millisecond): Nanosecond => TimeTool.convert(ms, TimeUnit.MS, TimeUnit.NS);

    public static hrtime2ns = (hrtime: Hrtime): Nanosecond => hrtime[0] * 1e9 + hrtime[1];

    public static sleep(ns: Nanosecond): void {
        const begin = process.hrtime();
        let duration;
        do {
            duration = process.hrtime(begin);
        } while (TimeTool.hrtime2ns(duration) < ns);
    }

    private static _minResolution = 0;

    /**
     * Gets the current timer's minimum resolution.
     */
    private static getMinResolution(): Nanosecond {
        const samples: Nanosecond[] = [];

        // The first few measurement times we got weren't stable enough, so dropped them.
        // To test it, you can comment the following loop, then run "src/minTimeResolution.ts".
        for (let count = 20; count > 0; count--) {
            process.hrtime(process.hrtime());
        }

        // Get average smallest measurable time.
        for (let count = 200; count > 0; count--) {
            const measured = process.hrtime(process.hrtime());
            samples.push(TimeTool.hrtime2ns(measured));
        }

        // Calculate the average value.
        return MathTool.mean(samples);
    }

    public static get minResolution() {
        if (TimeTool._minResolution === 0) {
            TimeTool._minResolution = TimeTool.getMinResolution();
        }
        return TimeTool._minResolution;
    }
}

export { TimeTool as Time };
