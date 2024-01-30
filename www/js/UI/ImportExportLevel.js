import StatefulHTML from './StatefulHTML.js';
import {oneOf, randomIn, normalIn, weightedOneOf} from '../utils/stochastic.js';
import {config} from '../config.js';
import {smartGet, smartSet} from '../utils/arraysAndObjects.js';
import {
  initMultiplayerState,
  serializeState,
} from '../state/state.js';

/**
 * Use like:
 *
 *
 */

const importExport = () => {
  return `
    <div class="sidebarCard">
      <h3>Import/Export</h3>
      <button onclick="this.closest('import-export-level').importLevel()">
         Import
      </button>
      <button onclick="this.closest('import-export-level').exportLevel()">
         Export
      </button>
      <input type="text" id="importExport" style="width:100%">
      </input>
    </div>
  `;
}
export default class ImportExportLevel extends StatefulHTML {

  connectedCallback() {
    this.innerHTML = importExport();
    this.exportLevel();
  }

  exportLevel() {
    const state = this.getState();
    const textfield = document.getElementById("importExport");
    textfield.value = serializeState(state);
  }

  importLevel() {
    const textfield = document.getElementById("importExport");
    const level = JSON.parse(textfield.value);
    this.dispatch({type: 'SET_GAME_STATE', level});
  }

}
