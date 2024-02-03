import StatefulHTML from './StatefulHTML.js';
import {
  initMultiplayerState,
  serializeState,
} from '../state/state.js';

const baseHtml = (state) => {
  return `
    <div class="sidebarCard">
      Turn: ${state.turn}
      <button
        onclick="this.closest('turn-controls').endTurn()"
      >End Turn</button>
      <div>
        Season: ${state.season}
        Next: ${state.nextSeason}
      </div>
    </div>
  `;
}

export default class TurnControls extends StatefulHTML {
  connectedCallback() {
    const state = this.getState();
    this.turn = state.turn;
    this.innerHTML = baseHtml(state);
  }

  onChange(state) {
    if (this.turn == state.turn) return;

    this.turn = state.turn;

    this.innerHTML = baseHtml(state);
  }

  endTurn() {
    const state = this.getState();
    const actions = [...state.actionQueue];
    this.dispatchToServerAndSelf({
      type: 'END_TURN', clientID: state.clientID, actions,
    });
  }

}


