const movieBank = [
  { title: 'Inception', clue: 'A thief who steals secrets from dreams must plant an idea instead.' },
  { title: 'The Dark Knight', clue: 'A city needs a symbol to fight chaos and fear.' },
  { title: 'Titanic', clue: 'A tragic love story unfolds aboard a doomed ship.' },
  { title: 'Avatar', clue: 'A marine joins a world of blue creatures and glowing forests.' },
  { title: 'Finding Nemo', clue: 'A father ventures across the ocean to find his lost son.' },
  { title: 'The Matrix', clue: 'Reality is a simulation and a chosen one sees the truth.' },
  { title: 'Jurassic Park', clue: 'Dinosaurs come back to life in a dangerous theme park.' },
  { title: 'Frozen', clue: 'Two sisters discover the power of love in a kingdom of ice.' },
  { title: 'Spider-Man: Into the Spider-Verse', clue: 'A teen hero learns that anyone can wear the mask.' },
  { title: 'Interstellar', clue: 'A pilot crosses space to save humanity by finding a new home.' },
  { title: 'The Lion King', clue: 'A young prince learns courage and responsibility in the wild.' },
  { title: 'Shrek', clue: 'A grumpy ogre and a talking donkey go on a fairy-tale adventure.' }
];

const totalQuestions = 5;
let score = 0;
let currentIndex = 0;
let quizSet = [];

const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const startButton = document.getElementById('start-btn');
const progressLabel = document.getElementById('progress');
const scoreLabel = document.getElementById('score');
const clueText = document.getElementById('clue');
const optionsContainer = document.getElementById('options');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuizSet() {
  const shuffled = shuffle(movieBank);
  return shuffled.slice(0, totalQuestions);
}

function buildOptions(correctTitle) {
  const wrongChoices = shuffle(
    movieBank.filter((movie) => movie.title !== correctTitle)
  ).slice(0, 3);

  return shuffle([correctTitle, ...wrongChoices.map((movie) => movie.title)]);
}

function updateScore() {
  scoreLabel.textContent = String(score);
}

function renderQuestion() {
  const currentMovie = quizSet[currentIndex];
  const options = buildOptions(currentMovie.title);

  progressLabel.textContent = `Question ${currentIndex + 1} / ${quizSet.length}`;
  clueText.textContent = currentMovie.clue;
  optionsContainer.innerHTML = '';
  feedback.className = 'feedback hidden';
  feedback.textContent = '';
  nextButton.classList.add('hidden');
  nextButton.textContent = 'Next Question';
  updateScore();

  options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'option';
    button.textContent = option;
    button.addEventListener('click', () => handleAnswer(option, button));
    optionsContainer.appendChild(button);
  });
}

function handleAnswer(selectedTitle, selectedButton) {
  const currentMovie = quizSet[currentIndex];
  const optionButtons = [...optionsContainer.querySelectorAll('.option')];

  optionButtons.forEach((button) => {
    button.disabled = true;
    if (button.textContent === currentMovie.title) {
      button.classList.add('correct');
    }
    if (button.textContent === selectedTitle && selectedTitle !== currentMovie.title) {
      button.classList.add('wrong');
    }
  });

  const isCorrect = selectedTitle === currentMovie.title;

  if (isCorrect) {
    score += 1;
    feedback.className = 'feedback success';
    feedback.textContent = `Correct! The answer was ${currentMovie.title}.`;
  } else {
    feedback.className = 'feedback error';
    feedback.textContent = `Not quite. The correct answer was ${currentMovie.title}.`;
  }

  updateScore();

  if (currentIndex < quizSet.length - 1) {
    nextButton.classList.remove('hidden');
  } else {
    nextButton.textContent = 'See Results';
    nextButton.classList.remove('hidden');
  }

  selectedButton.classList.add(isCorrect ? 'correct' : 'wrong');
}

function showResults() {
  const percent = Math.round((score / quizSet.length) * 100);

  clueText.textContent = `You scored ${score} out of ${quizSet.length}. ${percent}% accuracy.`;
  optionsContainer.innerHTML = '';
  feedback.className = 'feedback success';
  feedback.textContent = percent >= 70
    ? 'Excellent guessing! You know your movies.'
    : 'Nice try! Ready for another round?';
  progressLabel.textContent = 'Final Score';
  nextButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
  updateScore();
}

function nextQuestion() {
  if (currentIndex < quizSet.length - 1) {
    currentIndex += 1;
    renderQuestion();
  } else {
    showResults();
  }
}

function startGame() {
  score = 0;
  currentIndex = 0;
  quizSet = buildQuizSet();
  restartButton.classList.add('hidden');
  nextButton.classList.add('hidden');
  startScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  renderQuestion();
}

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
  if (currentIndex < quizSet.length - 1) {
    nextQuestion();
  } else {
    showResults();
  }
});

restartButton.addEventListener('click', () => {
  restartButton.classList.add('hidden');
  startGame();
});
