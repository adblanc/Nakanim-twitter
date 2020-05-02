export default function sleepMs(millis: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
