//SCORE variables
var score = 0;
var highScore = [];
var lives = 3;
var pointsInARow = 0;

//Variable for color array
var colorsNextLevels = ['pink', 'blue', 'white'];
var colors = ['red', 'yellow', 'green'];

//Variables for the central dot
var progressColorCounter = 0;
var dotColors;
var randomIntervals = Math.floor((Math.random() * (10000 - 2000 + 1)) + 2000);

//Bubbles positioning
// !!!!!!! Not sure why, but sometimes it gives me undefined %
var paddingNow;
var xCoordinate = `${xPositionExclude50()}%`;
var yCoordinate = `${yPositionExclude50()}%`;

//Bubble intervals variables
var bubbleIntervals;
var randomFreq = Math.floor((Math.random() * (1500 - 1000 + 1)) + 1000);
var timeOutBubble;
var bubbleIds = 0;
var timerIds = 0;
var removeDiv = 0;

//PAUSE GAME
var gamePaused = false;

//Postion values of bubbles
function xPositionExclude50() {
  xCoordinate = Math.floor((Math.random() * (80 - 20 + 1)) + 20);
  if (xCoordinate >= 40 && xCoordinate <= 55) {
    yPositionExclude50();
  } else {
    return xCoordinate;
  }
}

function yPositionExclude50() {
  yCoordinate = Math.floor((Math.random() * (80 - 20 + 1)) + 20);
  if (yCoordinate >= 40 && yCoordinate <= 55) {
    yPositionExclude50();
  } else {
    return yCoordinate;
  }
}

//Intervals for the central dot
function startDotInterval() {
  clearInterval(dotColors);
  dotColors = setInterval(changeDotColor, randomIntervals);
}

function changeDotColor() {
  $('.center-dot').css('background', colors[progressColorCounter]).attr('value', colors[progressColorCounter]);
  //Progress colors index at random
  progressColorCounter = Math.floor(Math.random() * (colors.length));
  //Reassign a random number between 2 seconds and 12 seconds
  randomIntervals = Math.floor((Math.random() * (10000 - 2000 + 1)) + 2000);
}

//Add levels to the game:
function levelOne() {
  colors.push(colorsNextLevels[0]);
  console.log(colors);
}

function levelTwo() {
  colors.push(colorsNextLevels[1]);
  console.log(colors);
}

function levelThree() {
  colors.push(colorsNextLevels[2]);
  console.log(colors);
}

//If click event hasn't fired
function checkClickEvent() {
  if ($(`#${timerIds}`).attr('value') === $('.center-dot').attr('value')) {
    $(`#life-${lives}`).fadeOut();
    lives--;
    console.log(`lives if click hasn't happened: ${lives}`);
    if (lives === 0) {
      $('.bubble').off('click');
      stopIntervals();
      gameOver();
    }
  }
}

//Stop intervals when game is OVER
function stopIntervals() {
  console.log('stopIntervals() has fired');
  clearTimeout(levelOne);
  clearTimeout(levelTwo);
  clearTimeout(levelThree);
  clearInterval(dotColors);
  clearInterval(bubbleIntervals);
  // dotColors = 0;
  // bubbleIntervals = 0;
}

//To sort high score array
function sortHighscore() {
  highScore.sort(function(a, b){
    return a-b;
  });
}

//GAME OVER
function gameOver() {
  console.log('Game OVER');
  colors.splice(3);
  console.log(colors);

  highScore.push(score);
  console.log(`High score array: ${highScore}`);
  sortHighscore();
  console.log(`High score array after sort: ${highScore}`);
  //display high score - do not reset it
  $('#highest-score').html(highScore[highScore.length - 1]);

  //reset score to 0
  setTimeout(function() {
    score = 0;
    $('#score').html(score);
  }, 1000);

  //reset lives to 3 and make hearts appear again
  lives = 3;
  setTimeout(function() {
    $(`.lives`).fadeIn();
  }, 1000);

  //Reset the colors array back to the original colors:
  colors = ['red', 'yellow', 'green'];

  //Make board disappear and make game over message appear
  $('.container').fadeOut('slow');
  $('.game-over').fadeIn('slow');

  //Stop intervals
  stopIntervals();

  setTimeout(function() {
    $('.play-again').fadeIn('slow').css('display', 'inline-block');
  }, 2000);

  //If user clicks on PLAY AGAIN BUTTON
  $('.play-again').on('click', () => {
    //Reset the colors array back to the original colors:
    colors = ['red', 'yellow', 'green'];

    //Reset lives and score
    lives = 3;
    score = 0;

    //Reset reandomFreq back to how it was before the levels advance
    randomFreq = Math.floor((Math.random() * (1500 - 1000 + 1)) + 1000);

    //Make game over message disappear and game board appear
    $('.game-over').fadeOut('slow');
    $('.container').fadeIn('slow');
    //Reactivate intervals for bubbles and center-dot
    startDotInterval();
    setTimeout(appearBubbles, 2000);
  });
}

//Intervals for various bubbles
//Make bubbles appear on the screen on set intervals
function appearBubbles() {
  clearInterval(bubbleIntervals);
  bubbleIntervals = setInterval(addBubbles, randomFreq);
}

//Function to make bubbles disappear after 4 seconds
function disappearBubbles() {
  if (gamePaused === true) {
    clearTimeout(timeOutBubble);
  }
  $(`#${timerIds}`).fadeOut(2000);
  setTimeout( function() {
    //If click event doesn't happen --> remove a life
    if (lives > 0) {
      checkClickEvent();
    }
    $(`#${removeDiv}`).remove();
    removeDiv++;
  }, 3000);
  timerIds++;
}

function addBubbles() {
  var bubbleColor = colors[Math.floor(Math.random() * (colors.length))];
  $('<div/>').addClass('bubble').attr('id', `${bubbleIds}`).attr('value', `${bubbleColor}`).fadeIn(1000).appendTo('.game-board').css({
    'left': xCoordinate,
    'top': yCoordinate,
    'background-color': bubbleColor,
    'padding': Math.floor((Math.random() * (30 - 10 + 1)) + 10)
  }).one('click', checkColor);
  //!!!!!!! SOMETIMES XCOORDINATE AND Y COORDINATE ARE UNDEFINED... WHY??
  // console.log(xCoordinate, yCoordinate);

  xCoordinate = `${xPositionExclude50()}%`;
  yCoordinate = `${yPositionExclude50()}%`;

  //Fade out and remove divs
  timeOutBubble = setTimeout(disappearBubbles, 4000);
  bubbleIds++;

  //Give a new random number between 1 and 3 seconds to the frequency of bubble appearance
  if (score < 5) {
    //freq at level 1
    randomFreq = Math.floor((Math.random() * (1200 - 1000 + 1)) + 800);
  } else if (score >= 5 && score < 10) {
    //freq at level 2
    randomFreq = Math.floor((Math.random() * (1000 - 600 + 1)) + 600);
  } else {
    //freq at level 3
    randomFreq = Math.floor((Math.random() * (1000 - 500 + 1)) + 500);
  }
}

function checkColor(e) {
  $(e.target).off('click');
  if ($(e.target).attr('value') === $('.center-dot').attr('value')) {
    console.log(`clickedVal: ${$(e.target).attr('id')}`, `dotVal: ${$('.center-dot').attr('value')}`, 'YAY');
    score++;
    $('#score').html(score);
    $(e.target).remove();

    //If the user made 10 points in a row and their lives are less than 3 --> add one life
    pointsInARow++;
    console.log(`pointsInARow: ${pointsInARow}`);
    if (lives < 3 && pointsInARow === 10) {
      lives++;
      $(`#life-${lives}`).fadeIn();
    } else if (lives === 3 && pointsInARow === 10) {
      pointsInARow = 0;
    }
  } else {
    console.log(`clickedVal: ${$(e.target).attr('value')}`, `dotVal: ${$('.center-dot').attr('value')}`, 'OH NO');
    $(`#life-${lives}`).fadeOut();
    lives--;
    console.log(`Score: ${score}`);
    // console.log(`Lives: ${lives}`);
    $(e.target).remove();

    //If user makes a mistake, reset points in a row:
    pointsInARow = 0;

    if (lives === 0) {
      $('.bubble').off('click');
      clearInterval(dotColors);
      clearInterval(bubbleIntervals);
      lives = 3;
      gameOver();
    }
  }

  if (score === 5) {
    levelOne();
  } else if (score === 10) {
    levelTwo();
  } else if (score === 13) {
    levelThree();
  }
}

function init() {
  // When user clicks START, the button disappears
  // In place there is a circle in the middle
  $('.start-button').on('click', () => {
    $('.start-button').css('display', 'none');
    $('.center-dot').css('display', 'inline-block');
    $('p').css('display', 'block');
    $('.score-div').css('display', 'block');
    $('#pause-game').css('display', 'block');
    $('.center-dot').css('background', colors[progressColorCounter]).attr('value', colors[progressColorCounter]);
    startDotInterval();
    setTimeout(appearBubbles, 2000);
  });

  $('#pause-game').on('click', () => {
    if (gamePaused === false) {
      //stop the interval
      clearInterval(dotColors);
      clearInterval(bubbleIntervals);
      gamePaused = true;
      console.log(gamePaused, 'the game should pause');
    } else {
      console.log(gamePaused, 'before reactivate interval');
      // reactivate interval
      startDotInterval();
      appearBubbles();
      gamePaused = false;
      console.log(gamePaused, 'the game should reactivate');
    }
  });
}

$(init);
