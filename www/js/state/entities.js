import {config} from '../config.js';
import {oneOf, weightedOneOf} from '../utils/stochastic.js';


export const makeForest = ({x, y}) => {
  return {
    type: 'FOREST',
    x, y,
    turnsToGrowth: oneOf(config.forestGrowthTurns),
    blocksInfluence: true,

    resources: {
      wood: 12,
    },
  };
}


export const makeMountain = ({x, y}) => {
  return {
    type: 'MOUNTAIN',
    x, y,
    blocksInfluence: true,

    resources: {
      stone: 12,
    },
  };
}


export const makeFarm = ({x, y}) => {
  return {
    type: 'FARM',
    x, y,
    isIrrigated: true,
    hydrated: false,
    influence: 1,

    isBuilding: true,
    benefit: {},
    cost: {
      labor: 1,
    },
    mannedBenefit: {
      food: 6,
    },
  };
};


export const makeHut = ({x, y}) => {
  return {
    type: 'HUT',
    x, y,
    influence: 10,

    isBuilding: true,
    benefit: {
      population: 6,
    },
    cost: {
      labor: 6,
      clay: 6,
    },
  };
}


export const makeLumberMill = ({x, y}) => {
  return {
    type: 'LUMBER_MILL',
    x, y,
    influence: 10,

    isBuilding: true,
    benefit: {},
    cost: {
      labor: 12,
      clay: 12,
    },
    mannedBenefit: {
      wood: 12,
    },
  };
}


export const makeMine = ({x, y}) => {
  return {
    type: 'MINE',
    x, y,
    influence: 10,

    isBuilding: true,
    benefit: {},
    cost: {
      labor: 12,
      clay: 24,
      wood: 6,
    },
    mannedBenefit: {
      stone: 3,
    },
  };
}


export const makeGranary = ({x, y}) => {
  return {
    type: 'GRANARY',
    x, y,
    influence: 26,

    isBuilding: true,
    benefit: {},
    cost: {
      labor: 12,
      clay: 12,
      wood: 6,
    },
  };
}


export const makeMonument = ({x, y}) => {
  return {
    type: 'MONUMENT',
    x, y,
    influence: 46,

    isBuilding: true,
    benefit: {},
    cost: {
      labor: 24,
      clay: 12,
      stone: 12,
    },
  };
}

