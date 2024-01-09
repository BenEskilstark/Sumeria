import StatefulHTML from './StatefulHTML.js';
import {encodePos} from '../utils/positions.js';
import {config} from '../config.js';
import {
  getPieceGroupIndex, getNumLiberties,
} from '../selectors/goSelectors.js';
import {mouseToGrid} from '../selectors/mouseSelectors.js';
import {dropPiece} from '../thunks/thunks.js';

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
    const {width, height} = state;

    const ctx = canvas.getContext("2d");
    const sqSize = canvas.width / width;

    ctx.fillStyle="tan";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // grid lines
    ctx.beginPath();
    for (let x = 1; x < width; x++) {
      ctx.strokeStyle = "black";
      ctx.moveTo(x * sqSize, sqSize);
      ctx.lineTo(x * sqSize, canvas.height - sqSize);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let y = 1; y < height; y++) {
      ctx.strokeStyle = "black";
      ctx.moveTo(sqSize, y * sqSize);
      ctx.lineTo(canvas.width - sqSize, y * sqSize);
    }
    ctx.stroke();

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


