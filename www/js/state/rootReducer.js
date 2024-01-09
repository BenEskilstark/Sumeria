import {config} from '../config.js';
import {sessionReducer} from './sessionReducer.js';

export const rootReducer = (state, action) => {
  if (state === undefined) state = initState();

  switch (action.type) {
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
  };
}



