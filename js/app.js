// When user clicks START, the button disappears
// In place there is a circle in the middle
// Every random seconds the circle changes color


//Start intervals when the start button is clicked
var progressColorCounter = 0;
var colors = ['red', 'yellow'];
var dotColors;
var randomIntervals = Math.floor(Math.random() * 10000) + 2000;

//Bubbles positioning
// !!!!!!! Not sure why, but sometimes it gives me undefined %
var xCoordinate = `${xPositionExclude50()}%`;
var yCoordinate = `${yPositionExclude50()}%`;

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

var bubbleIntervals;
var bubbleIds = 0;

function startDotInterval() {
  dotColors = setInterval(changeDotColor, randomIntervals);
}

function changeDotColor() {
  // console.log(randomIntervals);
  $('.center-dot').css('background', colors[progressColorCounter]).attr('value', colors[progressColorCounter]);
  console.log(progressColorCounter);
  //Progress colors index at random
  progressColorCounter = Math.floor(Math.random() * (colors.length));
  //Reassign a random number between 2 seconds and 12 seconds
  randomIntervals = Math.floor(Math.random() * 10000) + 2000;
}

//Make bubbles appear on the screen on set intervals
// !!!!!!!!!!!! MAKE THE 2000 TURN INTO INCREASING SPEED OF FILL UP
function appearBubbles() {
  bubbleIntervals = setInterval(addBubbles, 2000);
}

var bubbleColor = colors[Math.floor(Math.random() * (colors.length))];
function createBubble() {

}

function disappearBubbles(e) {
  console.log(e.target);
  // $(e.target).remove();
}

function addBubbles() {
  var bubbleColor = colors[Math.floor(Math.random() * (colors.length))];
  $('<div/>').addClass('bubble').attr('id', `${bubbleIds}`).attr('value', `${bubbleColor}`).appendTo('.game-board').css({
    'left': xCoordinate,
    'top': yCoordinate,
    'background-color': bubbleColor
  });
  bubbleIds++;
  xCoordinate = `${xPositionExclude50()}%`;
  yCoordinate = `${yPositionExclude50()}%`;
  setTimeout(disappearBubbles, 2000);
}

function init() {
  // When user clicks START, the button disappears
  // In place there is a circle in the middle
  $('.start-button').on('click', () => {
    $('.start-button').css('display', 'none');
    $('.center-dot').css('display', 'inline-block');
    startDotInterval();
    setTimeout(appearBubbles, 2000);
  });
}

$(init);
