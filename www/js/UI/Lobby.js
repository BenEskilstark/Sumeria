import StatefulHTML from './StatefulHTML.js';

export default class Lobby extends StatefulHTML {
  connectedCallback() {}

  startGame() {
    this.dispatch({type: 'START_SESSION'});
  }

}


