let playerScore = 0;
let computerScore = 0;
const choices = ['rock', 'paper', 'scissors'];
const emojis = { rock: '✊', paper: '✋', scissors: '✌️' };

document.querySelectorAll('.choice-btn').forEach(btn => {
  btn.addEventListener('click', () => playGame(btn.dataset.choice));
});

function playGame(playerChoice) {
  const computerChoice = choices[Math.floor(Math.random() * 3)];
  const result = getResult(playerChoice, computerChoice);
  
  updateScore(result);
  displayResult(playerChoice, computerChoice, result);
  animateChoice(playerChoice);
}

function getResult(player, computer) {
  if (player === computer) return 'tie';
  
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
}

function updateScore(result) {
  if (result === 'win') {
    playerScore++;
    document.getElementById('player-score').textContent = playerScore;
  } else if (result === 'lose') {
    computerScore++;
    document.getElementById('computer-score').textContent = computerScore;
  }
}

function displayResult(playerChoice, computerChoice, result) {
  const container = document.getElementById('result-container');
  
  let resultText = '';
  let resultClass = '';
  
  if (result === 'win') {
    resultText = 'You Win! 🎉';
    resultClass = 'win';
  } else if (result === 'lose') {
    resultText = 'You Lose! 😢';
    resultClass = 'lose';
  } else {
    resultText = "It's a Tie! 🤝";
    resultClass = 'tie';
  }
  
  container.innerHTML = `
    <div class="result-text ${resultClass}">${resultText}</div>
    <div class="choices-display">
      <div class="choice-item">
        <div>${emojis[playerChoice]}</div>
        <div class="choice-label">You</div>
      </div>
      <div class="choice-item">
        <div>VS</div>
      </div>
      <div class="choice-item">
        <div>${emojis[computerChoice]}</div>
        <div class="choice-label">Computer</div>
      </div>
    </div>
  `;
}

function animateChoice(choice) {
  const btn = document.querySelector(`[data-choice="${choice}"]`);
  btn.classList.add('selected');
  setTimeout(() => btn.classList.remove('selected'), 500);
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  document.getElementById('player-score').textContent = '0';
  document.getElementById('computer-score').textContent = '0';
  document.getElementById('result-container').innerHTML = '';
}