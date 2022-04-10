export function isInsideTile(
  tilePosition: [number, number],
  XYPosition: [number, number],
) {
  const { x1, y1, x2, y2 } = {
    x1: tilePosition[0] - 0.5,
    y1: tilePosition[1] - 0.5,
    x2: tilePosition[0] + 0.5,
    y2: tilePosition[1] + 0.5,
  };
  return (
    XYPosition[0] > x1 &&
    XYPosition[0] < x2 &&
    XYPosition[1] > y1 &&
    XYPosition[1] < y2
  );
}
