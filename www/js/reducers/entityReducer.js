import {getEntitiesAtPos} from '../selectors/entitySelectors.js';

export const entityReducer = (state, action) => {
  if (state === undefined) return {};

  switch (action.type) {
    case 'ADD_ENTITY': {
      const {entity} = action;
      state.nextEntityID += 1;
      state.entities[state.nextEntityID] = entity;
      entity.id = state.nextEntityID;
      return state;
    }
    case 'REMOVE_AT_POS': {
      const {x, y} = action;
      const entities = getEntitiesAtPos(state, {x, y});
      for (const entity of entities) {
        delete state.entities[entity.id];
      }
      return state;
    }
    case 'REMOVE_ENTITY': {
      const {entityID} = action;
      delete state.entities[entityID];
      return state;
    }
  }

  return state;
};

