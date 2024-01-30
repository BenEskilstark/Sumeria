export const clickReducer = (state, action) => {
  if (state === undefined) return {};

  switch (action.type) {
    case 'MOUSE_MOVE': {
      const {x, y} = action;
      smartSet(state.posFromThisClick, {x,y}, true);
    }
  }

  return state;
};

