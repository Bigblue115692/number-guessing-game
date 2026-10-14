// DOM wiring for the guessing game. Depends on game.js globals.
const form = document.getElementById('guess-form');
const input = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const feedback = document.getElementById('feedback');
const remaining = document.getElementById('remaining');
const modal = document.getElementById('modal');
const modalBox = document.getElementById('modal-box');
const modalMessage = document.getElementById('modal-message');
const modalDetail = document.getElementById('modal-detail');
const modalBtn = document.getElementById('modal-btn');

let game;

// ?secret=N forces the number (used for testing); ignored if invalid.
function forcedSecret() {
  const raw = new URLSearchParams(location.search).get('secret');
  return raw !== null && /^\d+$/.test(raw) ? Number(raw) : null;
}

function setFeedback(text, kind) {
  feedback.textContent = text;
  feedback.className = 'feedback' + (kind ? ' ' + kind : '');
}

function setLocked(locked) {
  input.disabled = locked;
  guessBtn.disabled = locked;
}

function showModal(won) {
  modalBox.className = 'modal-box ' + (won ? 'win' : 'lose');
  modalMessage.textContent = won
    ? 'Congrats! You Guessed Correctly!'
    : 'I am sorry you did not guess in time';
  modalDetail.textContent = won ? '' : 'The number was ' + game.secret + '.';
  modalBtn.textContent = won ? 'Play Again' : 'Try Again';
  modal.hidden = false;
  setLocked(true);
  modalBtn.focus();
}

function startGame() {
  game = createGame(Math.random, forcedSecret());
  remaining.textContent = game.attemptsLeft;
  setFeedback('', '');
  input.value = '';
  modal.hidden = true;
  setLocked(false);
  input.focus();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = makeGuess(game, input.value);
  if (result === 'ignored') return;
  if (result === 'invalid') {
    setFeedback('Enter a whole number from 1 to 100', 'wrong');
    input.select();
    return;
  }
  remaining.textContent = game.attemptsLeft;
  input.value = '';
  if (result === 'correct') {
    setFeedback('Your guess was correct!', 'correct');
    showModal(true);
  } else {
    setFeedback(result === 'low' ? 'Too low, try higher' : 'Too high, try lower', 'wrong');
    if (game.status === 'lost') showModal(false);
    else input.focus();
  }
});

modalBtn.addEventListener('click', startGame);

startGame();
