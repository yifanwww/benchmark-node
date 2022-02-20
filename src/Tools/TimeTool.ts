import { Millisecond, Nanosecond } from '../types';
import { Hrtime } from '../types.internal';

import { TimeUnit } from './TimeUnit';

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
}

export { TimeTool as Time };
