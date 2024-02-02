import {config} from '../config.js';

export const makeFarm = ({x, y}) => {
  return {
    type: 'FARM',
    x, y,
    isIrrigated: true,
    hydrated: false,
  };
};


export const makeForest = ({x, y}) => {
  return {
    type: 'FOREST',
    x, y,
    turnsToGrowth: config.forestGrowthTurns,
  };
}


export const makeMountain = ({x, y}) => {
  return {
    type: 'MOUNTAIN',
    x, y,
  };
}


export const makeHut = ({x, y}) => {
  return {
    type: 'HUT',
    x, y,
    isBuilding: true,
    capacity: 5,
    influence: 10,
  };
}


export const makeGranary = ({x, y}) => {
  return {
    type: 'GRANARY',
    x, y,
    isBuilding: true,
    capacity: 30,
    occupied: 12,
    influence: 26,
  };
}


export const makeMonument = ({x, y}) => {
  return {
    type: 'MONUMENT',
    x, y,
    isBuilding: true,
    influence: 46,
  };
}

