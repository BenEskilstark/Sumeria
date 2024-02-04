
import {msToTurns, newDuration} from '../selectors/durationSelectors.js';
import {config} from '../config.js';
import {
  getEntitiesAtPos, getEntitiesByType, getNeighborEntities,
} from '../selectors/entitySelectors.js';
import {entityReducer} from './entityReducer.js';
import {spendResources, gainResources} from './resourceReducer.js';
import {
  makeFarm, makeForest,
} from '../state/entities.js';
import {oneOf, weightedOneOf} from '../utils/stochastic.js';
import {
  smartGet, smartSet, fromKey, toKey,
} from '../utils/arraysAndObjects.js';
import {canAfford} from '../selectors/resourceSelectors.js';

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
      updateResources(state);


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
          entityReducer(state, {
            type: 'ADD_ENTITY', entity: makeForest(pos),
          });
        }
      }
      forest.turnsToGrowth = oneOf(config.forestGrowthTurns);
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


const updateResources = (state) => {
  for (const clientID of state.players) {
    const resources = state.playerResources[clientID];
    let cost = {};

    // assign labor to food and produce it
    let mannableFarms = getEntitiesByType(state, 'FARM')
      .filter(e => state.topo.withinInfluence(e))
      .filter(farm => farm.hydrated);
    let labor = Math.min(mannableFarms.length, resources.labor);
    if (labor > 0) {
      spendResources(state, {cost: {labor}}, clientID);
      let benefit = {...mannableFarms[0].mannedBenefit};
      for (const key in benefit) {
        benefit[key] *= labor;
      }
      gainResources(state, {benefit}, clientID);
    }

    // assign labor to lumber and produce it
    let mannableLumberMills = getEntitiesByType(state, 'LUMBER_MILL')
      .filter(e => state.topo.withinInfluence(e))
      .filter(m => getNeighborEntities(state, m).some(e => e.type == "FOREST"));
    labor = Math.min(mannableLumberMills.length, resources.labor);
    if (labor > 0) {
      // get resources out of the forest:
      let treesChopped = 0;
      for (let i = 0; i < mannableLumberMills.length; i++) {
        if (i > labor) break;
        const mill = mannableLumberMills[i];
        const forest = getNeighborEntities(state, mill).find(e => e.type == "FOREST");
        if (!forest) continue;
        forest.resources.wood -= mill.mannedBenefit.wood;
        if (forest.resources.wood <= 0) {
          entityReducer(state, {type: 'REMOVE_ENTITY', entityID: forest.id});
        }
        treesChopped++;
      }
      labor = treesChopped;

      // then update your resources
      spendResources(state, {cost: {labor}}, clientID);
      let benefit = {...mannableLumberMills[0].mannedBenefit};
      for (const key in benefit) {
        benefit[key] *= labor;
      }
      gainResources(state, {benefit}, clientID);
    }

    let mannableMines = getEntitiesByType(state, 'MINE')
      .filter(e => state.topo.withinInfluence(e))
      .filter(m => getNeighborEntities(state, m).some(e => e.type == "MOUNTAIN"));
    labor = Math.min(mannableMines.length, resources.labor);
    if (labor > 0) {
      // get resources out of the mine:
      let mtnsMined = 0;
      for (let i = 0; i < mannableMines.length; i++) {
        if (i > labor) break;
        const mine = mannableMines[i];
        const mountain = getNeighborEntities(state, mine)
          .find(e => e.type == "MOUNTAIN");
        if (!mountain) continue;
        mountain.resources.stone -= mine.mannedBenefit.stone;
        if (mountain.resources.stone <= 0) {
          entityReducer(state, {type: 'REMOVE_ENTITY', entityID: mountain.id});
        }
        mtnsMined++;
      }
      labor = mtnsMined;

      // then update your resources
      spendResources(state, {cost: {labor}}, clientID);
      let benefit = {...mannableMines[0].mannedBenefit};
      for (const key in benefit) {
        benefit[key] *= labor;
      }
      gainResources(state, {benefit}, clientID);
    }

    // assign labor to mines and produce it

    // feed population
    cost = {food: resources.population};
    if (!canAfford(state, {cost})) {
      cost.population = resources.population - resources.food;
      cost.food = resources.food;
    }
    spendResources(state, {cost}, clientID);

    // turn population into labor
    gainResources(state,
      {benefit: {labor: resources.population - resources.labor}},
      clientID,
    );
  }
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
