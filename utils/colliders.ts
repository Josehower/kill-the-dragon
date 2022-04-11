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

export function isInsidePortal({
  portal,
  tileMap,
  XYPositionToCheck,
}: {
  portal: {
    position: { x: number; y: number };
    size: { pixelsWidth: number; pixelsHeight: number };
  };
  tileMap: {
    mapSize: { tilesWidth: number; tilesHeight: number };
    tileSize: { pixelsWidth: number; pixelsHeight: number };
    offset: {
      x: number;
      y: number;
    };
  };
  XYPositionToCheck: { x: number; y: number };
}) {
  const x =
    portal.position.x / tileMap.tileSize.pixelsWidth -
    tileMap.mapSize.tilesWidth / 2 +
    tileMap.offset.x;

  const y =
    (tileMap.tileSize.pixelsHeight * tileMap.mapSize.tilesHeight -
      (portal.position.y + portal.size.pixelsHeight)) /
      tileMap.tileSize.pixelsHeight -
    tileMap.mapSize.tilesHeight / 2 +
    tileMap.offset.y;

  const { x1, y1, x2, y2 } = {
    x1: x - 0.5,
    y1: y - 0.5,
    x2: x + portal.size.pixelsWidth / 32 + 0.5 - 1,
    y2: y + portal.size.pixelsHeight / 32 + 0.5 - 1,
  };

  // console.log(x, x2, y, y2);
  return (
    XYPositionToCheck.x > x1 &&
    XYPositionToCheck.x < x2 &&
    XYPositionToCheck.y > y1 &&
    XYPositionToCheck.y < y2
  );
}
