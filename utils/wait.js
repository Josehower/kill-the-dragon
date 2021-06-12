export function wait(time) {
  return new Promise(solve => setTimeout(solve, time));
}
