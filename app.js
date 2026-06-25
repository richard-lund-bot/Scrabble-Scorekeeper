// ── State ─────────────────────────────────────────────────────────────────────

const state = {
  players: [],       // [{ name, scores: [] }]
  round: 1,
  activePlayer: 0,
  currentInput: '',
};

// ── Screens ───────────────────────────────────────────────────────────────────

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ── Setup ─────────────────────────────────────────────────────────────────────

function renderSetup() {
  const list = document.getElementById('player-list');
  list.innerHTML = '';
  state.players.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'player-item';
    div.innerHTML = `<span>${p.name}</span><button onclick="removePlayer(${i})">✕</button>`;
    list.appendChild(div);
  });
  document.getElementById('start-btn').disabled = state.players.length < 2;
}

function addPlayer() {
  const input = document.getElementById('player-name-input');
  const name = input.value.trim();
  if (!name || state.players.length >= 6) return;
  state.players.push({ name, scores: [] });
  input.value = '';
  renderSetup();
}

function removePlayer(i) {
  state.players.splice(i, 1);
  renderSetup();
}

function startGame() {
  if (state.players.length < 2) return;
  state.round = 1;
  state.activePlayer = 0;
  state.currentInput = '';
  state.players.forEach(p => { p.scores = []; });
  renderGame();
  showScreen('game-screen');
}

// ── Game ──────────────────────────────────────────────────────────────────────

function renderGame() {
  renderScoreboard();
  renderEntryPanel();
}

function renderScoreboard() {
  const tbody_rows = state.players.map((p, pi) => {
    const roundCells = Array.from({ length: state.round }, (_, r) => {
      const val = p.scores[r];
      return `<td>${val !== undefined ? val : ''}</td>`;
    }).join('');
    const total = p.scores.reduce((s, v) => s + v, 0);
    const isActive = pi === state.activePlayer;
    return `<tr class="${isActive ? 'active-row' : ''}">
      <td>${p.name}</td>
      ${roundCells}
      <td class="total-cell">${total}</td>
    </tr>`;
  }).join('');

  const headerRounds = Array.from({ length: state.round }, (_, r) =>
    `<th>R${r + 1}</th>`
  ).join('');

  document.getElementById('scoreboard').innerHTML = `
    <table>
      <thead><tr><th>Player</th>${headerRounds}<th>Total</th></tr></thead>
      <tbody>${tbody_rows}</tbody>
    </table>`;
}

function renderEntryPanel() {
  const player = state.players[state.activePlayer];
  document.getElementById('active-player-name').textContent = player.name;
  document.getElementById('current-round').textContent = state.round;
  updateScoreDisplay();
}

function updateScoreDisplay() {
  const display = document.getElementById('score-display');
  display.textContent = state.currentInput === '' ? '0' : state.currentInput;
  display.classList.toggle('has-value', state.currentInput !== '');
}

// ── Numpad ────────────────────────────────────────────────────────────────────

function numpadPress(digit) {
  if (state.currentInput.length >= 4) return;
  if (state.currentInput === '' && digit === 0) return;
  state.currentInput += String(digit);
  updateScoreDisplay();
}

function numpadDelete() {
  state.currentInput = state.currentInput.slice(0, -1);
  updateScoreDisplay();
}

function numpadClear() {
  state.currentInput = '';
  updateScoreDisplay();
}

function confirmScore() {
  const value = state.currentInput === '' ? 0 : parseInt(state.currentInput, 10);
  const player = state.players[state.activePlayer];

  player.scores[state.round - 1] = value;
  state.currentInput = '';

  const nextPlayer = state.activePlayer + 1;
  if (nextPlayer >= state.players.length) {
    state.activePlayer = 0;
    state.round += 1;
  } else {
    state.activePlayer = nextPlayer;
  }

  renderGame();
}

function confirmEndGame() {
  if (!confirm('End the game and see final scores?')) return;
  endGame();
}

function endGame() {
  const ranked = state.players
    .map(p => ({ name: p.name, total: p.scores.reduce((s, v) => s + v, 0) }))
    .sort((a, b) => b.total - a.total);

  const medals = ['🥇', '🥈', '🥉'];
  document.getElementById('final-scores').innerHTML = ranked.map((p, i) => `
    <div class="final-row ${i === 0 ? 'winner' : ''}">
      <span class="rank">${medals[i] || (i + 1)}</span>
      <span class="name">${p.name}</span>
      <span class="score">${p.total}</span>
    </div>`).join('');

  showScreen('end-screen');
}

function newGame() {
  state.players = [];
  renderSetup();
  showScreen('setup-screen');
}

// ── Keyboard support ──────────────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  const gameActive = document.getElementById('game-screen').classList.contains('active');
  if (!gameActive) return;

  if (e.key >= '0' && e.key <= '9') {
    numpadPress(Number(e.key));
  } else if (e.key === 'Backspace') {
    numpadDelete();
  } else if (e.key === 'Delete') {
    numpadClear();
  } else if (e.key === 'Enter') {
    confirmScore();
  }
});

// ── Enter on setup input ──────────────────────────────────────────────────────

document.getElementById('player-name-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addPlayer();
});

// ── Init ──────────────────────────────────────────────────────────────────────

renderSetup();
