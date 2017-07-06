//For positioning
var viewportHeight = $(window).height();
var headerHeight = 71.27;
var otherAreaHeight = viewportHeight * 0.15;

//For animations
let h1LettersCounter = 0;

//For STYLING
let colorCounter = 0;
let linkColorCounter = 1;

//For the game
//SCORE variables
var score = 0;
var highScore = [];
var lives = 3;
var pointsInARow = 0;

//Variable for color array
var colorsNextLevels = ['#F9F590', '#7FCFCD', '#F7A48A'];
var colors = ['#15A7A4', '#F1592A', '#F4EE34'];

//Variables for sounds
var soundsCounter = 0;
var sounds = ['Concussive_Guitar_Hit', 'Slide_Whistle_to_Drum', 'Tympani_Bing', 'Deflate', 'Metallic_Clank'];
var soundsOn = false;

//Variables for the central dot
var progressColorCounter = 0;
var dotColors;
var randomIntervals = Math.floor((Math.random() * (10000 - 2000 + 1)) + 2000);

//Bubbles positioning
var paddingNow;
var xCoordinate = xPositionExclude50();
var yCoordinate = yPositionExclude50();

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
    xPositionExclude50();
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

//GAME GLOBAL FUNCTIONS
function changeFreqOnScore() {
  console.log('changeFreqOnScore fired');
  if (score < 5) { //freq at level 1
    randomFreq = Math.floor((Math.random() * (1200 - 1000 + 1)) + 800);
  } else if (score >= 5 && score < 10) { //freq at level 2
    randomFreq = Math.floor((Math.random() * (1000 - 600 + 1)) + 600);
  } else { //freq at level 3
    randomFreq = Math.floor((Math.random() * (1000 - 500 + 1)) + 500);
  }
}

function changeLevelOnScore() { //Progress Levels
  if (score === 5) {
    levelTwo(0);
  } else if (score === 10) {
    levelTwo(1);
  } else if (score === 13) {
    levelTwo(2);
  }
}

function levelTwo(num) { //Level 2
  colors.push(colorsNextLevels[num]);
}

//
//END VARIABLES
//

function init() {
  //Grab elements
  const html = $('html'); //MAIN CONTAINERS VARS
  const $container = $('.container');
  const $button = $('button');
  const $aLink = $('a');
  const $header = $('header'); //HEADER VARS
  const $h1Letters = $('h1 span');
  const $h1 = $('h1');
  const $headerH3 = $('header h3');
  const $startArea = $('.start-area'); //START AREA VARS
  const $startBtn = $('.start-area button');
  const $instructionsArea = $('.instructions-area'); //INSTRUCTIONS VARS
  const $instructionsLink = $('.start-area a');
  const $closeBtn = $('.instructions-area button');
  const $gameArea = $('.game-area'); //GAME VARS
  const $gameOn = $('.game-on');
  const $score = $('#score');
  const $centerDot = $('.center-dot');
  const $bubble = $('.bubble');
  const $lives = $('.lives');
  const $pauseBtn = $('#pause');
  const $soundIcon = $('i');
  const $otherArea = $('.other-area');
  const $inGameInstrLink = $('.instructions-link a');
  const $gameBoard = $('.game-board');
  const $gameOver = $('.game-over');
  const $playAgain = $('.play-again');
  const $highScoreH3 = $('.high-score');

  let bodyHeight = viewportHeight - $header.outerHeight();
  let boardHeight = bodyHeight - otherAreaHeight - 20;

  function elementSizes() {
    var scrollPosition = [ //Block screen scroll
      self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    ];

    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    bodyHeight = viewportHeight - $header.outerHeight();
    otherAreaHeight = viewportHeight * 0.15;
    boardHeight = viewportHeight - headerHeight - otherAreaHeight - 20;

    //Main container
    $($container).height(viewportHeight);

    //Title Area
    var headerPadding = (headerHeight - 30) / 2;
    $($header).css('padding', `${headerPadding}`);

    //Game Area
    $($gameArea).height(bodyHeight).css('padding', `${headerPadding}`);
    //Game board
    $($gameBoard).height(boardHeight);

    //Game over height
    $($gameOver).height(bodyHeight).css('padding', `${(bodyHeight - 210) / 2}`);
  }

  elementSizes();

  $( window ).resize(elementSizes);

  function bounceLetters() { //Each letter of the title bouces in
    $($h1Letters[h1LettersCounter]).css('opacity', '1').addClass('animated bounce');

    h1LettersCounter++;

    if (h1LettersCounter === $h1Letters.length) {
      clearInterval(bounceLetters);
    }
  }

  function startButtonAppear() {
    $($startArea).height(bodyHeight).css('display', 'block').addClass('animated bounceInUp');
    const startAreaPadding = (bodyHeight - $startBtn.outerHeight() - $instructionsLink.outerHeight()) / 2;
    $($startArea).css('padding', `${startAreaPadding}`);
  }

  function pushUpTitle() { //Title and start btn go up
    $($h1).animate({marginTop: '0%'}, 1000); //Btn goes up
    setTimeout(startButtonAppear, 1000); //startBtn goes up
  }

  let closeLogic = 0;

  function disappearInstructions() { //Close Instructions
    $($instructionsArea).fadeOut(2000);
    if (closeLogic === 1) { //if you were in the homepage
      $($startArea).fadeIn(); //get startArea to appear
      closeLogic = 0;
    } else if (closeLogic === 2) { //if you were in the game
      pauseGame();
      $($gameOn).fadeIn(); //get Game to appear
      closeLogic = 0;
    }
  }

  function appearInstructions() { //Open Instructions

    if (this === $instructionsLink[0]) {
      closeLogic = 1;
      $($startArea).fadeOut(1000);
    } else if (this === $inGameInstrLink[0]) {
      if (gamePaused === false) {
        pauseGame();
      }
      closeLogic = 2;
      $($gameOn).fadeOut(1000);
    }

    $($instructionsArea).fadeIn(3000);

    //Instructions
    const $instructionsHeight = $('.instructions').height();
    const $instructionsH2Height = $('.instructions-area h2').height();
    const $closeBtnHeight = $($closeBtn).outerHeight();

    $($instructionsArea).height(bodyHeight).css('padding', `${(bodyHeight - $instructionsH2Height - $instructionsHeight - $closeBtnHeight) / 2}`);

    $($closeBtn).on('click', disappearInstructions);
  }

  //BUTTON

  function changeButtonColor(e) {
    $(e.target).css({'background-color': colors[colorCounter]});
    colorCounter++;

    if (colorCounter === colors.length) {
      colorCounter = 0;
    }
  }

  function changeLinkColor(e) {
    $(e.target).css({'color': colors[linkColorCounter]});
    console.log(linkColorCounter);
    linkColorCounter++;

    if (linkColorCounter === colors.length) {
      linkColorCounter = 0;
    }
  }

  //GAME LOGIC
  //Intervals for the central dot
  function startDotInterval() {
    clearInterval(dotColors);
    dotColors = setInterval(changeDotColor, randomIntervals);
  }

  function changeDotColor() {
    $($centerDot).css('background', colors[progressColorCounter]).attr('value', colors[progressColorCounter]);
    //Progress colors index at random
    progressColorCounter = Math.floor(Math.random() * (colors.length));
    //Reassign a random number between 2 seconds and 12 seconds
    randomIntervals = Math.floor((Math.random() * (7000 - 2000 + 1)) + 2000);
  }

  function checkIfAlive() {
    if (lives === 0) {
      $($bubble).off('click');
      stopIntervals();
      gameOver();
    }
  }

  //If click event hasn't fired
  function checkClickEvent() {
    if ($(`#${timerIds}`).attr('value') === $($centerDot).attr('value')) {
      $(`#life-${lives}`).css('opacity', '0.3');
      lives--;
      console.log(`lives if click hasn't happened: ${lives}`);
      checkIfAlive();
    }
  }

  //Stop intervals when game is OVER
  function stopIntervals() {
    clearTimeout(levelTwo);
    clearInterval(dotColors);
    clearInterval(bubbleIntervals);
  }

  //To sort high score array
  function sortHighscore() {
    highScore.sort(function(a, b){
      return a-b;
    });
  }

  //Brings lives background
  function bringLivesBack() {
    $($lives).css('opacity', '1').toggleClass('animated pulse');
  }

  //GAME OVER
  function gameOver() {
    colors.splice(3);
    highScore.push(score);
    sortHighscore();
    //display high score - do not reset it
    $($highScoreH3).html(highScore[highScore.length - 1]);

    //reset score to 0
    setTimeout(function() {
      score = 0;
      $($score).html(score);
    }, 500);

    //reset lives to 3 and make hearts appear again
    lives = 3;
    setTimeout(bringLivesBack, 3000);

    //Reset the colors array back to the original colors:
    colors = ['#15A7A4', '#F1592A', '#F4EE34'];

    //Make board disappear and make game over message appear
    $($gameArea).fadeOut('slow');
    $($gameOver).toggleClass('animated bounceInUp').css('display', 'block');

    //Stop intervals
    stopIntervals();

    setTimeout(function() {
      $($playAgain).addClass('animated bounceInUp').css('display', 'inline-block');
    }, 2000);

    function reset() {
      //Reset the colors array back to the original colors:
      colors = ['#15A7A4', '#F1592A', '#F4EE34'];

      //Reset lives and score
      lives = 3;
      score = 0;
      bringLivesBack();

      //Reset reandomFreq back to how it was before the levels advance
      randomFreq = Math.floor((Math.random() * (1500 - 1000 + 1)) + 1000);

      //Make game over message disappear and game board appear
      $($gameOver).fadeOut('slow').css('display', 'none');
      $($gameArea).fadeIn('slow');
      //Reactivate intervals for bubbles and center-dot
      startDotInterval();
      setTimeout(appearBubbles, 2000);
    }

    //If user clicks on PLAY AGAIN BUTTON
    $($playAgain).on('click', reset);
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
    $(`#${timerIds}`).addClass('animated zoomOut');
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

  function createABubble() {
    var bubbleColor = colors[Math.floor(Math.random() * (colors.length))];

    $('<div/>').addClass('bubble').attr('id', `${bubbleIds}`).attr('value', `${bubbleColor}`).addClass('animated zoomIn').appendTo($gameBoard).css({
      'left': `${xCoordinate}%`,
      'top': `${yCoordinate}%`,
      'background-color': bubbleColor,
      'padding': Math.floor((Math.random() * (30 - 10 + 1)) + 10)
    }).one('click', checkColor);
  }

  function addBubbles() {
    createABubble(); //add bubbles

    xCoordinate = xPositionExclude50();
    yCoordinate = yPositionExclude50();

    //Fade out and remove divs
    timeOutBubble = setTimeout(disappearBubbles, 4000);
    bubbleIds++;

    //Give a new random number between 1 and 3 seconds to the frequency of bubble appearance
    changeFreqOnScore();
  }

  function soundOnOff() {
    if (soundsOn === false) {
      $('audio').data('muted',false);
      $($soundIcon).removeClass('fa-volume-off').addClass('fa-volume-up');
      soundsOn = true;
    } else if (soundsOn === true) {
      $('audio').data('muted',true);
      $($soundIcon).removeClass('fa-volume-up').addClass('fa-volume-off');
      soundsOn = false;
    }
  }

  function playAudio() {
    if (soundsOn === true) {
      new Audio(`./sounds/${sounds[soundsCounter]}.mp3`).play();
      if (soundsCounter === sounds.length - 1) {
        soundsCounter = 0;
      } else {
        soundsCounter++;
      }
    }
  }

  function checkColor(e) {
    $(e.target).off('click');
    playAudio();
    if ($(e.target).attr('value') === $($centerDot).attr('value')) {
      score++;
      $($score).html(score);
      $(e.target).remove();

      //If the user made 10 points in a row and their lives are less than 3 --> add one life
      pointsInARow++;
      if (lives < 3 && pointsInARow === 10) {
        lives++;
        $(`#life-${lives}`).fadeIn();
      } else if (lives === 3 && pointsInARow === 10) {
        pointsInARow = 0;
      }
    } else {
      $(`#life-${lives}`).css('opacity', '0.3');
      lives--;
      console.log(`Score: ${score}`);
      $(e.target).remove();

      //If user makes a mistake, reset points in a row:
      pointsInARow = 0;

      checkIfAlive();
    }

    changeLevelOnScore();
  }

  function pauseGame() {
    if (gamePaused === false) {
      //stop the interval
      clearInterval(dotColors);
      clearInterval(bubbleIntervals);
      gamePaused = true;
      $($pauseBtn).text('PAUSED');
    } else {
      // reactivate interval
      startDotInterval();
      appearBubbles();
      gamePaused = false;
      $($pauseBtn).text('PAUSE');
    }
  }

  function showGame() {
    $($startArea).css('display', 'none');
    $($h1).css('display', 'inline-block');
    $($headerH3).css('display', 'inline-block');
    $($gameOn).addClass('animated bounceInUp');

    $($gameArea).css('display', 'block');
    if ($(window).width() < 530) {
      $($h1).css('text-align', 'left');
    }
    const $pauseBtnHeight = $($pauseBtn).outerHeight();
    const otherAreaPadding = (otherAreaHeight - $pauseBtnHeight) / 2;

    $($otherArea).height(otherAreaHeight).css('padding', `${otherAreaPadding}`);

    $($centerDot).css('background', colors[progressColorCounter]).attr('value', colors[progressColorCounter]);
    startDotInterval();
    setTimeout(appearBubbles, 2000);
  }

  const bounceInterval = setInterval(bounceLetters, 200);
  setTimeout(pushUpTitle, 3000);

  $($instructionsLink).on('click', appearInstructions);
  $($startBtn).on('click', showGame);
  $($inGameInstrLink).on('click', appearInstructions);
  $($pauseBtn).on('click', pauseGame);
  $($button).on('mouseover', changeButtonColor);
  $($aLink).on('mouseover', changeLinkColor);
  $($soundIcon).on('click', soundOnOff);
}

$(init);
