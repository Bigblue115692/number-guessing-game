// Pure game logic: no DOM access.
const MAX_ATTEMPTS = 5;
const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

function createGame(rng = Math.random, forcedSecret = null) {
  const secret = Number.isInteger(forcedSecret) && forcedSecret >= MIN_NUMBER && forcedSecret <= MAX_NUMBER
    ? forcedSecret
    : Math.floor(rng() * MAX_NUMBER) + MIN_NUMBER;
  return {
    secret,
    attemptsLeft: MAX_ATTEMPTS,
    maxAttempts: MAX_ATTEMPTS,
    status: 'playing', // 'playing' | 'won' | 'lost'
  };
}

// Returns the parsed integer, or null if the raw input is not a whole number in range.
function parseGuess(raw) {
  const text = String(raw ?? '').trim();
  if (!/^\d+$/.test(text)) return null;
  const n = Number(text);
  return n >= MIN_NUMBER && n <= MAX_NUMBER ? n : null;
}

// Mutates state. result: 'invalid' | 'ignored' | 'correct' | 'low' | 'high'
function makeGuess(state, raw) {
  if (state.status !== 'playing') return 'ignored';
  const n = parseGuess(raw);
  if (n === null) return 'invalid';
  if (n === state.secret) {
    state.status = 'won';
    return 'correct';
  }
  state.attemptsLeft = Math.max(0, state.attemptsLeft - 1);
  if (state.attemptsLeft === 0) state.status = 'lost';
  return n < state.secret ? 'low' : 'high';
}

if (typeof module !== 'undefined') module.exports = { createGame, parseGuess, makeGuess };
