export const entityReducer = (state, action) => {
  if (state === undefined) return {};

  switch (action.type) {
    case 'ADD_ENTITY': {
      const {entity} = action;
      state.nextEntityID += 1;
      state.entities[state.nextEntityID] = entity;
      return state;
    }
    case 'REMOVE_ENTITY': {

    }
  }

  return state;
};

