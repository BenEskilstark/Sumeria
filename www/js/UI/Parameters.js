import StatefulHTML from './StatefulHTML.js';
import {
  initMultiplayerState,
  serializeState,
} from '../state/state.js';

const baseHtml = () => {
  return `
    <div class="sidebarCard">
      <h3>Simulation Parameters</h3>
      Width:
      <input id="width-parameter" style="width: 4em"></input>
      Height:
      <input id="height-parameter" style="width: 4em"></input>
      <button
        onclick="this.closest('level-parameters').setParams()"
      >Set Parameters</button>
    </div>
  `;
}

export default class Parameters extends StatefulHTML {
  connectedCallback() {
    this.innerHTML = baseHtml();
  }

  onChange(state) {
    const doc = document;
    const widthElem = doc.getElementById("width-parameter");
    const heightElem = doc.getElementById("height-parameter");

    widthElem.value = state.width;
    heightElem.value = state.height;
  }

  setParams() {
    const doc = document;
    const width = parseInt(doc.getElementById("width-parameter").value);
    const height = parseInt(doc.getElementById("height-parameter").value);

    const level = {
      ...JSON.parse(serializeState(this.getState())),
      width, height,
    };

    this.dispatch({type: 'SET_GAME_STATE', level});

  }

}



