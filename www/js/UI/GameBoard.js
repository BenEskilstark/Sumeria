import StatefulHTML from './StatefulHTML.js';
import {config} from '../config.js';
import {mouseToGrid} from '../selectors/mouseSelectors.js';
import {fromDrop} from '../state/rain.js';

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
    const {width, height, topo, water} = state;

    const ctx = canvas.getContext("2d");
    const sqSize = canvas.width / width;

    ctx.fillStyle="tan";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // topo
    for (let y = 0; y < topo.length; y++) {
      const row = [];
      for (let x = 0; x < topo[y].length; x++) {
        ctx.fillStyle = config.topoColors[topo[y][x]];
        ctx.fillRect(x * sqSize, y * sqSize, sqSize, sqSize);
      }
    }

    // water
    ctx.fillStyle = "steelblue";
    for (let z = 0; z < water.length; z++) {
      for (const drop in water[z]) {
        const {x, y} = fromDrop(drop);
        ctx.fillRect(x * sqSize, y * sqSize, sqSize, sqSize);
      }
    }

  }


  //////////////////////////////////////////////////////////////////
  // Click Handling
  //////////////////////////////////////////////////////////////////

  canvasClick(ev) {
    const {realtime, clientID} = this.getState();
  }

  canvasMouseDown(ev) {
    this.dispatch({mouseDown: true});
  }

  canvasMouseUp(ev) {
    this.dispatch({mouseDown: false});
  }

  canvasMouseMove(ev) {
    if (!this.getState().mouseDown) return;
  }


}


