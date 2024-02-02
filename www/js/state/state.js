
import {config} from '../config.js';
import {newDuration} from '../selectors/durationSelectors.js';
import {Topo} from '../state/topo.js';

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

export const initGameState = (players, clientID) => {
  const game = {
    /////////////
    // global game state that must be shared
    ...initMultiplayerState(players),


    /////////////
    // local game state
    mouseDown: false,
    clickMode: "DIG", // | "PILE" | "SPOUT" | "FARM"

    waterSpoutQuantity: config.waterSpoutQuantity,

    myTurn: players.indexOf(clientID) == 0, // TODO == turnIndex
    actionQueue: [], // Array<Action>

    curTurnRate: 24, // total number of turns taken per second
    avgTurnRate: 24,
    startTime: Date.now(),
    lastTurnEndTime: Date.now(), // the time when my last turn ended

    posFromThisClick: {}, // SmartMap<Coord, bool>
    debug: true,

  };

  return game;
}

export const initMultiplayerState = (players) => {
  return {
    width: config.width,
    height: config.height,

    isRealtime: config.isRealtime,
    players: players ?? [], // Array<ClientID>

    turn: 0,
    turnIndex: 0, // index of player whose turn it is

    season: "NORMAL", // | "DRY" | "WET"
    nextSeason: "NORMAL",
    nextEntityID: 0,
    entities: {}, // {[EntityID] => Object}
    topo: new Topo(config.width, config.height),
  }
}

export const serializeState = (state) => {
  const json = initMultiplayerState();
  for (const key in json) {
    json[key] = state[key];
  }
  return JSON.stringify(json);
}
