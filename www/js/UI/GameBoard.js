import StatefulHTML from './StatefulHTML.js';
import {
  smartGet, smartSet, fromKey, toKey,
} from '../utils/arraysAndObjects.js';
import {config} from '../config.js';
import {mouseToGrid} from '../selectors/mouseSelectors.js';

export default class GameBoard extends StatefulHTML {
  endTurnInterval = null;

  connectedCallback() {}

  onChange(state) {

    // handling ending your turn
    if (this.endTurnInterval == null && state.myTurn && state.isRealtime) {
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
    const {
      width, height, myTurn, isRealtime, debug,
      topo, entities,
    } = state;
    if (!topo) return;

    const ctx = canvas.getContext("2d");
    const sqWidth = canvas.width / width;
    const sqHeight = canvas.height / height;

    ctx.fillStyle="tan";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    for (const entityID in entities) {
      const entity = entities[entityID];
      const {x, y} = entity;
      if (x == null || y == null) return;
      switch (entity.type) {
        case 'FARM':
          ctx.fillStyle = "gold";
          if (entity.hydrated) ctx.fillStyle = "green";
          ctx.fillRect(x * sqWidth, y * sqHeight, sqWidth, sqHeight);
          break;
        case 'FOREST':
          ctx.fillStyle = "green";
          ctx.beginPath();
          ctx.moveTo(x * sqWidth + sqWidth / 2, y * sqHeight + 2);
          ctx.lineTo(x * sqWidth + sqWidth - 2, y * sqHeight + sqHeight - 2);
          ctx.lineTo(x * sqWidth + 2, y * sqHeight + sqHeight - 2);
          ctx.closePath();
          ctx.fill();
          break;
        case 'MOUNTAIN':
          ctx.fillStyle = "gray";
          ctx.beginPath();
          ctx.moveTo(x * sqWidth + sqWidth / 2, y * sqHeight + 2);
          ctx.lineTo(x * sqWidth + sqWidth - 2, y * sqHeight + sqHeight - 2);
          ctx.lineTo(x * sqWidth + 2, y * sqHeight + sqHeight - 2);
          ctx.closePath();
          ctx.fill();
          break;
        case 'HUT':
          ctx.fillStyle = "brown";
          ctx.beginPath();
          ctx.arc(
            x * sqWidth + sqWidth / 2, y * sqHeight + sqHeight / 2,
            sqWidth / 2 - 2, 0, 2 * Math.PI,
          );
          ctx.closePath();
          ctx.fill();
          break;
        case 'GRANARY':
          ctx.strokeStyle = "black";
          ctx.strokeRect(
            x * sqWidth + sqWidth / 4, y * sqHeight,
            sqWidth / 2, sqHeight,
          );
          ctx.fillStyle = "brown";
          ctx.fillRect(
            x * sqWidth + sqWidth / 4, y * sqHeight,
            sqWidth / 2, sqHeight,
          );
          ctx.fillStyle = "green";
          ctx.fillRect(
            x * sqWidth + sqWidth / 4, y * sqHeight + sqHeight,
            sqWidth / 2, -1 * sqHeight * (entity.occupied / entity.capacity),
          );
          break;
        case 'MONUMENT':
          ctx.fillStyle = "yellow";
          ctx.beginPath();
          ctx.moveTo(x * sqWidth + sqWidth / 2, y * sqHeight + 2);
          ctx.lineTo(x * sqWidth + sqWidth - 2, y * sqHeight + sqHeight - 2);
          ctx.lineTo(x * sqWidth + 2, y * sqHeight + sqHeight - 2);
          ctx.closePath();
          ctx.fill();
          break;

      }
    }


    for (const key in topo.topo) {
      const {elevation, water, influence} = smartGet(topo.topo, key);
      const {x, y} = fromKey(key);
      if (water > 0) {
        ctx.fillStyle = "steelblue";
        ctx.fillRect(x * sqWidth, y * sqHeight, sqWidth, sqHeight);
        if (debug) {
          const waterSource = topo.getWaterSource({x, y});
          if (!waterSource) continue;
          ctx.font = "14px Arial";
          ctx.fillStyle = "red";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(water,
            waterSource.x * sqWidth + sqWidth / 2,
            waterSource.y * sqHeight + sqHeight / 2,
          );
        }
      } else if (elevation == 0) {
        ctx.fillStyle = "#52410D";
        ctx.fillRect(x * sqWidth, y * sqHeight, sqWidth, sqHeight);
      } else if (influence > 0) {
        ctx.strokeStyle = "red";
        ctx.strokeRect(x * sqWidth, y * sqHeight, sqWidth, sqHeight);
      }
    }


    if (!myTurn && !isRealtime) {
      ctx.fillStyle = "rgba(0,0,0,0.1)";
      ctx.fillRect(0,0,canvas.width,canvas.height);
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
    this.dispatch({type: mode, x, y});

    // if (!state.isRealtime) {
    //   this.dispatchToServerAndSelf({type: 'END_TURN', clientID});
    // } // else turn end is handled already
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
    if (state.posFromThisClick[toKey({x, y})]) return;

    const mode = this.getClickMode();
    this.dispatch({type: mode, x, y});

  }

  getClickMode() {
    // return document.getElementById("clickMode").value;
    return this.getState().clickMode;
  }

}


