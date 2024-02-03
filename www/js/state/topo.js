import {smartGet, smartSet} from '../utils/arraysAndObjects.js';


export class Topo {

  ///////////////////////
  // Constructors
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.topo = {}; // SmartMap<Coord, Object>
      // Object: {
      //  elevation: number,
      //  water: number,
      //  influence: number,
      // }
    this.waterSources = []; // Array<{x, y, water}>
    this.influenceSources = []; //Array<{x, y, influence}>
    this.waterSourceMultiplier = 1;

    this.reset();
  }

  fromJSON({
    width, height, topo,
  }) {
    const toReturn = new Topo(width, height);
    toReturn.topo = {...toReturn.topo, ...topo.topo};
    toReturn.waterSources = [...topo.waterSources];
    toReturn.influenceSources = [...topo.influenceSources];
    toReturn.computeWater();
    return toReturn;
  }



  ///////////////////////
  // Getters
  getWaterSource({x, y}) {
    return this.waterSources.find(w => w.x == x && w.y == y);
  }

  getNeighbors({x, y}, includeDiagonals) {
    let neighbors = [
      {x: x - 1, y}, {x: x + 1, y},
      {x, y: y - 1}, {x, y: y + 1},
    ];
    if (includeDiagonals) {
      neighbors = [...neighbors,
        {x: x - 1, y: y - 1}, {x: x + 1, y: y + 1},
        {x: x - 1, y: y + 1}, {x: x + 1, y: y - 1},
      ];
    }
    return neighbors.filter(c => smartGet(this.topo, c));
  }


  ///////////////////////
  // Setters
  reset() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        smartSet(this.topo, {x, y}, {
          elevation: 1, water: 0, influence: 0,
        });
      }
    }
  }

  union({x,y}, vals) {
    const square = smartGet(this.topo, {x,y});
    if (!square) return;
    smartSet(this.topo, {x,y}, {...square, ...vals});
  }

  clearWater() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.union({x,y}, {water: 0});
      }
    }
  }

  clearInfluence() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.union({x,y}, {influence: 0});
      }
    }
  }

  addWaterSource({x, y, water}) {
    this.waterSources.push({x, y, water});
    this.computeWater();
  }

  addInfluenceSource({x, y, influence}) {
    this.influenceSources.push({x, y, influence});
    this.computeInfluence();
  }


  ///////////////////////
  // Manipulations
  dig(params) {
    let {x, y, elevation} = params;
    elevation = elevation ?? 0;
    const square = smartGet(this.topo, {x,y});
    if (square?.elevation > 0) {
      smartSet(
        this.topo, {x, y},
        {...square, elevation},
      );
      this.computeWater();
      this.computeInfluence();
    }
  }

  pile({x,y}) {
    const square = smartGet(this.topo, {x,y});
    smartSet(
      this.topo, {x, y},
      {...square, elevation: square.elevation + 1},
    );
    this.computeWater();
    this.computeInfluence();
  }

  irrigate({entities}) {
    for (const entityID in entities) {
      const irrigable = entities[entityID];
      if (!irrigable.isIrrigated) continue;
      irrigable.hydrated = this.getNeighbors(irrigable)
        .some(c => smartGet(this.topo, c).water > 0);
    }
  }


  ///////////////////////
  // Internal State Transition
  computeWater() {
    this.clearWater();
    const visited = {};
    const sources = this.waterSources.map(s => {
      return {
        ...s,
        water: Math.floor(s.water * this.waterSourceMultiplier),
      };
    });
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

  computeInfluence() {
    this.clearInfluence();
    const visited = {};
    const sources = this.influenceSources.map(s => ({...s}));
    const queue = sources.map((s,i) => {
      return {x: s.x, y: s.y, source: i};
    });
    while (queue.length > 0) {
      const {x, y, source} = queue.shift();
      if (sources[source].influence <= 0) continue;

      smartSet(visited, {x,y}, source);
      if (smartGet(this.topo, {x,y}).influence == 0) {
        sources[source].influence--;
      }
      this.union({x,y}, {influence: sources[source].influence});

      this.getNeighbors({x,y}, true /* diagonals */)
        .filter(c => smartGet(this.topo, c)?.elevation > 0)
        .filter(c => {
          return smartGet(visited, c) == null ||
            smartGet(visited, c) != source;
        })
        .forEach(c => queue.push({x: c.x, y: c.y, source}));
    }
  }


}
