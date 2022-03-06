export function gridGenerator(
  col: number = 10,
  row?: number,
  offset: [number, number] = [0, 0],
) {
  if (!row) {
    row = col;
  }

  const grid: number[][] = [];

  for (let r = 0; r < col; r++) {
    const line = Array.from({ length: row }, (a_a, i) => [
      r + offset[0],
      i + offset[1],
    ]);
    line.forEach((arr) => grid.push(arr));
  }

  console.log(grid);

  // Sort the grid to match react three fiber grid layout
  return grid.sort((a, b) => (a[1] > b[1] ? -1 : 1));
}
