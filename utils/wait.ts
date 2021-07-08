export function wait(time: number) {
  return new Promise(solve => setTimeout(solve, time));
}
