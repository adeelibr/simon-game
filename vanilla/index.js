let userSequence = [];
let botSequence = [];

let currentLevel = 0;

const NO_OF_LEVELS = 20;
const BOARD_SOUNDS = [
  "http://www.soundjay.com/button/sounds/button-4.mp3",
  "http://www.soundjay.com/button/sounds/button-09.mp3",
  "http://www.soundjay.com/button/sounds/button-10.mp3",
  "http://www.soundjay.com/button/sounds/button-7.mp3"
];

document.addEventListener('DOMContentLoaded', (event) => {
  
  document.getElementById('start').onclick = () => {
    userSequence = [];
    botSequence = [];
    currentLevel = 0;
    currentLevel++;
    onDisplayGameStatus('Started');
    onStartSimonSequence();
  }

  document.getElementById('reset').onclick = () => {
    onResetGame();
  }

});

function onAddUserClick (isClickable=true) {
  const classNames = document.getElementsByClassName('pad');

  if (isClickable) {
    onDisplayTurn('Your turn')
    for (let i=0; i < classNames.length; i++) {
      classNames[i].addEventListener('click', onHandleUserAction, false);
    }
  } else {
    onDisplayTurn('Bot turn');
    for (let i = 0; i < classNames.length; i++) {
      classNames[i].addEventListener('click', onHandleUserAction, false);
    }
  }
}

function onHandleUserAction (event) {
  const id = parseInt(event.target.id);
  const color = event.target.className.split(' ')[1];
  onStartUserSequence(id, color);
}

function onStartSimonSequence () {
  onDisplayLevel(currentLevel);
  getRandomNumber();
  let i = 0;
  let interval = setInterval(() => {
    const id    = botSequence[i];
    const color = document.getElementById(id).className.split(' ')[1]
    
    // console.log(id, color);
    addColor(id, color);
    playSound(id);

    i++;
    if (i === botSequence.length) {
      clearInterval(interval);
      onAddUserClick(true);
    } 
  }, 1000);
}

function onStartUserSequence (id, color) {
  userSequence.push(id);

  // console.log('User: ', userSequence);
  // console.log('-Bot: ', botSequence);

  // console.log(id, color);
  addColor(id, color);
  playSound(id);

  const checkUserSequence = userSequence.every((val, i) => val === botSequence[i]);

  if (!checkUserSequence) {
    // console.log('Error, DO SOMETHING');
    onDisplayGameStatus('You lost.');
    onResetGame();
  } else if (userSequence.length === botSequence.length && userSequence.length < NO_OF_LEVELS) {
    // console.log('Upgrading Level');
    currentLevel++;
    userSequence = [];
    onAddUserClick(false);
    onStartSimonSequence();
  } else if (userSequence.length === NO_OF_LEVELS) {
    // console.log('Deciding Winner');
    onDisplayGameStatus('You won.');
    onResetGame();
  }
}

function getRandomNumber () {
  let random = Math.floor(Math.random() * 4);
  botSequence.push(random);
}

function playSound (boardSoundId) {
  const sound = new Audio(BOARD_SOUNDS[boardSoundId]);
  sound.play();
}

function addColor (id, color) {
  document.getElementById(id).classList.add(color + '-active');
  setTimeout(() => {
    document.getElementById(id).classList.remove(color + '-active');
  }, 500);
}

function onResetGame () {
  userSequence = [];
  botSequence = [];
  currentLevel = 0;
  
  setTimeout(() => {
    onAddUserClick(false);
    onDisplayLevel(currentLevel);
    onDisplayGameStatus('--');
    onDisplayTurn('--')
  }, 1500);
}

function onDisplayGameStatus (msg) {
  document.querySelector('.status span').innerText = msg;
}

function onDisplayLevel (level) {
  document.querySelector('.display span').innerText = level;
}

function onDisplayTurn (turn) {
  document.querySelector('.player-turn span').innerText = turn;
}