export const minutesToMs = (min: number): number => 1000 * 60 * min;
export const hoursToMs = (hours: number): number => minutesToMs(hours) * 60;
