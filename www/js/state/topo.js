import {smartGet, smartSet} from '../utils/arraysAndObjects.js';


export class Topo {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.topo = {}; // SmartMap<Coord, Object>
    this.waterSources = []; // Array<{x, y, water}>

    this.reset();
  }

  union({x,y}, vals) {
    const square = smartGet(this.topo, {x,y});
    if (!square) return;
    smartSet(this.topo, {x,y}, {...square, ...vals});
  }

  reset() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        smartSet(this.topo, {x, y}, {elevation: 1, water: 0});
      }
    }
  }

  clearWater() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.union({x,y}, {water: 0});
      }
    }
  }

  addWaterSource({x, y, water}) {
    this.waterSources.push({x, y, water});
    this.computeWater();
  }

  dig({x,y}) {
    const square = smartGet(this.topo, {x,y});
    if (square?.elevation > 0) {
      smartSet(
        this.topo, {x, y},
        {...square, elevation: square.elevation - 1},
      );
      this.computeWater();
    }
  }

  pile({x,y}) {
    const square = smartGet(this.topo, {x,y});
    smartSet(
      this.topo, {x, y},
      {...square, elevation: square.elevation + 1},
    );
    this.computeWater();
  }

  computeWater() {
    this.clearWater();
    const visited = {};
    const sources = this.waterSources.map(s => ({...s}));
    const queue = sources.map((s,i) => {
      return {x: s.x, y: s.y, source: i};
    });
    while (queue.length > 0) {
      const {x, y, source} = queue.shift();
      if (sources[source].water <= 0) continue;

      smartSet(visited, {x,y}, source);
      if (smartGet(this.topo, {x,y}).water == 0) {
        sources[source].water--;
      }
      this.union({x,y}, {water: sources[source].water});

      this.getNeighbors({x,y})
        .filter(c => smartGet(this.topo, c)?.elevation == 0)
        .filter(c => {
          return smartGet(visited, c) == null ||
            smartGet(visited, c) != source;
        })
        .forEach(c => queue.push({x: c.x, y: c.y, source}));
    }
  }

  getNeighbors({x, y}) {
    const neighbors = [
      {x: x - 1, y}, {x: x + 1, y},
      {x, y: y - 1}, {x, y: y + 1},
    ];
    return neighbors.filter(c => smartGet(this.topo, c));
  }


}
