// When user clicks START, the button disappears
// In place there is a circle in the middle
// Every random seconds the circle changes color

// Get random seconds in place of set amount of time

//Start intervals when the start button is clicked
var progressColorCounter = 0;
var colors = ['red', 'yellow', 'green', 'blue', 'pink'];
var dotColors;
var randomIntervals = Math.floor(Math.random() * 10000) + 2000;

//Bubbles positioning
var xCoordinate = `${Math.floor(Math.random() *100)} %`;
var yCoordinate = `${Math.floor(Math.random() *100)} %`;

function startInterval() {
  dotColors = setInterval(changeColor, randomIntervals);
}

function changeColor() {
  // console.log(randomIntervals);
  $('.center-dot').css('background', colors[progressColorCounter]);
  console.log(progressColorCounter);
  //Progress colors index at random
    //(This is to just progress by 1 --> Discard)
    // if (progressColorCounter === colors.length) {
    //   progressColorCounter = 0;
    // } else {
    //   progressColorCounter++;
    // }
  progressColorCounter = Math.floor(Math.random() * (colors.length - 1));

  //Reassign a random number between 2 seconds and 12 seconds
  randomIntervals = Math.floor(Math.random() * 10000) + 2000;
}

//Make bubbles appear on the screen
function appearBubbles() {
  console.log('timeout has fired');
  $('<div/>').addClass('bubble').appendTo('.game-board').css({'left': `${xCoordinate}`, 'top': `${yCoordinate}`});
}

function init() {
  // When user clicks START, the button disappears
  // In place there is a circle in the middle
  $('.start-button').on('click', () => {
    $('.start-button').css('display', 'none');
    $('.center-dot').css('display', 'inline-block');
    startInterval();
    setTimeout(appearBubbles, 2000);
  });
}

$(init);
