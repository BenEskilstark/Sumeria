
import {msToTurns, newDuration} from '../selectors/durationSelectors.js';
import {config} from '../config.js';
import {getEntitiesAtPos} from '../selectors/entitySelectors.js';
import {entityReducer} from './entityReducer.js';
import {
  makeFarm, makeForest,
} from '../state/entities.js';
import {oneOf, weightedOneOf} from '../utils/stochastic.js';
import {
  smartGet, smartSet, fromKey, toKey,
} from '../utils/arraysAndObjects.js';

//////////////
// NOTE: any action that should be queued MUST be handled by this reducer:
// (actions that should be queued are any that should affect game state
// visible to all players)
export const turnReducer = (state, action) => {
  switch (action.type) {
    case 'END_TURN': {
      let {clientID, actions} = action;
      if (!actions) actions = [];

      // first recursively evaluate all actions in the queue
      if (clientID == state.clientID) state.actionQueue = [];
      actions.forEach(a => state = turnReducer(state, a));


      // update rest of game state here:
      // updateDurations(state);
      growForests(state);
      updateSeasons(state);


      // compute water again
      state.topo.computeWater();
      state.topo.irrigate(state);
      state.topo.computeInfluence();

      const justEndedMyTurn = state.myTurn; // TODO: not sure I want this
      const turnIndex = (state.turnIndex + 1) % state.players.length;
      return {
        ...state,
        turn: state.turn + 1,
        myTurn: state.players[turnIndex] == state.clientID,
        turnIndex,
        // if I just ended my turn then record the time
        curTurnRate: justEndedMyTurn
          ? 1000 / (Date.now() - state.lastTurnEndTime + 1) * state.players.length
          : state.curTurnRate,
        avgTurnRate: 1000 / ((Date.now() - state.startTime + 1) / state.turn),
        lastTurnEndTime: justEndedMyTurn ? Date.now() : state.lastTurnEndTime,
      };
    }
  }
  return state;
}


const growForests = (state) => {
  for (const entityID in state.entities) {
    const forest = state.entities[entityID];
    if (forest.type != 'FOREST') continue;

    if (forest.turnsToGrowth > 0) forest.turnsToGrowth--;
    if (forest.turnsToGrowth == 0) {
      const validCoords = state.topo.getNeighbors(forest);
        // filtering later produces more organic-looking growth
        // .filter(c => smartGet(state.topo.topo, c)?.elevation == 1)
        // .filter(c => getEntitiesAtPos(state, c).length == 0);
      if (validCoords.length > 0) {
        const pos = oneOf(validCoords);
        if (
          smartGet(state.topo.topo, pos)?.elevation == 1 &&
          getEntitiesAtPos(state, pos).length == 0
        ) {
          state = entityReducer(state, {
            type: 'ADD_ENTITY', entity: makeForest(pos),
          });
        }
      }
      forest.turnsToGrowth = config.forestGrowthTurns;
    }
  }
  return state;
}


const updateSeasons = (state) => {
  state.season = state.nextSeason;
  state.topo.waterSourceMultiplier = config.seasonMultipliers[state.season];
  const probs = config.seasonProbabilities[state.season];
  state.nextSeason = weightedOneOf(config.seasons, probs);
}


const updateDurations = (state) => {
  for (const entityID in state.entities) {
    const entity = state.entities[entityID];
    if (!entity.duration) continue;
    if (entity.duration.endTurn == state.turn) {
      // Do Stuff
    }
  }
}
