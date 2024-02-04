import StatefulHTML from './StatefulHTML.js';
import {
  initMultiplayerState,
  serializeState,
} from '../state/state.js';
import {makeFns} from '../state/entities.js';
import {jsonDisplay} from '../UI/components/jsonDisplay.js';

const baseHtml = (customHTML) => {
  return `
    <div class="sidebarCard">
      <h3>Action on Click</h3>
      <select name="clickMode" id="clickMode">
        <option value="HUT">Hovel</option>
        <option value="DIG" selected="selected">Dig</option>
        <option value="PILE">Pile</option>
        <option value="FARM">Farm</option>
        <option value="LUMBER_MILL">Lumber Mill</option>
        <option value="MINE">Mine</option>
        <option value="GRANARY">Granary</option>
        <option value="MONUMENT">Monument</option>
        <option value="REMOVE_AT_POS">Delete</option>
        <option value="FOREST">Forest</option>
        <option value="MOUNTAIN">Mountain</option>
        <option value="SPOUT">Water Spout</option>
      </select>
      ${customHTML}
    </div>
  `;
}

export default class ClickActionSelector extends StatefulHTML {
  connectedCallback() {
    this.clickMode = this.getState()?.clickMode;
    this.innerHTML = baseHtml(this.getCustomHtml(this.clickMode));
    this.setSelector();
  }

  onChange(state) {
    if (state.clickMode == this.clickMode) return;

    this.clickMode = state.clickMode;
    this.innerHTML = baseHtml(this.getCustomHtml(this.clickMode));
    this.setSelector();

    switch (this.clickMode) {
      case "SPOUT": {
        const quantity = document.getElementById("quantity-parameter");
        quantity.value = state.waterSpoutQuantity;
        quantity.onchange = () => {
          this.dispatch({waterSpoutQuantity: parseInt(quantity.value)});
        }
      }
    }
  }

  setSelector() {
    const selHTML = document.getElementById("clickMode");
    if (!selHTML) return;
    selHTML.value = this.clickMode;
    selHTML.onchange = () => {
      this.dispatch({clickMode: selHTML.value});
    }
  }

  getCustomHtml(selectedMode) {
    switch (selectedMode) {
      case 'SPOUT':
        return `
          <div style="display:inline-block">
            Quantity:
            <input id="quantity-parameter" style="width: 4em"></input>
          </div>
        `;
      case 'FARM':
      case 'HUT':
      case 'LUMBER_MILL':
      case 'MINE':
      case 'GRANARY':
      case 'MONUMENT':
        return jsonDisplay(makeFns[selectedMode]({x: 0, y: 0}).cost);
    }
    return "";
  }

}


