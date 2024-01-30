
import {config} from '../config.js';
import {
  smartGet, smartSet, fromKey, toKey,
} from '../utils/arraysAndObjects.js';
import {Topo} from '../state/topo.js';
import {makeFarm} from '../state/entities.js';
import {entityReducer} from './entityReducer.js';
import {clickReducer} from './clickReducer.js';

export const gameReducer = (state, action) => {
  if (state === undefined) return {};

  switch (action.type) {
    case 'SET_GAME_STATE':
      return {
        ...state,
        ...action.level,
        topo: state.topo.fromJSON(action.level),
      };
    case 'DIG': {
      state = clickReducer(state, {...action, type: 'CLICK'});
      state.topo.dig(action);
      state.topo.irrigate(state);
      return {...state};
    }
    case 'PILE': {
      state = clickReducer(state, {...action, type: 'CLICK'});
      state.topo.pile(action);
      state.topo.irrigate(state);
      return {...state};
    }
    case 'SPOUT': {
      const {x, y} = action;
      state = clickReducer(state, {...action, type: 'CLICK'});
      state.topo.addWaterSource({x, y, water: config.waterSpout});
      state.topo.irrigate(state);
      return {...state};
    }
    case 'FARM': {
      state = clickReducer(state, {...action, type: 'CLICK'});
      state = entityReducer(state, {
        type: 'ADD_ENTITY', entity: makeFarm(action),
      });
      state.topo.dig({...action, elevation: 0.5});
      state.topo.irrigate(state);
      return state;
    }
  }

  return state;
};

