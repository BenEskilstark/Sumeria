
import {config} from '../config.js';
import {initWater, addDrop} from './rain.js';

export const initGameState = (players, clientID) => {
  const game = {
    /////////////
    // immutable game state
    players, // Array<ClientID>

    width: config.width,
    height: config.height,
    depth: config.depth,


    /////////////
    // local game state
    turnIndex: 0, // index of player whose turn it is
    turn: 0,
    mouseDown: false,
    myTurn: players.indexOf(clientID) == 0,
    actionQueue: [], // Array<Action>


    /////////////
    // global game state that must be shared
    topo: [
      [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
      [9, 2, 1, 1, 1, 1, 1, 1, 1, 9],
      [9, 3, 4, 1, 1, 1, 1, 2, 1, 9],
      [9, 4, 5, 2, 1, 1, 8, 2, 1, 9],
      [9, 5, 6, 3, 2, 1, 8, 2, 1, 9],
      [9, 6, 7, 4, 3, 2, 8, 2, 1, 9],
      [9, 7, 8, 8, 8, 3, 8, 2, 1, 9],
      [9, 8, 9, 9, 9, 4, 8, 2, 2, 9],
      [9, 9, 8, 8, 8, 8, 8, 8, 8, 9],
      [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    ],
    water: initWater(config.depth),
  };

  addDrop(game.water, 1, 7, 9);

  return game;
}
