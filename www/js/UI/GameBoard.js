import StatefulHTML from './StatefulHTML.js';
import {smartGet, smartSet} from '../utils/arraysAndObjects.js';
import {config} from '../config.js';
import {mouseToGrid} from '../selectors/mouseSelectors.js';

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
    const {width, height, myTurn, realtime} = state;

    const ctx = canvas.getContext("2d");
    const sqWidth = canvas.width / width;
    const sqHeight = canvas.height / height;

    ctx.fillStyle="steelblue";
    ctx.fillRect(0,0,canvas.width,canvas.height);



    if (!myTurn && !realtime) {
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0,0,canvas.width,canvas.height);
    }
  }


  //////////////////////////////////////////////////////////////////
  // Click Handling
  //////////////////////////////////////////////////////////////////

  canvasClick(ev) {
    const {realtime, clientID} = this.getState();

    if (!realtime) {
      this.dispatchToServerAndSelf({type: 'END_TURN', clientID});
    } // else turn end is handled already
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


