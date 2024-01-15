import {config} from '../config.js';
import {sessionReducer} from './sessionReducer.js';
import {queueReducer} from './queueReducer.js';
import {turnReducer} from './turnReducer.js';

export const rootReducer = (state, action) => {
  if (state === undefined) state = initState();

  switch (action.type) {
    // NOTE: any action that should be queued MUST be handled by this reducer:
    // (actions that should be queued are any that should affect game state
    // visible to all players)
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



