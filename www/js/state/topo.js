
export const initTopo = (width, height, depth) => {
  const topo = [];
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push(depth - 1);
    }
    topo.push(row);
  }
  return topo;
}

export const dig = (topo, {x,y}) => {
  if (x < 0 || y < 0 || y >= topo.length || x >= topo[y].length) return;
  if (topo[y][x] == 0) return;
  topo[y][x]--;
}

export const pile = (topo, {x,y}, maxHeight) => {
  if (x < 0 || y < 0 || y >= topo.length || x >= topo[y].length) return;
  if (topo[y][x] == 0) return;
  if (topo[y][x] >= maxHeight) return;
  topo[y][x]++;
}
