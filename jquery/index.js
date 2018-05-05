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

$('document').ready(() => {

  // $('.pad').removeEventListener('click', onAddUserClick, false)

  $('#start').click(() => {
    userSequence = [];
    botSequence = [];
    currentLevel = 0;
    currentLevel++;
    onDisplayGameStatus('Started');
    onStartSimonSequence();
  });

  $('#reset').click(() => {
    onResetGame();
  });

  // $('.pad').click(function() {
  //   const id    = parseInt($(this).attr('id'));
  //   const color = $(this).attr('class').split(' ')[1];
  //   onStartUserSequence(id, color);
  // });

});

function onAddUserClick (isClickable=true) {
  if (isClickable) {
    onDisplayTurn('Your turn')
    $('.pad').click(function () {
      const id = parseInt($(this).attr('id'));
      const color = $(this).attr('class').split(' ')[1];
      onStartUserSequence(id, color);
    });
  } else {
    onDisplayTurn('Bot turn')
    $('.pad').off('click');
  }
}

function onStartSimonSequence () {
  onDisplayLevel(currentLevel);
  getRandomNumber();
  let i = 0;
  let interval = setInterval(() => {
    const id    = botSequence[i];
    const color = $('#'+id).attr('class').split(' ')[1];
    
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
  $('#' + id).addClass(color + '-active');
  setTimeout(() => {
    $('#' + id).removeClass(color + '-active');
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
  $('.status span').text(msg);
}

function onDisplayLevel (level) {
  $('.display span').text(currentLevel);
}

function onDisplayTurn (turn) {
  $('.player-turn span').text(turn);
}