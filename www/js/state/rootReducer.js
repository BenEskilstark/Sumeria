import {config} from '../config.js';
import {sessionReducer} from './sessionReducer.js';
import {queueReducer} from './queueReducer.js';
import {turnReducer} from './turnReducer.js';
import {
  smartGet, smartSet, fromKey, toKey,
} from '../utils/arraysAndObjects.js';
import {Topo} from '../state/topo.js';
import {makeFarm} from '../state/entities.js';

export const rootReducer = (state, action) => {
  if (state === undefined) state = initState();

  switch (action.type) {
    case 'DIG': {
      const {x, y} = action;
      state.topo.dig(action);
      smartSet(state.posFromThisClick, {x,y}, true);
      state.topo.irrigate(state);
      return {...state};
    }
    case 'PILE': {
      const {x, y} = action;
      state.topo.pile(action);
      smartSet(state.posFromThisClick, {x,y}, true);
      state.topo.irrigate(state);
      return {...state};
    }
    case 'SPOUT': {
      const {x, y} = action;
      state.topo.addWaterSource({x, y, water: config.waterSpout});
      smartSet(state.posFromThisClick, {x,y}, true);
      state.topo.irrigate(state);
      return {...state};
    }
    case 'FARM': {
      const nextState = {
        ...state,
        nextEntityID: state.nextEntityID + 1,
        entities: {
          ...state.entities,
          [state.nextEntityID]: makeFarm(action),
        },
      };
      nextState.topo.irrigate(nextState);
      return nextState;
    }
    // NOTE: any action that should be queued MUST be handled by this reducer:
    // (actions that should be queued are any that should affect game state
    // visible to all players)
    case 'END_TURN':
      return turnReducer(state, action);
    case 'SET_GAME_STATE':
      return {
        ...state,
        ...action.level,
        topo: state.topo.fromJSON(action.level),
      };
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

export const initState = () => {
  return {
    screen: 'LOBBY', // | 'GAME'
    sessions: {}, // sessionID -> {id: SessionID, clients: Array<ClientID>, started: Bool}
    sessionID: null, // session I am in
    numConnectedClients: 0,
    clientID: null,
    realtime: config.isRealtime,
  };
}



