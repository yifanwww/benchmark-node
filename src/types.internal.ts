import { Nanosecond } from './types';

export type Optional<T> = T | null;

export type Hrtime = [number, number];

export type ConfidenceInterval = [Nanosecond, Nanosecond];
