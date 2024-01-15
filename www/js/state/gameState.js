
import {config} from '../config.js';
import {newDuration} from '../selectors/durationSelectors.js';

export const initGameState = (players, clientID) => {
  const game = {
    /////////////
    // immutable game state
    players, // Array<ClientID>

    width: config.boardSize,
    height: config.boardSize,


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


    /////////////
    // global game state that must be shared
    nextEntityID: 0,
    entities: {}, // {[EntityID] => Object}

  };



  return game;
}
