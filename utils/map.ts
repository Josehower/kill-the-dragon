export function gridGenerator(col: number = 10, row?: number) {
  if (!row) {
    row = col;
  }

  const grid: number[][] = [];

  for (let r = 0; r < col; r++) {
    const line = Array.from({ length: row }, (a_a, i) => [r, i]);
    line.forEach((arr) => grid.push(arr));
  }

  return grid.sort((a, b) => (a[1] > b[1] ? -1 : 1));
}
