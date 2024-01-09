import {config} from '../config.js';
import {sessionReducer} from './sessionReducer.js';
import {flowWater, addDrop, toDrop} from './rain.js';
import {dig, pile} from './topo.js';

export const rootReducer = (state, action) => {
  if (state === undefined) state = initState();

  switch (action.type) {
    case 'END_TURN': {
      for (const spout of state.spouts) {
        const {x, y, z} = spout;
        addDrop(state.water, x, y, z);
      }
      return {...state, water: flowWater(state.water, state.topo)};
    }
    case 'DIG': {
      dig(state.topo, action);
      state.posFromThisClick[toDrop(action)] = true;
      // console.log(state.posFromThisClick);
      return {...state};
    }
    case 'PILE': {
      pile(state.topo, action, state.depth - 1);
      state.posFromThisClick[toDrop(action)] = true;
      return {...state};
    }
    case 'DROP': {
      const {x, z, y} = action;
      addDrop(state.water, x, y, z);
      state.posFromThisClick[toDrop(action)] = true;
      return {...state};
    }
    case 'SPOUT': {
      const {x, z, y} = action;
      state.posFromThisClick[toDrop(action)] = true;
      return {...state, spouts: [...state.spouts, {x, y, z}]};
    }
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
    clientID: 1,

    realtime: true,
  };
}



