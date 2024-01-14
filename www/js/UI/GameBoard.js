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

    this.render(state, document.getElementById("boardCanvas"));
  }

  //////////////////////////////////////////////////////////////////
  // Rendering
  //////////////////////////////////////////////////////////////////

  render(state, canvas) {
    if (!canvas) return;
    const {width, height, depth, topo, water, debug} = state;

    let ctx = canvas.getContext("2d");
    let sqWidth = canvas.width / width;
    let sqHeight = canvas.height / height;

    ctx.fillStyle="tan";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // topo
    for (let y = 0; y < topo.length; y++) {
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

    // side-on canvas
    const sideCanvas = document.getElementById("sideCanvas");
    ctx = sideCanvas.getContext("2d");
    sqWidth = sideCanvas.width / width;
    sqHeight = sideCanvas.height / depth;

    ctx.fillStyle="lightblue";
    ctx.fillRect(0,0,sideCanvas.width,sideCanvas.height);

    let y = height - 1;
    for (let x = 0; x < height; x++) {
      for (let z = 0; z < depth; z++) {
        for (let y = height - 1; y >= 0; y--) {
          if (topo[y][x] >= z) {
            if (y != height - 1) {
              ctx.globalAlpha = (y / 1.5) / (height);
            }
            ctx.fillStyle = config.topoColors[5];
            ctx.fillRect(x * sqWidth, (depth - z - 1) * sqHeight, sqWidth, sqHeight);
            ctx.globalAlpha = 1;
            break;
          } else {
            ctx.fillStyle = "steelblue";
            let flag = false;
            for (const drop in water[z]) {
              const pos = fromDrop(drop);
              if (pos.x != x || pos.y != y) continue;
              ctx.fillRect(x * sqWidth, (depth - z-1) * sqHeight, sqWidth, sqHeight);
              flag = true;
            }
            if (flag) break;
          }
        }
      }
    }
    // ctx.globalAlpha = 1;

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
    this.dispatch({type: mode, x, y, z: state.depth - 1});
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
    if (state.posFromThisClick[toDrop({x, y, z: state.depth - 1})]) return;

    const mode = this.getClickMode();
    this.dispatch({type: mode, x, y, z: state.depth - 1});

  }

  getClickMode() {
    return document.getElementById("clickMode").value;
  }

}


