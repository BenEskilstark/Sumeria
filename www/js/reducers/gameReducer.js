
import {config} from '../config.js';
import {
  smartGet, smartSet, fromKey, toKey,
} from '../utils/arraysAndObjects.js';
import {Topo} from '../state/topo.js';
import {
  makeFarm, makeForest, makeMountain,
  makeHut, makeGranary, makeMonument,
} from '../state/entities.js';
import {entityReducer} from './entityReducer.js';
import {clickReducer} from './clickReducer.js';
import {getEntitiesAtPos} from '../selectors/entitySelectors.js';

export const gameReducer = (state, action) => {
  if (state === undefined) return {};

  switch (action.type) {
    case 'SET_GAME_STATE':
      // TODO: this should probably call initMultiplayerState
      state = {
        ...state,
        ...action.level,
        topo: state.topo.fromJSON(action.level),
        players: state.players, // HACK
        clientID: state.clientID, // HACK
      };
      return state;
    case 'DIG': {
      if (getEntitiesAtPos(state, action).length > 0) return state;

      state = clickReducer(state, {...action, type: 'CLICK'});
      state.topo.dig(action);
      state.topo.irrigate(state);
      return {...state};
    }
    case 'PILE': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 0) return state;

      state = clickReducer(state, {...action, type: 'CLICK'});
      state.topo.pile(action);
      state.topo.irrigate(state);
      return {...state};
    }
    case 'SPOUT': {
      const {x, y} = action;
      if (getEntitiesAtPos(state, action).length > 0) return state;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 0) return state;

      state = clickReducer(state, {...action, type: 'CLICK'});
      state.topo.addWaterSource({x, y, water: state.waterSpoutQuantity});
      state.topo.irrigate(state);
      return {...state};
    }
    case 'FOREST': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;

      state = clickReducer(state, {...action, type: 'CLICK'});
      state = entityReducer(state, {
        type: 'ADD_ENTITY', entity: makeForest(action),
      });
      return state;
    }
    case 'MOUNTAIN': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;

      state = clickReducer(state, {...action, type: 'CLICK'});
      state = entityReducer(state, {
        type: 'ADD_ENTITY', entity: makeMountain(action),
      });
      return state;
    }
    case 'FARM': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;
      if (getEntitiesAtPos(state, action).length > 0) return state;

      state = clickReducer(state, {...action, type: 'CLICK'});
      state = entityReducer(state, {
        type: 'ADD_ENTITY', entity: makeFarm(action),
      });
      state.topo.dig({...action, elevation: 0.5});
      state.topo.irrigate(state);
      return state;
    }
    case 'HUT': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;
      if (getEntitiesAtPos(state, action).length > 0) return state;

      state = clickReducer(state, {...action, type: 'CLICK'});
      const entity = makeHut(action);
      state = entityReducer(state, {type: 'ADD_ENTITY', entity});
      state.topo.addInfluenceSource({x, y, influence: entity.influence});
      return state;
    }
    case 'GRANARY': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;
      if (getEntitiesAtPos(state, action).length > 0) return state;

      state = clickReducer(state, {...action, type: 'CLICK'});
      const entity = makeGranary(action);
      state = entityReducer(state, {type: 'ADD_ENTITY', entity});
      state.topo.addInfluenceSource({x, y, influence: entity.influence});
      return state;
    }
    case 'MONUMENT': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;
      if (getEntitiesAtPos(state, action).length > 0) return state;

      state = clickReducer(state, {...action, type: 'CLICK'});
      const entity = makeMonument(action);
      state = entityReducer(state, {type: 'ADD_ENTITY', entity});
      state.topo.addInfluenceSource({x, y, influence: entity.influence});
      return state;
    }
  }

  return state;
};

