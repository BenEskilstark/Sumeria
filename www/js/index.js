
import StatefulClient from './UI/StatefulClient.js';
customElements.define('stateful-client', StatefulClient);

import ScreenRouter from './UI/ScreenRouter.js';
customElements.define("screen-router", ScreenRouter);

import Lobby from './UI/Lobby.js';
customElements.define("game-lobby", Lobby);

import GameBoard from './UI/GameBoard.js';
customElements.define("game-board", GameBoard);

import AIPlayer from './UI/AIPlayer.js';
customElements.define('ai-player', AIPlayer);

import TurnControls from './UI/TurnControls.js';
customElements.define('turn-controls', TurnControls);

import PlayerResources from './UI/PlayerResources.js';
customElements.define('player-resources', PlayerResources);

import ImportExportLevel from './UI/ImportExportLevel.js';
customElements.define('import-export-level', ImportExportLevel);

import Parameters from './UI/Parameters.js';
customElements.define('level-parameters', Parameters);

import ClickActionSelector from './UI/ClickActionSelector.js';
customElements.define('click-action', ClickActionSelector);
