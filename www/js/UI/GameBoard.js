import StatefulHTML from './StatefulHTML.js';
import {config} from '../config.js';
import {mouseToGrid} from '../selectors/mouseSelectors.js';
import {fromDrop, toDrop} from '../state/rain.js';

export default class GameBoard extends StatefulHTML {
  endTurnInterval = null;

  connectedCallback() {}

  onChange(state) {

    // handling ending your turn
    if (this.endTurnInterval == null && state.myTurn && state.realtime) {
      this.endTurnInterval = setTimeout(() => {
        this.endTurnInterval = null;
        const actions = [...this.getState().actionQueue];
        this.dispatchToServerAndSelf({
          type: 'END_TURN', clientID: state.clientID, actions,
        });
      }, config.turnTime);
    }

    this.render(state, this.querySelector("canvas"));
  }

  //////////////////////////////////////////////////////////////////
  // Rendering
  //////////////////////////////////////////////////////////////////

  render(state, canvas) {
    if (!canvas) return;
    const {width, height, topo, water, debug} = state;

    const ctx = canvas.getContext("2d");
    const sqWidth = canvas.width / width;
    const sqHeight = canvas.height / height;

    ctx.fillStyle="tan";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // topo
    for (let y = 0; y < topo.length; y++) {
      const row = [];
      for (let x = 0; x < topo[y].length; x++) {
        ctx.fillStyle = config.topoColors[topo[y][x]];
        ctx.fillRect(x * sqWidth, y * sqHeight, sqWidth, sqHeight);
      }
    }

    // water
    ctx.fillStyle = "steelblue";
    for (let z = 0; z < water.length; z++) {
      for (const drop in water[z]) {
        const {x, y} = fromDrop(drop);
        ctx.fillRect(x * sqWidth, y * sqHeight, sqWidth, sqHeight);
        if (debug) {
          ctx.font = "16px Arial"; // Adjust the size and font style as needed
          ctx.fillStyle = "red";   // Set the color of the text to red
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          // Draw text
          ctx.fillText(z, x * sqWidth + sqWidth / 2,  y * sqHeight + sqHeight / 2);
          ctx.fillStyle = "steelblue";
        }
      }
    }

  }


  //////////////////////////////////////////////////////////////////
  // Click Handling
  //////////////////////////////////////////////////////////////////

  canvasClick(ev) {
    const state = this.getState();
    // don't do a click on the mouseup after a drag
    if (Object.keys(state.posFromThisClick).length > 0) return;

    const {x, y} = mouseToGrid(state, ev, this.querySelector("canvas"));

    const mode = this.getClickMode();
    this.dispatch({type: mode, x, y, z: config.depth - 1});
  }

  canvasMouseDown(ev) {
    this.dispatch({mouseDown: true});
  }

  canvasMouseUp(ev) {
    // delay this so that it happens after the canvasClick event
    setTimeout(() => this.dispatch({mouseDown: false, posFromThisClick: {}}), 0);
  }

  canvasMouseMove(ev) {
    const state = this.getState();
    if (!state.mouseDown) return;

    const {x, y} = mouseToGrid(state, ev, this.querySelector("canvas"));
    if (state.posFromThisClick[toDrop({x, y, z: config.depth - 1})]) return;

    const mode = this.getClickMode();
    this.dispatch({type: mode, x, y, z: config.depth - 1});

  }

  getClickMode() {
    return document.getElementById("clickMode").value;
  }

}


