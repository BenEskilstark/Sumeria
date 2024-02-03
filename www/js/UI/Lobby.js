import StatefulHTML from './StatefulHTML.js';
import {config} from '../config.js';
import {dropdown} from '../UI/components/Dropdown.js';
import {levels} from '../levels/levels.js';

const baseLobby = () => {
  return `
    <h2>Ancient Sumeria</h2>
    <div>
      <button onclick="this.closest('game-lobby').createGame()">
        Create New Game
      </button>
    </div>
    <div class="gameList">
      <!-- Current games are listed here -->
    </div>
  `;
}

const listedGame = (state, sessionID) => {
  const d = document.getElementById;
  const {sessions} = state;
  const session = sessions[sessionID];
  const joinAction = JSON.stringify({type: 'JOIN_SESSION', sessionID})
    .replaceAll('"', "'");

  const amHost = state.sessionID == sessionID && session.clients[0] == state.clientID;

  return `
    <div class="gameInLobby">
      ${session.name} Players: ${session.clients.length} / 10
      ${session.started ? "In Progress" : ""}
      <button
        style="display: ${state.sessionID || session.started ? 'none' : 'inline'}"
        onclick="this.closest('game-lobby').dispatchToServer(${joinAction})"
      >
        Join Game
      </button>
      <span style="display: ${amHost ? 'inline' : 'none'}">
        <button
          onclick="this.closest('game-lobby').startGame(${sessionID})"
        >
          Start Game
        </button>
        <button
          onclick="this.closest('game-lobby').addAIPlayer()"
        >
          Add AI Player
        </button>
        ${dropdown({options: Object.keys(levels), id: 'lvlD'})}
      </span>
    </div>
  `;
}

const aiClient = ({apm, sessionID}) => {
  return `
    <stateful-client sessionID="${sessionID}">
      <ai-player apm=${apm}></ai-player>
      <game-board></game-board>
    </stateful-client>
  `;
}


export default class Lobby extends StatefulHTML {
  connectedCallback() {
    this.innerHTML = baseLobby();
  }

  onChange(state) {
    const games = [];
    for (const sessionID in state.sessions) {
      games.push(listedGame(state, sessionID));
    }
    const gameList = this.querySelector(".gameList");
    gameList.innerHTML = games.join("\n");
  }

  createGame() {
    this.dispatchToServer({type: "CREATE_SESSION"});
  }

  addAIPlayer() {
    const container = document.getElementById("container");
    const {sessionID} = this.getState();

    // add the client and have it join this one's game
    container.insertAdjacentHTML(
      'beforeend',
      aiClient({apm: config.apm, sessionID}),
    );

  }

  startGame(sessionID) {
    const levelName = document.getElementById("lvlD").value;

    this.dispatchToServer({
      type: 'START_SESSION', sessionID,
      level: levels[levelName],
    });
  }

}


