import { Nanosecond } from './types';

// eslint-disable-next-line @typescript-eslint/naming-convention
export type _Argument = unknown & { __arg__: void };
export type _Arguments = _Argument[];

export type Hrtime = [number, number];

export type ConfidenceInterval = [Nanosecond, Nanosecond];
