
import StatefulClient from './UI/StatefulClient.js';
import ScreenRouter from './UI/ScreenRouter.js';
import Lobby from './UI/Lobby.js';
import GameBoard from './UI/GameBoard.js';
import AIPlayer from './UI/AIPlayer.js';
import ImportExportLevel from './UI/ImportExportLevel.js';
import Parameters from './UI/Parameters.js';

customElements.define('stateful-client', StatefulClient);
customElements.define("screen-router", ScreenRouter);
customElements.define("game-lobby", Lobby);
customElements.define("game-board", GameBoard);
customElements.define('ai-player', AIPlayer);
customElements.define('import-export-level', ImportExportLevel);
customElements.define('level-parameters', Parameters);
