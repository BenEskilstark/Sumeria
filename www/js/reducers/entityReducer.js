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
    case 'REMOVE_ENTITY': {
      const {entityID} = action;
      delete state.entities[entityID];
      return state;
    }
  }

  return state;
};

