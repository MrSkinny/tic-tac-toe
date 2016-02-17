/* global $, _ */

'use strict';

let gameRunning = false;
let currentPlayer = null;

let Players = [
  {
    id: 1,
    name: 'Jack',
    side: 'X'
  },
  {
    id: 2,
    name: 'Jill',
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
      if ( setMove(currentPlayer,$(this)) ) nextPlayer();
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
  updateDashboard();
}

function resetGame(){
  clearBoard();
}

function clearBoard(){
  for (let cell in Game.board){
    Game.board[cell] = " ";
    $('#'+cell).find('.content').removeClass('pink blink-me').addClass('white');
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
  if (Game.board[position.attr('id')] !== ' ') return false;
  
  Game.board[position.attr('id')] = player.side;
  updateBoard();
  
  if (checkGameEnd()) stopGame();
  if (playerWon()) {
    console.log(playerWon());
    let info = playerWon();
    $('#player-won').text("... " + info.winner.name + " wins!!");
    info.spaces.forEach( space => space.find('.content').removeClass('white').addClass('pink blink-me'));
  }
  
  return true;
}

function nextPlayer(){
  currentPlayer = currentPlayer === Players[0] ? Players[1] : Players[0];
  updateDashboard();
}

function playerWon(){
  if ( Game.board['A1'] !== ' ' && (Game.board['A1'] === Game.board['A2'] && Game.board['A2'] === Game.board['A3']) ){
    return {
      winner: (Players[0].side === Game.board['A1'] ? Players[0] : Players[1]),
      spaces: [ $('#A1'), $('#A2'), $('#A3') ]
    };
  } else if ( Game.board['B1'] !== ' ' && (Game.board['B1'] === Game.board['B2'] && Game.board['B2'] === Game.board['B3']) ){
    return {
      winner: (Players[0].side === Game.board['B1'] ? Players[0] : Players[1]),
      spaces: [ $('#B1'), $('#B2'), $('#B3') ]
    };
  } else if ( Game.board['C1'] !== ' ' && (Game.board['C1'] === Game.board['C2'] && Game.board['C2'] === Game.board['C3']) ){
    return {
      winner: (Players[0].side === Game.board['C1'] ? Players[0] : Players[1]),
      spaces: [ $('#C1'), $('#C2'), $('#C3') ]
    };
  } else if ( Game.board['A1'] !== ' ' && (Game.board['A1'] === Game.board['B1'] && Game.board['B1'] === Game.board['C1']) ){
    return {
      winner: (Players[0].side === Game.board['A1'] ? Players[0] : Players[1]),
      spaces: [ $('#A1'), $('#B1'), $('#C1') ]
    };
  } else if ( Game.board['A2'] !== ' ' && (Game.board['A2'] === Game.board['B2'] && Game.board['B2'] === Game.board['C2']) ){
    return {
      winner: (Players[0].side === Game.board['A2'] ? Players[0] : Players[1]),
      spaces: [ $('#A2'), $('#B2'), $('#C2') ]
    };
  } else if ( Game.board['A3'] !== ' ' && (Game.board['A3'] === Game.board['B3'] && Game.board['B3'] === Game.board['C3']) ){
    return {
      winner: (Players[0].side === Game.board['A3'] ? Players[0] : Players[1]),
      spaces: [ $('#A3'), $('#B3'), $('#C3') ]
    };
  } else if ( Game.board['A1'] !== ' ' && (Game.board['A1'] === Game.board['B2'] && Game.board['B2'] === Game.board['C3']) ){
    return {
      winner: (Players[0].side === Game.board['A1'] ? Players[0] : Players[1]),
      spaces: [ $('#A1'), $('#B2'), $('#C3') ]
    };
  } else if ( Game.board['C1'] !== ' ' && (Game.board['C1'] === Game.board['B2'] && Game.board['B2'] === Game.board['A3']) ){
    return {
      winner: (Players[0].side === Game.board['C1'] ? Players[0] : Players[1]),
      spaces: [ $('#C1'), $('#B2'), $('#A3') ]
    };
  }
  return null;
}

function checkGameEnd(){
  return (!_.includes(Game.board, " ") || playerWon()) ? true : false;
}

listeners.init();

