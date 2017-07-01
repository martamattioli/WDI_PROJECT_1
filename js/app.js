// When user clicks START, the button disappears
// In place there is a circle in the middle
// Every random seconds the circle changes color


//Start intervals when the start button is clicked
var progressColorCounter = 0;
var colors = ['red', 'yellow', 'green', 'blue', 'pink'];
var dotColors;
var randomIntervals = Math.floor(Math.random() * 10000) + 2000;

//Bubbles positioning
var xCoordinate = `${Math.floor(Math.random() * 96)}%`;
var yCoordinate = `${Math.floor(Math.random() * 96)}%`;

// function exclude50() {
//   var num = Math.floor(Math.random() * (max - min + 1)) + min;
//   return (num === 8 || num === 15) ? generateRandom(min, max) : num;
// }

var bubbleColors;

function startDotInterval() {
  dotColors = setInterval(changeDotColor, randomIntervals);
}

function changeDotColor() {
  // console.log(randomIntervals);
  $('.center-dot').css('background', colors[progressColorCounter]).attr('value', colors[progressColorCounter]);
  console.log(progressColorCounter);
  //Progress colors index at random
  progressColorCounter = Math.floor(Math.random() * (colors.length - 1));
  //Reassign a random number between 2 seconds and 12 seconds
  randomIntervals = Math.floor(Math.random() * 10000) + 2000;
}

//Make bubbles appear on the screen on set intervals
// !!!!!!!!!!!! MAKE THE 2000 TURN INTO INCREASING SPEED OF FILL UP
function appearBubbles() {
  bubbleColors = setInterval(addBubbles, 2000);
}

function addBubbles() {
  var bubbleColor = colors[Math.floor(Math.random() * (colors.length - 1))];
  $('<div/>').addClass('bubble').appendTo('.game-board').css({
    'left': xCoordinate,
    'top': yCoordinate,
    'background-color': bubbleColor
  });
  $('.bubble').attr('value', `${bubbleColor}`);
  xCoordinate = `${Math.floor(Math.random() * 96)}%`;
  yCoordinate = `${Math.floor(Math.random() * 96)}%`;
}

function init() {
  console.log(xCoordinate, yCoordinate);
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
