
import StatefulClient from './UI/StatefulClient.js';
import Lobby from './UI/Lobby.js';
import ScreenRouter from './UI/ScreenRouter.js';
import GameBoard from './UI/GameBoard.js';

customElements.define('stateful-client', StatefulClient);
customElements.define("game-lobby", Lobby);
customElements.define("screen-router", ScreenRouter);
customElements.define("game-board", GameBoard);
