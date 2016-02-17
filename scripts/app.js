'use strict';

let gameRunning = false;
let currentPlayer = null;

let Players = [
  {
    id: 1,
    name: 'Rich',
    side: 'X'
  },
  {
    id: 2,
    name: 'Laura',
    side: 'O'
  }
];

let Game = {
  settings: {
    playerCount: 1
  },
  
  board: {
    "A1": " ",
    "A2": " ",
    "A3": " ",
    "B1": " ",
    "B2": " ",
    "B3": " ",
    "C1": " ",
    "C2": " ",
    "C3": " "
  }
};

let listeners = {
  init: function(){
    $('#button-game-start').on('click', ()=>{
      gameRunning ? stopGame() : startGame();
      updateDashboard();
    });
    
    $('.player-name').on('keyup', ()=>{
      Players[0].name = $('.player-name#player-X').val();
      Players[1].name = $('.player-name#player-O').val();
    });
  },
  
  gameRunning: function(){
    $('.ttt-gridbox').on('click', function(e){
      setMove(currentPlayer,$(this));
      nextPlayer();
      updateBoard();
      updateDashboard();
    });
  },
  
  gameStopped: function(){
    $('.ttt-gridbox').off('click');
  }
};

function toggleStartGameButton(val){
  let startButton = $('#button-game-start');
  if (val === 'stop'){
    startButton.text('Stop Game');
  } else {
    startButton.text('Start Game');
  }
}

function startGame(){
  resetGame();
  gameRunning = true;
  toggleStartGameButton('stop');
  currentPlayer = Players[0];
  setPlayerNames('disabled');
  listeners.gameRunning();
}

function stopGame(){
  gameRunning = false;
  toggleStartGameButton('start');
  currentPlayer = null;
  setPlayerNames('enabled');
  listeners.gameStopped();
}

function resetGame(){
  clearBoard();
}

function clearBoard(){
  for (let cell in Game.board){
    Game.board[cell] = " ";
  }
  updateBoard();
}

function updateBoard(){
  for (let i = 1; i <= 9; i++){
    let col, row;
    if (i <= 3){
      col = "A";
      row = i;
    } else if (i <= 6){
      col = "B";
      row = i - 3;
    } else {
      col = "C";
      row = i - 6;
    }
    $('#'+col+row+' .content').text(Game.board[col+row]);
  }
}

function updateDashboard(){
  let cp = currentPlayer || {name: "N/A"};
  $('#current-player').text(cp.name);
}

function setPlayerNames(state){
  $('.player-name').attr('disabled', (state === 'disabled'));
}

function setMove(player,position){
  if (!player || !player.side) return false;
  if (!position) return false;
  
  console.log(position.attr('id'));
  Game.board[position.attr('id')] = player.side;
  updateBoard();
  
  if (checkGameEnd()){
    stopGame();
  }
}

function nextPlayer(){
  currentPlayer = currentPlayer === Players[0] ? Players[1] : Players[0];
  updateDashboard();
}

function playerWon(){
  if ( Game.board['A1'] !== ' ' && (Game.board['A1'] === Game.board['A2'] && Game.board['A2'] === Game.board['A3']) ){
    return Game.board['A1'];
  } else if ( Game.board['B1'] !== ' ' && (Game.board['B1'] === Game.board['B2'] && Game.board['B2'] === Game.board['B3']) ){
    return Game.board['B1'];
  } else if ( Game.board['C1'] !== ' ' && (Game.board['C1'] === Game.board['C2'] && Game.board['C2'] === Game.board['C3']) ){
    return Game.board['C1'];
  } else if ( Game.board['A1'] !== ' ' && (Game.board['A1'] === Game.board['B1'] && Game.board['B1'] === Game.board['C1']) ){
    return Game.board['A1'];
  } else if ( Game.board['A2'] !== ' ' && (Game.board['A2'] === Game.board['B2'] && Game.board['B2'] === Game.board['C2']) ){
    return Game.board['A2'];
  } else if ( Game.board['A3'] !== ' ' && (Game.board['A3'] === Game.board['B3'] && Game.board['B3'] === Game.board['C3']) ){
    return Game.board['A3'];
  } else if ( Game.board['A1'] !== ' ' && (Game.board['A1'] === Game.board['B2'] && Game.board['B2'] === Game.board['C3']) ){
    return Game.board['A1'];
  } else if ( Game.board['C1'] !== ' ' && (Game.board['C1'] === Game.board['B2'] && Game.board['B2'] === Game.board['A3']) ){
    return Game.board['A1'];
  }
  return null;
}

function checkGameEnd(){
  return (!_.includes(Game.board, " ") || playerWon()) ? true : false;
}

listeners.init();

