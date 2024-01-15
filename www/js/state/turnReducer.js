
import {msToTurns, newDuration} from '../selectors/durationSelectors.js';
import {config} from '../config.js';

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

      // update entities with a duration:
      for (const entityID in state.entities) {
        if (!entity.duration) continue;
        if (entity.duration.endTurn == state.turn) {
          // Do Stuff
        }
      }

      // update rest of game state here:

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
