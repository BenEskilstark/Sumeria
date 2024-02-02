import {config} from '../config.js';
import {sessionReducer} from './sessionReducer.js';
import {queueReducer} from './queueReducer.js';
import {turnReducer} from './turnReducer.js';
import {gameReducer} from './gameReducer.js';
import {
  smartGet, smartSet, fromKey, toKey,
} from '../utils/arraysAndObjects.js';
import {initState as initStateImpl} from '../state/state.js';

export const initState = initStateImpl;

export const rootReducer = (state, action) => {
  if (state === undefined) state = initState();

  switch (action.type) {
    case 'DIG':
    case 'PILE':
    case 'SPOUT':
    case 'FARM':
    case 'SET_GAME_STATE':
      state = gameReducer(state, action);
      // fallthrough (?)
    // NOTE: any action that should be queued
    //  MUST be handled by this reducer:
    // (actions that should be queued are any that
    //  should affect game state visible to all players)
    case 'END_TURN':
      return turnReducer(state, action);
    case 'QUEUE_ACTION':
    case 'CLEAR_ACTION_QUEUE':
      return queueReducer(state, action);
    case 'LEAVE_SESSION':
    case 'START_SESSION':
      return sessionReducer(state, action);
    default:
      return state;
  }
};
