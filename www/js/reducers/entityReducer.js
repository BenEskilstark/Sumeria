export const entityReducer = (state, action) => {
  if (state === undefined) return {};

  switch (action.type) {
    case 'ADD_ENTITY': {
      const {entity} = action;
      return {
        ...state,
        nextEntityID: state.nextEntityID + 1,
        entities: {
          ...state.entities,
          [state.nextEntityID]: entity,
        },
      };
    }
    case 'REMOVE_ENTITY': {

    }
  }

  return state;
};

