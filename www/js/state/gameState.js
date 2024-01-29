
import {config} from '../config.js';
import {newDuration} from '../selectors/durationSelectors.js';
import {Topo} from '../state/topo.js';

export const initGameState = (players, clientID) => {
  const game = {
    /////////////
    // immutable game state
    players, // Array<ClientID>

    width: config.width,
    height: config.height,
    isRealtime: config.isRealtime,


    /////////////
    // local game state
    turnIndex: 0, // index of player whose turn it is
    turn: 0,

    mouseDown: false,

    myTurn: players.indexOf(clientID) == 0,
    actionQueue: [], // Array<Action>

    curTurnRate: 24, // total number of turns taken per second
    avgTurnRate: 24,
    startTime: Date.now(),
    lastTurnEndTime: Date.now(), // the time when my last turn ended

    posFromThisClick: {}, // SmartMap<Coord, bool>
    debug: true,


    /////////////
    // global game state that must be shared
    nextEntityID: 0,
    entities: {}, // {[EntityID] => Object}

    topo: new Topo(config.width, config.height),
  };



  return game;
}
