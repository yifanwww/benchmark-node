import type { Millisecond, Nanosecond } from '../types';
import type { Hrtime } from '../types.internal';

import { TimeUnit } from './TimeUnit';

export class TimeTool {
    static convert(time: number, from: TimeUnit, to: TimeUnit): number {
        return time * 1e3 ** (from - to);
    }

    static ms2ns(ms: Millisecond): Nanosecond {
        return TimeTool.convert(ms, TimeUnit.MS, TimeUnit.NS);
    }

    static hrtime2ns(hrtime: Hrtime): Nanosecond {
        return hrtime[0] * 1e9 + hrtime[1];
    }

    static sleep(ns: Nanosecond): void {
        const begin = process.hrtime();
        let duration;
        do {
            duration = process.hrtime(begin);
        } while (TimeTool.hrtime2ns(duration) < ns);
    }
}

export { TimeTool as Time };
