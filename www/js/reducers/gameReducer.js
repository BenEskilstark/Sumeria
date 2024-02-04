
import {config} from '../config.js';
import {
  smartGet, smartSet, fromKey, toKey,
} from '../utils/arraysAndObjects.js';
import {Topo} from '../state/topo.js';
import {
  makeFarm, makeForest, makeMountain,
  makeHut, makeGranary, makeMonument,
  makeLumberMill, makeMine,
} from '../state/entities.js';
import {entityReducer} from './entityReducer.js';
import {clickReducer} from './clickReducer.js';
import {getEntitiesAtPos} from '../selectors/entitySelectors.js';
import {
  canAfford,
} from '../selectors/resourceSelectors.js';
import {spendResources, gainResources} from './resourceReducer.js';

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
      const {x, y} = action;
      const cost = {labor: 1};
      if (getEntitiesAtPos(state, action).length > 0) return state;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;
      if (!canAfford(state, {cost})) return state;

      state = clickReducer(state, {...action, type: 'CLICK'});
      state.topo.dig(action);
      state.topo.irrigate(state);

      state = spendResources(state, {cost});
      state = gainResources(state, {benefit: {clay: 12}});

      return state;
    }
    case 'PILE': {
      const {x, y} = action;
      const cost = {clay: 12, labor: 1};
      if (smartGet(state.topo.topo, {x, y})?.elevation != 0) return state;
      if (!canAfford(state, {cost})) return state;

      state = clickReducer(state, {...action, type: 'CLICK'});
      state.topo.pile(action);
      state.topo.irrigate(state);

      state = spendResources(state, {cost});

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

      const entity = makeFarm(action);
      if (!canAfford(state, entity)) return state;
      state = spendResources(state, entity);

      state = clickReducer(state, {...action, type: 'CLICK'});
      state = entityReducer(state, {type: 'ADD_ENTITY', entity});
      state.topo.dig({...action, elevation: 0.5});
      state.topo.irrigate(state);
      return state;
    }
    case 'HUT': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;
      if (getEntitiesAtPos(state, action).length > 0) return state;

      const entity = makeHut(action);
      if (!canAfford(state, entity)) return state;
      state = spendResources(state, entity);
      state = gainResources(state, entity);

      state = clickReducer(state, {...action, type: 'CLICK'});
      state = entityReducer(state, {type: 'ADD_ENTITY', entity});
      state.topo.addInfluenceSource({x, y, influence: entity.influence});

      return state;
    }
    case 'GRANARY': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;
      if (getEntitiesAtPos(state, action).length > 0) return state;

      const entity = makeGranary(action);
      if (!canAfford(state, entity)) return state;
      state = spendResources(state, entity);

      state = clickReducer(state, {...action, type: 'CLICK'});
      state = entityReducer(state, {type: 'ADD_ENTITY', entity});
      state.topo.addInfluenceSource({x, y, influence: entity.influence});
      return state;
    }
    case 'MONUMENT': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;
      if (getEntitiesAtPos(state, action).length > 0) return state;

      const entity = makeMonument(action);
      if (!canAfford(state, entity)) return state;
      state = spendResources(state, entity);

      state = clickReducer(state, {...action, type: 'CLICK'});
      state = entityReducer(state, {type: 'ADD_ENTITY', entity});
      state.topo.addInfluenceSource({x, y, influence: entity.influence});
      return state;
    }
    case 'LUMBER_MILL': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;
      if (getEntitiesAtPos(state, action).length > 0) return state;

      const entity = makeLumberMill(action);
      if (!canAfford(state, entity)) return state;
      state = spendResources(state, entity);

      state = clickReducer(state, {...action, type: 'CLICK'});
      state = entityReducer(state, {type: 'ADD_ENTITY', entity});
      state.topo.addInfluenceSource({x, y, influence: entity.influence});
      return state;
    }
    case 'MINE': {
      const {x, y} = action;
      if (smartGet(state.topo.topo, {x, y})?.elevation != 1) return state;
      if (getEntitiesAtPos(state, action).length > 0) return state;

      const entity = makeMine(action);
      if (!canAfford(state, entity)) return state;
      state = spendResources(state, entity);

      state = clickReducer(state, {...action, type: 'CLICK'});
      state = entityReducer(state, {type: 'ADD_ENTITY', entity});
      state.topo.addInfluenceSource({x, y, influence: entity.influence});
      return state;
    }
  }

  return state;
};



