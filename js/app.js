// When user clicks START, the button disappears
// In place there is a circle in the middle
// Every random seconds the circle changes color

//SCORE variables
var score = 0;
var highScore = [];
var lives = 3;

//Variable for color array
var colors = ['red', 'yellow', 'green'];

//Variables for the central dot
var progressColorCounter = 0;
var dotColors;
var randomIntervals = Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;

//Bubbles positioning
// !!!!!!! Not sure why, but sometimes it gives me undefined %
var paddingNow;
var xCoordinate = `${xPositionExclude50()}%`;
var yCoordinate = `${yPositionExclude50()}%`;

//Bubble intervals variables
var bubbleIntervals;
var randomFreq = Math.floor((Math.random() * (3000 - 1000 + 1)) + 1000);
var bubbleIds = 0;
var timerIds = 0;
var removeDiv = 0;

function xPositionExclude50() {
  xCoordinate = Math.floor((Math.random() * (80 - 10 + 1)) + 20);
  if (xCoordinate >= 47 && xCoordinate <= 53) {
    yPositionExclude50();
  } else {
    return xCoordinate;
  }
}

function yPositionExclude50() {
  yCoordinate = Math.floor((Math.random() * (80 - 10 + 1)) + 20);
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
  progressColorCounter = Math.floor(Math.random() * (colors.length));
  //Reassign a random number between 2 seconds and 12 seconds
  randomIntervals = Math.floor((Math.random() * (10000 - 2000 + 1)) + 2000);
}

//Intervals for various bubbles
//Make bubbles appear on the screen on set intervals
// !!!!!!!!!!!! MAKE THE 2000 TURN INTO INCREASING SPEED OF FILL UP
function appearBubbles() {
  bubbleIntervals = setInterval(addBubbles, randomFreq);
}

function addBubbles() {
  // var xCoordinate = `${xPositionExclude50()}%`;
  // var yCoordinate = `${yPositionExclude50()}%`;
  //
  // function xPositionExclude50() {
  //   xCoordinate = Math.floor((Math.random() * ((100 - paddingNow) - paddingNow + 1)) + paddingNow);
  //   if (xCoordinate >= 47 && xCoordinate <= 53) {
  //     yPositionExclude50();
  //   } else {
  //     return xCoordinate;
  //   }
  // }
  //
  // function yPositionExclude50() {
  //   yCoordinate = Math.floor((Math.random() * ((100 - paddingNow) - paddingNow + 1)) + paddingNow);
  //   if (yCoordinate >= 47 && yCoordinate <= 53) {
  //     yPositionExclude50();
  //   } else {
  //     return yCoordinate;
  //   }
  // }

  var bubbleColor = colors[Math.floor(Math.random() * (colors.length))];
  $('<div/>').addClass('bubble').attr('id', `${bubbleIds}`).attr('value', `${bubbleColor}`).fadeIn(3000).appendTo('.game-board').css({
    'left': xCoordinate,
    'top': yCoordinate,
    'background-color': bubbleColor,
    'padding': Math.floor((Math.random() * (30 - 10 + 1)) + 10)
  });
  //!!!!!!! SOMETIMES XCOORDINATE AND Y COORDINATE ARE UNDEFINED... WHY??
  // console.log(xCoordinate, yCoordinate);

  //!!!!!! with paddingNow, I'm trying to make sure that the cicles don't go out of the light grey box -->
  //the problem now is that at some point something break, but I'm not sure what... the console logs start to go mental
  // console.log(`Log padding: ${parseFloat($(`#${bubbleIds}`).css('padding').slice(0, -2))}`);
  // console.log(`Log posX: ${xPositionExclude50()}%; Log posY: ${yPositionExclude50()}%;`);
  // var getBubblepadding = parseFloat($(`#${bubbleIds}`).css('padding').slice(0, -2));
  // paddingNow = getBubblepadding * 2;

  xCoordinate = `${xPositionExclude50()}%`;
  yCoordinate = `${yPositionExclude50()}%`;

  //Fade out and remove divs
  setTimeout(function() {
    $(`#${timerIds}`).fadeOut(3000);
    setTimeout( function() {
      $(`#${removeDiv}`).remove();
      removeDiv++;
    }, 3000);
    timerIds++;
  }, 3000);
  bubbleIds++;

  //Add event listener to IDs --> if value of center-dot === value of clicked item, success // else game over
  $('.bubble').one('click', checkColor);

  //Give a new random number between 1 and 3 seconds to the frequency of bubble appearance
  randomFreq = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
}

function checkColor(e) {
  if ($(e.target).attr('value') === $('.center-dot').attr('value')) {
    console.log(`Clicked value: ${$(e.target).attr('value')}`, `Center Dot: ${$('.center-dot').attr('value')}`, 'YAY');
    score++;
    console.log(score);
    $('#score').html(score);
    $(e.target).remove();
  } else {
    console.log(`Clicked value: ${$(e.target).attr('value')}`, `Center Dot: ${$('.center-dot').attr('value')}`, 'OH NO');
    $(`#life-${lives}`).fadeOut();
    lives--;
    $(e.target).remove();
    if (lives === 0) {
      console.log('Game OVER');
      highScore.push(score);
      highScore.sort(function(a, b) {
        return a-b;
      });
      //display high score - do not reset it
      $('#highest-score').html(highScore[highScore.length - 1]);
      //reset lives to 3 and make hearts appear again
      lives = 3;
      $(`.lives`).fadeIn();
      //reset score to 0
      score = 0;
      //Stop intervals
      
      //Make board disappear and make game over message appear
      $('.game-board').fadeOut('slow');
      $('.game-over').fadeIn('slow');
      $('.play-again').on('click', () => {
        //Make game over message disappear and game board appear

        //Reactivate intervals for bubbles and center-dot

      });
    }
  }
}

function init() {
  // for (var i = 0; i < 100; i++) {
  //   console.log(Math.floor((Math.random() * (80 - 10 + 1)) + 10));
  // }
  // When user clicks START, the button disappears
  // In place there is a circle in the middle
  $('.start-button').on('click', () => {
    $('.start-button').css('display', 'none');
    $('.center-dot').css('display', 'inline-block');
    $('p').css('display', 'block');
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
