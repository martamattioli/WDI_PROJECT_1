var colorDots = colorDots || {};

//For positioning
colorDots.viewportHeight = $(window).height();
colorDots.headerHeight = 71.27;
colorDots.otherAreaHeight = colorDots.viewportHeight * 0.15;

//For animations
colorDots.h1LettersCounter = 0;

//For STYLING
colorDots.colorCounter = 0;
colorDots.linkColorCounter = 1;

//For the game
//SCORE variables
colorDots.score = 0;
colorDots.highScore = [];
colorDots.lives = 3;
colorDots.pointsInARow = 0;

//Variable for color array
colorDots.colorsNextLevels = ['#F9F590', '#7FCFCD', '#F7A48A'];
colorDots.colors = ['#15A7A4', '#F1592A', '#F4EE34'];

//Variables for sounds
colorDots.soundsCounter = 0;
colorDots.sounds = ['Concussive_Guitar_Hit', 'Slide_Whistle_to_Drum', 'Tympani_Bing', 'Deflate', 'Metallic_Clank'];
colorDots.soundsOn = false;

//Variables for the central dot
colorDots.progressColorCounter = 0;
colorDots.dotColors;
colorDots.randomIntervals = Math.floor((Math.random() * (10000 - 2000 + 1)) + 2000);

//Bubbles positioning
colorDots.paddingNow;
colorDots.xCoordinate = xPositionExclude50();
colorDots.yCoordinate = yPositionExclude50();

//Bubble intervals variables
colorDots.bubbleIntervals;
colorDots.randomFreq = Math.floor((Math.random() * (1500 - 1000 + 1)) + 1000);
colorDots.timeOutBubble;
colorDots.bubbleIds = 0;
colorDots.timerIds = 0;
colorDots.removeDiv = 0;

//PAUSE GAME
colorDots.gamePaused = false;

//Postion values of bubbles
function xPositionExclude50() {
  colorDots.xCoordinate = Math.floor((Math.random() * (80 - 20 + 1)) + 20);
  if (colorDots.xCoordinate >= 40 && colorDots.xCoordinate <= 55) {
    xPositionExclude50();
  } else {
    return colorDots.xCoordinate;
  }
}

function yPositionExclude50() {
  colorDots.yCoordinate = Math.floor((Math.random() * (80 - 20 + 1)) + 20);
  if (colorDots.yCoordinate >= 40 && colorDots.yCoordinate <= 55) {
    yPositionExclude50();
  } else {
    return colorDots.yCoordinate;
  }
}

//GAME GLOBAL FUNCTIONS
function changeFreqOnScore() {
  console.log('changeFreqOnScore fired');
  if (colorDots.score < 5) { //freq at level 1
    colorDots.randomFreq = Math.floor((Math.random() * (1200 - 1000 + 1)) + 800);
  } else if (colorDots.score >= 5 && colorDots.score < 10) { //freq at level 2
    colorDots.randomFreq = Math.floor((Math.random() * (1000 - 600 + 1)) + 600);
  } else { //freq at level 3
    colorDots.randomFreq = Math.floor((Math.random() * (1000 - 500 + 1)) + 500);
  }
}

function changeLevelOnScore() { //Progress Levels
  if (colorDots.score === 5) {
    levelTwo(0);
  } else if (colorDots.score === 10) {
    levelTwo(1);
  } else if (colorDots.score === 13) {
    levelTwo(2);
  }
}

function levelTwo(num) { //Level 2
  colorDots.colors.push(colorDots.colorsNextLevels[num]);
}

//
//END VARIABLES
//

function init() {
  //Grab elements
  colorDots.html = $('html'); //MAIN CONTAINERS VARS
  colorDots.$container = $('.container');
  colorDots.$button = $('button');
  colorDots.$aLink = $('a');
  colorDots.$header = $('header'); //HEADER VARS
  colorDots.$h1Letters = $('h1 span');
  colorDots.$h1 = $('h1');
  colorDots.$headerH3 = $('header h3');
  colorDots.$startArea = $('.start-area'); //START AREA VARS
  colorDots.$startBtn = $('.start-area button');
  colorDots.$instructionsArea = $('.instructions-area'); //INSTRUCTIONS VARS
  colorDots.$instructionsLink = $('.start-area a');
  colorDots.$closeBtn = $('.instructions-area button');
  colorDots.$gameArea = $('.game-area'); //GAME VARS
  colorDots.$gameOn = $('.game-on');
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

  let bodyHeight = colorDots.viewportHeight - colorDots.$header.outerHeight();
  let boardHeight = bodyHeight - colorDots.otherAreaHeight - 20;

  function elementSizes() {
    var scrollPosition = [ //Block screen scroll
      self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
      self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    ];

    colorDots.html.data('scroll-position', scrollPosition);
    colorDots.html.data('previous-overflow', colorDots.html.css('overflow'));
    colorDots.html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    bodyHeight = colorDots.viewportHeight - colorDots.$header.outerHeight();
    colorDots.otherAreaHeight = colorDots.viewportHeight * 0.15;
    boardHeight = colorDots.viewportHeight - colorDots.headerHeight - colorDots.otherAreaHeight - 20;

    //Main container
    $(colorDots.$container).height(colorDots.viewportHeight);

    //Title Area
    var headerPadding = (colorDots.headerHeight - 30) / 2;
    $(colorDots.$header).css('padding', `${headerPadding}`);

    //Game Area
    $(colorDots.$gameArea).height(bodyHeight).css('padding', `${headerPadding}`);
    //Game board
    $($gameBoard).height(boardHeight);

    //Game over height
    $($gameOver).height(bodyHeight).css('padding', `${(bodyHeight - 210) / 2}`);
  }

  elementSizes();

  $( window ).resize(elementSizes);

  function bounceLetters() { //Each letter of the title bouces in
    $(colorDots.$h1Letters[colorDots.h1LettersCounter]).css('opacity', '1').addClass('animated bounce');

    colorDots.h1LettersCounter++;

    if (colorDots.h1LettersCounter === colorDots.$h1Letters.length) {
      clearInterval(bounceLetters);
    }
  }

  function startButtonAppear() {
    $(colorDots.$startArea).height(bodyHeight).css('display', 'block').addClass('animated bounceInUp');
    const startAreaPadding = (bodyHeight - colorDots.$startBtn.outerHeight() - colorDots.$instructionsLink.outerHeight()) / 2;
    $(colorDots.$startArea).css('padding', `${startAreaPadding}`);
  }

  function pushUpTitle() { //Title and start btn go up
    $(colorDots.$h1).animate({marginTop: '0%'}, 1000); //Btn goes up
    setTimeout(startButtonAppear, 1000); //startBtn goes up
  }

  let closeLogic = 0;

  function disappearInstructions() { //Close Instructions
    $(colorDots.$instructionsArea).fadeOut(2000);
    if (closeLogic === 1) { //if you were in the homepage
      $(colorDots.$startArea).fadeIn(); //get startArea to appear
      closeLogic = 0;
    } else if (closeLogic === 2) { //if you were in the game
      pauseGame();
      $(colorDots.$gameOn).fadeIn(); //get Game to appear
      closeLogic = 0;
    }
  }

  function appearInstructions() { //Open Instructions

    if (this === colorDots.$instructionsLink[0]) {
      closeLogic = 1;
      $(colorDots.$startArea).fadeOut(1000);
    } else if (this === $inGameInstrLink[0]) {
      if (colorDots.gamePaused === false) {
        pauseGame();
      }
      closeLogic = 2;
      $(colorDots.$gameOn).fadeOut(1000);
    }

    $(colorDots.$instructionsArea).fadeIn(3000);

    //Instructions
    const $instructionsHeight = $('.instructions').height();
    const $instructionsH2Height = $('.instructions-area h2').height();
    const $closeBtnHeight = $(colorDots.$closeBtn).outerHeight();

    $(colorDots.$instructionsArea).height(bodyHeight).css('padding', `${(bodyHeight - $instructionsH2Height - $instructionsHeight - $closeBtnHeight) / 2}`);

    $(colorDots.$closeBtn).on('click', disappearInstructions);
  }

  //BUTTON

  function changeButtonColor(e) {
    $(e.target).css({'background-color': colorDots.colors[colorDots.colorCounter]});
    colorDots.colorCounter++;

    if (colorDots.colorCounter === colorDots.colors.length) {
      colorDots.colorCounter = 0;
    }
  }

  function changeLinkColor(e) {
    $(e.target).css({'color': colorDots.colors[colorDots.linkColorCounter]});
    console.log(colorDots.linkColorCounter);
    colorDots.linkColorCounter++;

    if (colorDots.linkColorCounter === colorDots.colors.length) {
      colorDots.linkColorCounter = 0;
    }
  }

  //GAME LOGIC
  //Intervals for the central dot
  function startDotInterval() {
    clearInterval(colorDots.dotColors);
    colorDots.dotColors = setInterval(changeDotColor, colorDots.randomIntervals);
  }

  function changeDotColor() {
    $($centerDot).css('background', colorDots.colors[colorDots.progressColorCounter]).attr('value', colorDots.colors[colorDots.progressColorCounter]);
    //Progress colors index at random
    colorDots.progressColorCounter = Math.floor(Math.random() * (colorDots.colors.length));
    //Reassign a random number between 2 seconds and 12 seconds
    colorDots.randomIntervals = Math.floor((Math.random() * (7000 - 2000 + 1)) + 2000);
  }

  function checkIfAlive() {
    if (colorDots.lives === 0) {
      $($bubble).off('click');
      stopIntervals();
      gameOver();
    }
  }

  //If click event hasn't fired
  function checkClickEvent() {
    if ($(`#${colorDots.timerIds}`).attr('value') === $($centerDot).attr('value')) {
      $(`#life-${colorDots.lives}`).css('opacity', '0.3');
      colorDots.lives--;
      console.log(`lives if click hasn't happened: ${colorDots.lives}`);
      checkIfAlive();
    }
  }

  //Stop intervals when game is OVER
  function stopIntervals() {
    clearTimeout(levelTwo);
    clearInterval(colorDots.dotColors);
    clearInterval(colorDots.bubbleIntervals);
  }

  //To sort high score array
  function sortHighscore() {
    colorDots.highScore.sort(function(a, b){
      return a-b;
    });
  }

  //Brings lives background
  function bringLivesBack() {
    $($lives).css('opacity', '1').toggleClass('animated pulse');
  }

  //GAME OVER
  function gameOver() {
    colorDots.colors.splice(3);
    colorDots.highScore.push(colorDots.score);
    sortHighscore();
    //display high score - do not reset it
    $($highScoreH3).html(colorDots.highScore[colorDots.highScore.length - 1]);

    //reset score to 0
    setTimeout(function() {
      colorDots.score = 0;
      $($score).html(colorDots.score);
    }, 500);

    //reset lives to 3 and make hearts appear again
    colorDots.lives = 3;
    setTimeout(bringLivesBack, 3000);

    //Reset the colors array back to the original colors:
    colorDots.colors = ['#15A7A4', '#F1592A', '#F4EE34'];

    //Make board disappear and make game over message appear
    $(colorDots.$gameArea).fadeOut('slow');
    $($gameOver).toggleClass('animated bounceInUp').css('display', 'block');

    //Stop intervals
    stopIntervals();

    setTimeout(function() {
      $($playAgain).addClass('animated bounceInUp').css('display', 'inline-block');
    }, 2000);

    function reset() {
      //Reset the colors array back to the original colors:
      colorDots.colors = ['#15A7A4', '#F1592A', '#F4EE34'];

      //Reset lives and score
      colorDots.lives = 3;
      colorDots.score = 0;
      bringLivesBack();

      //Reset reandomFreq back to how it was before the levels advance
      colorDots.randomFreq = Math.floor((Math.random() * (1500 - 1000 + 1)) + 1000);

      //Make game over message disappear and game board appear
      $($gameOver).fadeOut('slow').css('display', 'none');
      $(colorDots.$gameArea).fadeIn('slow');
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
    clearInterval(colorDots.bubbleIntervals);
    colorDots.bubbleIntervals = setInterval(addBubbles, colorDots.randomFreq);
  }

  //Function to make bubbles disappear after 4 seconds
  function disappearBubbles() {
    if (colorDots.gamePaused === true) {
      clearTimeout(colorDots.timeOutBubble);
    }
    $(`#${colorDots.timerIds}`).addClass('animated zoomOut');
    setTimeout( function() {
      //If click event doesn't happen --> remove a life
      if (colorDots.lives > 0) {
        checkClickEvent();
      }
      $(`#${colorDots.removeDiv}`).remove();
      colorDots.removeDiv++;
    }, 3000);
    colorDots.timerIds++;
  }

  function createABubble() {
    var bubbleColor = colorDots.colors[Math.floor(Math.random() * (colorDots.colors.length))];

    $('<div/>').addClass('bubble').attr('id', `${colorDots.bubbleIds}`).attr('value', `${bubbleColor}`).addClass('animated zoomIn').appendTo($gameBoard).css({
      'left': `${colorDots.xCoordinate}%`,
      'top': `${colorDots.yCoordinate}%`,
      'background-color': bubbleColor,
      'padding': Math.floor((Math.random() * (30 - 10 + 1)) + 10)
    }).one('click', checkColor);
  }

  function addBubbles() {
    createABubble(); //add bubbles

    colorDots.xCoordinate = xPositionExclude50();
    colorDots.yCoordinate = yPositionExclude50();

    //Fade out and remove divs
    colorDots.timeOutBubble = setTimeout(disappearBubbles, 4000);
    colorDots.bubbleIds++;

    //Give a new random number between 1 and 3 seconds to the frequency of bubble appearance
    changeFreqOnScore();
  }

  function soundOnOff() {
    if (colorDots.soundsOn === false) {
      $('audio').data('muted',false);
      $($soundIcon).removeClass('fa-volume-off').addClass('fa-volume-up');
      colorDots.soundsOn = true;
    } else if (colorDots.soundsOn === true) {
      $('audio').data('muted',true);
      $($soundIcon).removeClass('fa-volume-up').addClass('fa-volume-off');
      colorDots.soundsOn = false;
    }
  }

  function playAudio() {
    if (colorDots.soundsOn === true) {
      new Audio(`./sounds/${colorDots.sounds[colorDots.soundsCounter]}.mp3`).play();
      if (colorDots.soundsCounter === colorDots.sounds.length - 1) {
        colorDots.soundsCounter = 0;
      } else {
        colorDots.soundsCounter++;
      }
    }
  }

  function checkColor(e) {
    $(e.target).off('click');
    playAudio();
    if ($(e.target).attr('value') === $($centerDot).attr('value')) {
      colorDots.score++;
      $($score).html(colorDots.score);
      $(e.target).remove();

      //If the user made 10 points in a row and their lives are less than 3 --> add one life
      colorDots.pointsInARow++;
      if (colorDots.lives < 3 && colorDots.pointsInARow === 10) {
        colorDots.lives++;
        $(`#life-${colorDots.lives}`).fadeIn();
      } else if (colorDots.lives === 3 && colorDots.pointsInARow === 10) {
        colorDots.pointsInARow = 0;
      }
    } else {
      $(`#life-${colorDots.lives}`).css('opacity', '0.3');
      colorDots.lives--;
      $(e.target).remove();

      //If user makes a mistake, reset points in a row:
      colorDots.pointsInARow = 0;

      checkIfAlive();
    }

    changeLevelOnScore();
  }

  function pauseGame() {
    if (colorDots.gamePaused === false) {
      //stop the interval
      clearInterval(colorDots.dotColors);
      clearInterval(colorDots.bubbleIntervals);
      colorDots.gamePaused = true;
      $($pauseBtn).text('PAUSED');
    } else {
      // reactivate interval
      startDotInterval();
      appearBubbles();
      colorDots.gamePaused = false;
      $($pauseBtn).text('PAUSE');
    }
  }

  function showGame() {
    $(colorDots.$startArea).css('display', 'none');
    $(colorDots.$h1).css('display', 'inline-block');
    $(colorDots.$headerH3).css('display', 'inline-block');
    $(colorDots.$gameOn).addClass('animated bounceInUp');

    $(colorDots.$gameArea).css('display', 'block');
    if ($(window).width() < 530) {
      $(colorDots.$h1).css('text-align', 'left');
    }
    const $pauseBtnHeight = $($pauseBtn).outerHeight();
    const otherAreaPadding = (colorDots.otherAreaHeight - $pauseBtnHeight) / 2;

    $($otherArea).height(colorDots.otherAreaHeight).css('padding', `${otherAreaPadding}`);

    $($centerDot).css('background', colorDots.colors[colorDots.progressColorCounter]).attr('value', colorDots.colors[colorDots.progressColorCounter]);
    startDotInterval();
    setTimeout(appearBubbles, 2000);
  }

  const bounceInterval = setInterval(bounceLetters, 200);
  setTimeout(pushUpTitle, 3000);

  $(colorDots.$instructionsLink).on('click', appearInstructions);
  $(colorDots.$startBtn).on('click', showGame);
  $($inGameInstrLink).on('click', appearInstructions);
  $($pauseBtn).on('click', pauseGame);
  colorDots.$button.on('mouseover', changeButtonColor);
  colorDots.$aLink.on('mouseover', changeLinkColor);
  $($soundIcon).on('click', soundOnOff);
}

$(init);
