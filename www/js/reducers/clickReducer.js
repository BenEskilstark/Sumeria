
import {
  smartGet, smartSet, fromKey, toKey,
} from '../utils/arraysAndObjects.js';

export const clickReducer = (state, action) => {
  if (state === undefined) return {};

  switch (action.type) {
    case 'CLICK':
    case 'MOUSE_MOVE': {
      const {x, y} = action;
      smartSet(state.posFromThisClick, {x,y}, true);
    }
  }

  return state;
};

