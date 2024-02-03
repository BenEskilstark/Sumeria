
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

export const initGameState = (players, clientID, level) => {
  const game = {
    /////////////
    // global game state that must be shared
    ...initMultiplayerState(players, clientID, level),


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

export const initMultiplayerState = (players, clientID, level) => {
  players = players ?? []; // Array<ClientID>
  clientID = clientID ?? -1;
  let multState = null;
  if (level != null) {
    // NOTE: also done in reducers/gameReducer
    level.topo = new Topo(level.width, level.height).fromJSON(level);
    level.players = players; // Array<ClientID>
    level.clientID = clientID;
    if (!level.playerResources) level.playerResources = {};
    multState = level;
  } else {
    multState = {
      width: config.width,
      height: config.height,

      isRealtime: config.isRealtime,
      players,
      clientID,

      turn: 0,
      turnIndex: 0, // index of player whose turn it is

      season: "NORMAL", // | "DRY" | "WET"
      nextSeason: "NORMAL",
      nextEntityID: 0,
      entities: {}, // {[EntityID] => Object}
      topo: new Topo(config.width, config.height),
      playerResources: {},
    };
  }

  for (const id of players) {
    multState.playerResources[id] = {
      population: 0,
      clay: 6,
      food: 12,
      wood: 0,
      stone: 0,
    };
  }

  return multState;
}

export const serializeState = (state) => {
  const json = initMultiplayerState();
  for (const key in json) {
    json[key] = state[key];
  }
  return JSON.stringify(json);
}
