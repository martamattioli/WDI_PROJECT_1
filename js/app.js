// When user clicks START, the button disappears
// In place there is a circle in the middle
// Every random seconds the circle changes color

//SCORE variables
var score = 0;
var lives = 3;

//Variable for color array
var colors = ['red', 'yellow'];

//Variables for the central dot
var progressColorCounter = 0;
var dotColors;
var randomIntervals = Math.floor(Math.random() * 10000) + 2000;

//Bubbles positioning
// !!!!!!! Not sure why, but sometimes it gives me undefined %
var xCoordinate = `${xPositionExclude50()}%`;
var yCoordinate = `${yPositionExclude50()}%`;

//Bubble intervals variables
var bubbleIntervals;
var bubbleIds = 0;
var timerIds = 0;
var removeDiv = 0;

function xPositionExclude50() {
  xCoordinate = Math.floor(Math.random() * 93) + 3;
  if (xCoordinate >= 47 && xCoordinate <= 53) {
    yPositionExclude50();
  } else {
    return xCoordinate;
  }
}

function yPositionExclude50() {
  yCoordinate = Math.floor(Math.random() * 93) + 3;
  if (yCoordinate >= 47 && yCoordinate <= 53) {
    yPositionExclude50();
  } else {
    return yCoordinate;
  }
}

//Intervals for the central dot
function startDotInterval() {
  dotColors = setInterval(changeDotColor, randomIntervals);
}

function changeDotColor() {
  $('.center-dot').css('background', colors[progressColorCounter]).attr('value', colors[progressColorCounter]);
  //Progress colors index at random
  progressColorCounter = Math.floor(Math.random() * (colors.length - 1));
  //Reassign a random number between 2 seconds and 12 seconds
  randomIntervals = Math.floor(Math.random() * 10000) + 2000;
}

//Intervals for various bubbles
//Make bubbles appear on the screen on set intervals
// !!!!!!!!!!!! MAKE THE 2000 TURN INTO INCREASING SPEED OF FILL UP
function appearBubbles() {
  bubbleIntervals = setInterval(addBubbles, 2000);
}

function addBubbles() {
  var bubbleColor = colors[Math.floor(Math.random() * (colors.length))];
  $('<div/>').addClass('bubble').attr('id', `${bubbleIds}`).attr('value', `${bubbleColor}`).appendTo('.game-board').css({
    'left': xCoordinate,
    'top': yCoordinate,
    'background-color': bubbleColor,
    'padding': Math.floor(Math.random() * 30) + 10
  });
  xCoordinate = `${xPositionExclude50()}%`;
  yCoordinate = `${yPositionExclude50()}%`;
  //Fade out and remove divs
  setTimeout(function() {
    $(`#${timerIds}`).fadeOut();
    setTimeout( function() {
      $(`#${removeDiv}`).remove();
      removeDiv++;
    }, 1000);
    timerIds++;
  }, 3000);
  bubbleIds++;
  //Add event listener to IDs --> if value of center-dot === value of clicked item, success // else game over
  $('.bubble').one('click', checkColor);
}


function checkColor(e) {
  if ($(e.target).attr('value') === $('.center-dot').attr('value')) {
    console.log(`Clicked value: ${$(e.target).attr('value')}`, `Center Dot: ${$('.center-dot').attr('value')}`, 'YAY');
    score++;
    $(e.target).remove();
  } else {
    console.log(`Clicked value: ${$(e.target).attr('value')}`, `Center Dot: ${$('.center-dot').attr('value')}`, 'OH NO');
    lives--;
    $(e.target).remove();
    if (lives === 0) {
      console.log('Game OVER');
    }
  }
}

function init() {
  // When user clicks START, the button disappears
  // In place there is a circle in the middle
  $('.start-button').on('click', () => {
    $('.start-button').css('display', 'none');
    $('.center-dot').css('display', 'inline-block');
    $('p:nth-child(1)').css('display', 'inline-block');
    startDotInterval();
    setTimeout(appearBubbles, 2000);
    //JUST A TIMER TO CHECK THINGS
    // var startTimer = 0;
    // setInterval(function() {
    //   console.log(startTimer);
    //   startTimer++;
    // }, 1000);
  });
}

$(init);
