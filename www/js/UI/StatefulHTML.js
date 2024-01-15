import {dispatchToServer} from '../sockets.js';

// Have components that are children of <stateful-client> extend this
// class in order for them to get access to
// this.getState, this.dispatch, etc.
// Implement onChange(state) which fires whenever the state changes

export default class StatefulHTML extends HTMLElement {
  token = null;

  constructor() {
    super();
    this.registerState();
    this.token = this.subscribe(this.onChange.bind(this))
  }

  registerState() {
    const storeEvent = new CustomEvent('requestStore', {bubbles: true, detail: {}});
    this.dispatchEvent(storeEvent);
    Object.assign(this, storeEvent.detail);
  }

  disconnectedCallback() {
    this.unsubscribe(this.token); // make sure to call this if you override
  }


  ////////////////////
  // override this
  onChange(state) {}


  ////////////////////
  // call these to update game state for all players
  dispatchToServer(action) {
    const {socket} = this.getState();
    if (socket.isSinglePlayer) {
      this.dispatch(action);
    } else {
      dispatchToServer(socket, action);
    }
  }

  dispatchToServerAndSelf(action) {
    const {socket} = this.getState();
    this.dispatch(action);
    if (!socket.isSinglePlayer) {
      dispatchToServer(socket, action);
    }
  }

  // queue the action (to be dispatched at the end of our next turn)
  // unless we're not realtime, in which case just dispatch to server and self
  // (or unless we're not actually using the socket)
  queue(action) {
    const {myTurn, realtime, socket} = this.getState();
    if (realtime && !socket.isSinglePlayer) {
      this.dispatch({type: 'QUEUE_ACTION', action});
    } else {
      this.dispatchToServerAndSelf(action);
    }
  }

}
