// ---- ELEMENTS ----
const display = document.getElementById("display");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

// ---- STATE ----
let startTime = 0; // timestamp when the running period started
let elapsed = 0; // accumulated elapsed milliseconds while paused
let timerInterval = null; // interval ID when running (null when stopped)

// ---- FORMATTING HELPERS ----
function pad(number) {
  return number.toString().padStart(2, "0");
}

// Format ms -> "MM:SS:CS" (CS = centiseconds, 2 digits)
function formatTime(ms) {
  const totalCentiseconds = Math.floor(ms / 10);
  const cs = totalCentiseconds % 100;
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60);
  return `${pad(minutes)}:${pad(seconds)}:${pad(cs)}`;
}

// ---- UI UPDATE ----
function updateDisplay() {
  // if running, currentElapsed = now - startTime + previously elapsed
  // if stopped, currentElapsed = elapsed
  const currentElapsed = timerInterval
    ? Date.now() - startTime + elapsed
    : elapsed;
  display.textContent = formatTime(currentElapsed);
}

// ---- START (start or resume) ----
startBtn.addEventListener("click", () => {
  if (timerInterval) return; // already running -> ignore
  // Set baseline so elapsed time accumulates correctly when resuming
  startTime = Date.now();
  // start the interval to refresh UI frequently (every 10ms)
  timerInterval = setInterval(updateDisplay, 10);
  // Immediately update the UI (no visible lag)
  updateDisplay();

  // Tweak button states for friendly UX
  startBtn.disabled = true; // prevent double-starts
  pauseBtn.textContent = "Pause";
  pauseBtn.disabled = false;
});

// ---- PAUSE (toggle pause/resume) ----
pauseBtn.addEventListener("click", () => {
  if (!timerInterval) {
    // If not running and we already have some elapsed time, resume
    if (elapsed > 0) {
      startTime = Date.now();
      timerInterval = setInterval(updateDisplay, 10);
      updateDisplay();
      startBtn.disabled = true;
      pauseBtn.textContent = "Pause";
    }
    // otherwise nothing to do (already stopped at zero)
    return;
  }

  // If running -> pause
  clearInterval(timerInterval);
  timerInterval = null;
  // accumulate elapsed time
  elapsed += Date.now() - startTime;

  // UI tweaks
  startBtn.disabled = false;
  pauseBtn.textContent = "Resume";
});

// ---- RESET ----
resetBtn.addEventListener("click", () => {
  // stop timer if running
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  // reset state
  startTime = 0;
  elapsed = 0;
  // reflect on UI
  display.textContent = "00:00:00";
  // reset buttons
  startBtn.disabled = false;
  pauseBtn.textContent = "Pause";
});

// initial display
updateDisplay();
