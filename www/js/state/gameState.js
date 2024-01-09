
import {config} from '../config.js';
import {initWater, addDrop} from './rain.js';
import {initTopo} from './topo.js';

export const initGameState = (players, clientID) => {
  return {
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

    posFromThisClick: {}, // Set<DropStr>

    /////////////
    // global game state that must be shared
    topo: initTopo(config.width, config.height, config.depth / 2),
    water: initWater(config.depth),
    spouts: [], // Array<{x, y, z}>
  };
}
