
import {oneOf} from '../utils/stochastic.js';

export const toDrop = ({x, y, z}) => {
  return x + "|" + y + "|" + z;
};
export const fromDrop = (drop) => {
  const vals = drop.split("|");
  const p = parseInt;
  return {x: p(vals[0]), y: p(vals[1]), z: p(vals[2])};
}

export const initWater = (depth) => {
  const water = [];
  for (let z = 0; z < depth; z++) {
    water.push({});
  }
  return water;
}

export const addDrop = (water, x, y, z) => {
  water[z][toDrop({x, y, z})] = {dir: "O", prev: toDrop({x, y, z})};
};

export const flowWater = (water, topo) => {
  const nextWater = initWater(water.length);
  for (let z = 0; z < water.length; z++) {
    for (const drop in water[z]) {
      const {x, y} = fromDrop(drop);
      // try to fall straight down
      if (z > 0 && topo[y][x] < z - 1 && !nextWater[z-1][toDrop({x,y,z:z-1})]) {
        nextWater[z-1][toDrop({x,y,z:z-1})] = {dir: "o", prev: drop};
        continue;
      }

      // try to flow side-to-side
      const freePositions = [];
      const dirs = [
        {x: -1, y: 0, dir: "<"}, {x: 1, y: 0, dir: ">"},
        {x: 0, y: 1, dir: "v"}, {x: 0, y: -1, dir: "^"},
        // {x: 0, y: 0, dir: "O"}, // staying put also ok
      ]
      for (const d of dirs) {
        const pos = {x: x + d.x, y: y + d.y, z, dir: d.dir};
        const width = topo[0].length;
        const height = topo.length;

        if (pos.x < 0 || pos.y < 0 || pos.x >= width || pos.y >= height) continue;
        if (water[z][drop].prev == toDrop({...pos})) continue; // don't go back
        if (topo[pos.y][pos.x] >= z) continue; // ground
        if (nextWater[z][toDrop(pos)]) continue; // water

        // else spot next to you is free, but try to fall down there too
        if (
          z > 0 && topo[pos.y][pos.x] < z - 1 &&
          !nextWater[z-1][toDrop({x: pos.x, y: pos.y, z: z-1})]
        ) {
          freePositions.push({...pos, z: z - 1});
        } else {
          freePositions.push(pos);
        }
      }
      if (freePositions.length > 0) {
        const chosen = oneOf(freePositions);
        nextWater[chosen.z][toDrop(chosen)] = {dir: chosen.dir, prev: drop};
        continue;
      }

      // your current position may have become occupied, then go up
      if (nextWater[z][drop] != null) {
        // nextWater[z+1][drop] = {dir: "U", prev: toDrop({x: 0, y: 0, z: 0})}
        // just go away for now
      } else {
        nextWater[z][drop] = {dir: "O", prev: drop};
      }
    }
  }
  return nextWater;
};

const toString = (water, topo) => {
  const grid = [];
  for (let i = 0; i < topo.length; i++) {
    const row = [];
    for (let j = 0; j < topo[i].length; j++) {
      // row.push(topo[i][j]);
      row.push(" ");
    }
    grid.push(row);
  }

  for (let z = 0; z < water.length; z++) {
    for (const drop in water[z]) {
      const {x, y} = fromDrop(drop);
      grid[y][x] = water[z][drop].dir;
    }
  }

  str = "";
  for (const row of grid) {
    str += row.join("") + "\n";
  }
  return str.trim();
}

const countWater = (water) => {
  let count = 0;
  for (let z = 0; z < water.length; z++) {
    for (const drop in water[z]) {
      count++;
    }
  }
  return count;
}





// const WIDTH = 10;
// const HEIGHT = 10;
// const DEPTH = 10;

// let water = initWater(DEPTH);
//
// const topo = [
//   [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
//   [9, 2, 1, 1, 1, 1, 1, 1, 1, 9],
//   [9, 3, 4, 1, 1, 1, 1, 2, 1, 9],
//   [9, 4, 5, 2, 1, 1, 8, 2, 1, 9],
//   [9, 5, 6, 3, 2, 1, 8, 2, 1, 9],
//   [9, 6, 7, 4, 3, 2, 8, 2, 1, 9],
//   [9, 7, 8, 8, 8, 3, 8, 2, 1, 9],
//   [9, 8, 9, 9, 9, 4, 8, 2, 2, 9],
//   [9, 9, 8, 8, 8, 8, 8, 8, 8, 9],
//   [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
// ];
//
// // addDrop(water, 1, 7, 8);
// // console.log(toString(water, topo));
// // console.log(water);
//
// for (let i = 0; i < 150; i++) {
//   addDrop(water, 1, 7, 9);
//   water = flowWater(water, topo);
//   console.log(toString(water, topo));
//   console.log(countWater(water));
// }
// console.log(water);
// console.log(countWater(water));
