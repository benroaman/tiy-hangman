  ///////////////
 // Variables //
///////////////

var attempts; //integer that tracks the number of attempts made by the player
var remainingAttempts; //integer that tracks the player's allowance of failures
var selectedcategory; // integer representing the selected category's index within the categories array
var secretPhrase; // string representing the secret phrase that is the object of the game
var dashedPhrase; // array representing the obscured/semi-obscured secret phrase
var guess; // string representing the player's current guess
var solution; // string representing the player's current attempt to solve the puzzle
var badGuesses; // array representing the player's current failures
var gameReady = false; // boolean value to prevent overzealous players from guessing before the game is ready

  ////////////
 // Tier 1 //  Triggered by user input
////////////

// Uses int categoryIndex to set the index based on user input to .category-button
function setcategory(categoryIndex) {
  selectedcategory = categoryIndex;
  document.querySelector('.category-display').textContent = categoryNames[categoryIndex];
  initializeGame();
}

// Resets game parameters, selects and initializes a new secretPhrase
// Triggered by .start-button
function initializeGame() {
  if (isNaN(selectedcategory)) {
    alert("Pick a category, nerd!")
    return;
  }
  resetGame();
  getSecretPhrase();
  initializeDashedPhrase();
  updateDisplay();
  gameReady = true;
  // document.querySelector('.start-button').textContent = 'Restart!';
}

// sets guess variable based on user input to .guess-box
function setGuess(guessInput) {
  guess = guessInput;
}

//ensures guessing still makes sense in the context of the game and then executes logic
//triggered by .guess-button
function checkGuess () {
  if (!gameReady) {
    alert("I think, and bear with me here, that, maybe, picking a category is somewhat important to playing this game...");
    return;
  } else if (!victoryCheck() && !failCheck()) {
    if (guess === undefined) {
      alert('It might be helpful to acutally field a guess...');
      return;
    }
    checkGuessLogic();
    return false;
  }
}

function setSolution(solutionInput) {
    solution = solutionInput;
}

function checkSolution() {
  if (!gameReady) {
    alert("You need to select a category and start the game, dope!");
    return;
  } else if (!victoryCheck() && !failCheck()) {
    if (solution === undefined) {
      alert('nothing ventured, nothing happens...');
      return;
    }
    if (solution.toLowerCase() === secretPhrase.toLowerCase()) {
      dashedPhrase = secretPhrase.split('');
      updateDisplay();
      victory();
    } else {
      remainingAttempts = 0;
      fail();
    }
  }
  solution = undefined;
}

  ////////////
 // Tier 2 //  triggered by tier 1
////////////

function resetGame() {
  remainingAttempts = 6;
  attempts = 0;
  guess = undefined;
  solution = undefined;
  badGuesses = [];
}

function getSecretPhrase() {
  secretPhrase = categories[selectedcategory][Math.floor(Math.random() * categories[selectedcategory].length)];
}

function initializeDashedPhrase() {
  dashedPhrase = secretPhrase.split('');
  dashedPhrase = dashedPhrase.map(function(ch) {
    if (ch === ' ') {
      return ' ';
    } else {
      return '_';
    }
  });
}

function updateDisplay() {
  document.querySelector('.progress-display').textContent = dashedPhrase.join(' ');
  document.querySelector('.remaining-failure-display').textContent = String(remainingAttempts);
  document.querySelector('.current-failure-display').textContent = badGuesses.join(', ');
  document.querySelector('.guess-box').value = '';
  document.querySelector('.solution-box').value = '';
}

function victoryCheck() {
  for (var i = 0; i < dashedPhrase.length; ++i) {
    if (dashedPhrase[i] === '_') {
      return false;
    }
  }
  return true;
}

function failCheck() {
  if (remainingAttempts <= 0) {
    return true;
  } else {
    return false;
  }
}

function checkGuessLogic() {
  var isCorrect = false;
  for (var i = 0; i < secretPhrase.length; ++i) {
    if (secretPhrase[i].toLowerCase() === guess.toLowerCase()) {
      dashedPhrase[i] = secretPhrase[i];
      isCorrect = true;
    }
  }
  if (!isCorrect) {
    --remainingAttempts;
    updateFailures(guess);
  }
  updateDisplay();
  checkGameStatus();
  guess = undefined;
}

  ////////////
 // Tier 3 // Triggered by tier 2
////////////

function updateFailures(badGuess) {
  for (var i = 0; i < badGuesses.length; ++i) {
    if (badGuesses[i] === badGuess) {
      alert('You already guessed ' + badGuess + ', dummy!');
      return;
    }
  }
  badGuesses.push(badGuess);
}

function checkGameStatus() {
  if (victoryCheck()) {
    victory();
  } else if (failCheck()) {
    fail();
  }
}

  ////////////
 // Tier 4 // Triggered by tier 3
////////////

function victory() {
  alert('You win!\nCongratulations on getting lucky!');
  document.querySelector('.category-display').textContent = "select a category to play...";
}

function fail() {
  dashedPhrase = "YOU FAIL".split('');
  updateDisplay();
  alert('The answer we were looking for was \"' + secretPhrase + '.\"\nYOU FAIL!');
  document.querySelector('.category-display').textContent = "select a category to play...";
}

// $(".guess-box").keyup(function(event){
//   if(event.keyCode == 13){
//     $(".guess-button").click();
//   }
// })
