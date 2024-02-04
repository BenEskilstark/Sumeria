import StatefulHTML from './StatefulHTML.js';
import {
  initMultiplayerState,
  serializeState,
} from '../state/state.js';
import {jsonDisplay} from '../UI/components/jsonDisplay.js';

const baseHtml = (state) => {
  if (!state.playerResources) return "";
  const resources = state.playerResources[state.clientID];
  return `
    <div class="sidebarCard">
      <h3>Resources</h3>
      ${jsonDisplay(resources)}
    </div>
  `;
}

export default class PlayerResources extends StatefulHTML {
  connectedCallback() {
    const state = this.getState();
    this.innerHTML = baseHtml(state);
  }

  onChange(state) {
    this.innerHTML = baseHtml(state);
  }
}


