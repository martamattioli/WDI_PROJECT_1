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
colorDots.closeLogic = 0;

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
colorDots.xCoordinate;
colorDots.yCoordinate;

//Bubble intervals variables
colorDots.bubbleIntervals;
colorDots.randomFreq = Math.floor((Math.random() * (1500 - 1000 + 1)) + 1000);
colorDots.timeOutBubble;
colorDots.bubbleIds = 0;
colorDots.timerIds = 0;
colorDots.removeDiv = 0;
colorDots.disappearBubblesTime = 4000;


//PAUSE GAME
colorDots.gamePaused = false;

// --> FUNCTIONS <--

//ELEMENT SIZING
colorDots.elementSizes = function() {
  //VARIABLE DECLARATION
  colorDots.scrollPosition = [ //Block screen scroll
    self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
    self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
  ];
  colorDots.html.data('scroll-position', colorDots.scrollPosition);
  colorDots.html.data('previous-overflow', colorDots.html.css('overflow'));
  colorDots.html.css('overflow', 'hidden');
  window.scrollTo(colorDots.scrollPosition[0], colorDots.scrollPosition[1]);

  colorDots.bodyHeight = colorDots.viewportHeight - colorDots.$header.outerHeight();
  colorDots.otherAreaHeight = colorDots.viewportHeight * 0.15;
  colorDots.boardHeight = colorDots.viewportHeight - colorDots.headerHeight - colorDots.otherAreaHeight - 20;

  //Main container
  $(colorDots.$container).height(colorDots.viewportHeight);

  //Title Area
  colorDots.headerPadding = (colorDots.headerHeight - 30) / 2;
  $(colorDots.$header).css('padding', `${colorDots.headerPadding}`);

  //Game Area
  $(colorDots.$gameArea).height(colorDots.bodyHeight).css('padding', `${colorDots.headerPadding}`);
  //Game board
  $(colorDots.$gameBoard).height(colorDots.boardHeight);

  //Game over height
  $(colorDots.$gameOver).height(colorDots.bodyHeight).css('padding', `${(colorDots.bodyHeight - 210) / 2}`);
};

colorDots.bounceLetters = function() { //Each letter of the title bouces in
  $(colorDots.$h1Letters[colorDots.h1LettersCounter]).css('opacity', '1').addClass('animated bounce');

  colorDots.h1LettersCounter++;

  if (colorDots.h1LettersCounter === colorDots.$h1Letters.length) {
    clearInterval(colorDots.bounceLetters);
  }
};

colorDots.startButtonAppear = function() {
  $(colorDots.$startArea).height(colorDots.bodyHeight).css('display', 'block').addClass('animated bounceInUp');
  //VARIABLE DECLARATION:
  colorDots.startAreaPadding = (colorDots.bodyHeight - colorDots.$startBtn.outerHeight() - colorDots.$instructionsLink.outerHeight()) / 2;

  $(colorDots.$startArea).css('padding', `${colorDots.startAreaPadding}`);
};

colorDots.pushUpTitle = function() { //Title and start btn go up
  $(colorDots.$h1).animate({marginTop: '0%'}, 1000); //Btn goes up
  setTimeout(colorDots.startButtonAppear, 1000); //startBtn goes up
};

colorDots.changeButtonColor = function(e) { //Change button styling
  $(e.target).css({'background-color': colorDots.colors[colorDots.colorCounter]});
  colorDots.colorCounter++;

  if (colorDots.colorCounter === colorDots.colors.length) {
    colorDots.colorCounter = 0;
  }
};

colorDots.changeLinkColor = function(e) {
  $(e.target).css({'color': colorDots.colors[colorDots.linkColorCounter]});
  colorDots.linkColorCounter++;

  if (colorDots.linkColorCounter === colorDots.colors.length) {
    colorDots.linkColorCounter = 0;
  }
};

//GAME LOGIC

//Position values of bubbles
colorDots.xPositionExclude50 = function() {
  colorDots.xCoordinate = Math.floor((Math.random() * (80 - 20 + 1)) + 20);
  if (colorDots.xCoordinate >= 40 && colorDots.xCoordinate <= 55) {
    console.log('I fired');
    colorDots.xPositionExclude50();
  } else {
    return colorDots.xCoordinate;
  }
};

colorDots.yPositionExclude50 = function() {
  colorDots.yCoordinate = Math.floor((Math.random() * (80 - 20 + 1)) + 20);
  if (colorDots.yCoordinate >= 40 && colorDots.yCoordinate <= 55) {
    colorDots.yPositionExclude50();
  } else {
    return colorDots.yCoordinate;
  }
};

//Intervals for the central dot
colorDots.startDotInterval = function() {
  clearInterval(colorDots.dotColors);
  colorDots.dotColors = setInterval(colorDots.changeDotColor, colorDots.randomIntervals); //<--callBack
};

colorDots.changeDotColor = function() {
  $(colorDots.$centerDot).css('background', colorDots.colors[colorDots.progressColorCounter]).attr('value', colorDots.colors[colorDots.progressColorCounter]);
  //Progress colors index at random
  colorDots.progressColorCounter = Math.floor(Math.random() * (colorDots.colors.length));
  //Reassign a random number between 2 seconds and 12 seconds
  colorDots.randomIntervals = Math.floor((Math.random() * (7000 - 2000 + 1)) + 2000);
};

//LEVELS FUNCTIONS
colorDots.changeFreqOnScore = function() {
  if (colorDots.score < 5) { //freq at level 1
    colorDots.randomFreq = Math.floor((Math.random() * (1200 - 1000 + 1)) + 800);
  } else if (colorDots.score >= 5 && colorDots.score < 10) { //freq at level 2
    colorDots.randomFreq = Math.floor((Math.random() * (1000 - 600 + 1)) + 600);
  } else { //freq at level 3
    colorDots.randomFreq = Math.floor((Math.random() * (1000 - 500 + 1)) + 500);
  }
};

colorDots.nextLevel = function(num) { //Level 2
  colorDots.colors.push(colorDots.colorsNextLevels[num]);
};

colorDots.changeLevelOnScore = function() { //Progress Levels
  if (colorDots.score === 5) {
    colorDots.nextLevel(0);
  } else if (colorDots.score === 10) {
    colorDots.nextLevel(1);
  } else if (colorDots.score === 13) {
    colorDots.nextLevel(2);
  }
};

//
//END VARIABLES
//

colorDots.init = function() {
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
  colorDots.$score = $('#score');
  colorDots.$centerDot = $('.center-dot');
  colorDots.$bubble = $('.bubble');
  colorDots.$lives = $('.lives');
  colorDots.$pauseBtn = $('#pause');
  colorDots.$soundIcon = $('i');
  colorDots.$otherArea = $('.other-area');
  colorDots.$inGameInstrLink = $('.instructions-link a');
  colorDots.$gameBoard = $('.game-board');
  colorDots.$gameOver = $('.game-over');
  colorDots.$playAgain = $('.play-again');
  colorDots.$highScoreH3 = $('.high-score');

  colorDots.bodyHeight = colorDots.viewportHeight - colorDots.$header.outerHeight();
  colorDots.boardHeight = colorDots.bodyHeight - colorDots.otherAreaHeight - 20;

  colorDots.elementSizes();

  $( window ).resize(colorDots.elementSizes);

  colorDots.disappearInstructions = function() { //Close Instructions
    $(colorDots.$instructionsArea).fadeOut(2000);
    if (colorDots.closeLogic === 1) { //if you were in the homepage
      $(colorDots.$startArea).fadeIn(); //get startArea to appear
      colorDots.closeLogic = 0;
    } else if (colorDots.closeLogic === 2) { //if you were in the game
      pauseGame();
      $(colorDots.$gameOn).fadeIn(); //get Game to appear
      colorDots.closeLogic = 0;
    }
  };

  colorDots.appearInstructions = function() { //Open Instructions
    if (this === colorDots.$instructionsLink[0]) {
      colorDots.closeLogic = 1;
      $(colorDots.$startArea).fadeOut(1000);
    } else if (this === colorDots.$inGameInstrLink[0]) {
      if (colorDots.gamePaused === false) {
        pauseGame();
      }
      colorDots.closeLogic = 2;
      $(colorDots.$gameOn).fadeOut(1000);
    }

    $(colorDots.$instructionsArea).fadeIn(3000);

    //VARIABLE DECLARATIONS
    colorDots.$instructionsHeight = $('.instructions').height();
    colorDots.$instructionsH2Height = $('.instructions-area h2').height();
    colorDots.$closeBtnHeight = $(colorDots.$closeBtn).outerHeight();

    $(colorDots.$instructionsArea).height(colorDots.bodyHeight).css('padding', `${(colorDots.bodyHeight - colorDots.$instructionsH2Height - colorDots.$instructionsHeight - colorDots.$closeBtnHeight) / 2}`);

    $(colorDots.$closeBtn).on('click', colorDots.disappearInstructions);
  };

  function checkIfAlive() {
    if (colorDots.lives === 0) {
      $(colorDots.$bubble).off('click');
      stopIntervals();
      gameOver();
    }
  }

  //If click event hasn't fired
  function checkClickEvent() {
    if ($(`#${colorDots.timerIds}`).attr('value') === $(colorDots.$centerDot).attr('value')) {
      $(`#life-${colorDots.lives}`).css('opacity', '0.3');
      colorDots.lives--;
      console.log(`lives if click hasn't happened: ${colorDots.lives}`);
      checkIfAlive();
    }
  }

  //Stop intervals when game is OVER
  function stopIntervals() {
    clearTimeout(colorDots.nextLevel);
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
    $(colorDots.$lives).css('opacity', '1').toggleClass('animated pulse');
  }

  //GAME OVER
  function gameOver() {
    colorDots.colors.splice(3);
    colorDots.highScore.push(colorDots.score);
    sortHighscore();
    //display high score - do not reset it
    $(colorDots.$highScoreH3).html(colorDots.highScore[colorDots.highScore.length - 1]);

    //reset score to 0
    setTimeout(function() {
      colorDots.score = 0;
      $(colorDots.$score).html(colorDots.score);
    }, 500);

    //reset lives to 3 and make hearts appear again
    colorDots.lives = 3;
    setTimeout(bringLivesBack, 3000);

    //Reset the colors array back to the original colors:
    colorDots.colors = ['#15A7A4', '#F1592A', '#F4EE34'];

    //Make board disappear and make game over message appear
    $(colorDots.$gameArea).fadeOut('slow');
    $(colorDots.$gameOver).toggleClass('animated bounceInUp').css('display', 'block');

    //Stop intervals
    stopIntervals();

    setTimeout(function() {
      $(colorDots.$playAgain).addClass('animated bounceInUp').css('display', 'inline-block');
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
      $(colorDots.$gameOver).fadeOut('slow').css('display', 'none');
      $(colorDots.$gameArea).fadeIn('slow');
      //Reactivate intervals for bubbles and center-dot
      colorDots.startDotInterval();
      setTimeout(appearBubbles, 2000);
    }

    //If user clicks on PLAY AGAIN BUTTON
    $(colorDots.$playAgain).on('click', reset);
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
      if (colorDots.lives > 0) { //If click event doesn't happen --> remove a life
        checkClickEvent();
      }
      $(`#${colorDots.removeDiv}`).remove();
      colorDots.removeDiv++;
    }, colorDots.disappearBubblesTime);
    colorDots.timerIds++;
  }

  function createABubble() {
    //VARIABLE DECLARATION
    colorDots.bubbleColor = colorDots.colors[Math.floor(Math.random() * (colorDots.colors.length))];

    $('<div/>').addClass('bubble').attr('id', `${colorDots.bubbleIds}`).attr('value', `${colorDots.bubbleColor}`).addClass('animated zoomIn').appendTo(colorDots.$gameBoard).css({
      'left': `${colorDots.xCoordinate}%`,
      'top': `${colorDots.yCoordinate}%`,
      'background-color': colorDots.bubbleColor,
      'padding': Math.floor((Math.random() * (30 - 10 + 1)) + 10)
    }).one('click', checkColor);
  }

  function addBubbles() {
    createABubble(); //add bubbles

    colorDots.xCoordinate = colorDots.xPositionExclude50();
    colorDots.yCoordinate = colorDots.yPositionExclude50();

    //Fade out and remove divs
    colorDots.timeOutBubble = setTimeout(disappearBubbles, colorDots.disappearBubblesTime);
    colorDots.bubbleIds++;

    colorDots.changeFreqOnScore();//Give a new random number between 1 and 3 seconds to the frequency of bubble appearance
  }

  function soundOnOff() {
    if (colorDots.soundsOn === false) {
      $('audio').data('muted',false);
      $(colorDots.$soundIcon).removeClass('fa-volume-off').addClass('fa-volume-up');
      colorDots.soundsOn = true;
    } else if (colorDots.soundsOn === true) {
      $('audio').data('muted',true);
      $(colorDots.$soundIcon).removeClass('fa-volume-up').addClass('fa-volume-off');
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
    if ($(e.target).attr('value') === $(colorDots.$centerDot).attr('value')) {
      colorDots.score++;
      $(colorDots.$score).html(colorDots.score);
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

    colorDots.changeLevelOnScore();
  }

  function pauseGame() {
    if (colorDots.gamePaused === false) {
      //stop the interval
      clearInterval(colorDots.dotColors);
      clearInterval(colorDots.bubbleIntervals);
      colorDots.gamePaused = true;
      $(colorDots.$pauseBtn).text('PAUSED');
    } else {
      // reactivate interval
      colorDots.startDotInterval();
      appearBubbles();
      colorDots.gamePaused = false;
      $(colorDots.$pauseBtn).text('PAUSE');
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

    //VARIABLE DECLARATION
    colorDots.$pauseBtnHeight = $(colorDots.$pauseBtn).outerHeight();
    colorDots.otherAreaPadding = (colorDots.otherAreaHeight - colorDots.$pauseBtnHeight) / 2;

    $(colorDots.$otherArea).height(colorDots.otherAreaHeight).css('padding', `${colorDots.otherAreaPadding}`);

    $(colorDots.$centerDot).css('background', colorDots.colors[colorDots.progressColorCounter]).attr('value', colorDots.colors[colorDots.progressColorCounter]);
    colorDots.startDotInterval();
    setTimeout(appearBubbles, 2000);
  }

  //VARIABLE DECLARATION
  colorDots.bounceInterval = setInterval(colorDots.bounceLetters, 200); // <--callBack

  setTimeout(colorDots.pushUpTitle, 3000);

  colorDots.$instructionsLink.on('click', colorDots.appearInstructions); // <--callBack
  colorDots.$startBtn.on('click', showGame); // <--callBack
  colorDots.$inGameInstrLink.on('click', colorDots.appearInstructions); // <--callBack
  colorDots.$pauseBtn.on('click', pauseGame); // <--callBack
  colorDots.$button.on('mouseover', colorDots.changeButtonColor); // <--callBack
  colorDots.$aLink.on('mouseover', colorDots.changeLinkColor); // <--callBack
  colorDots.$soundIcon.on('click', soundOnOff); // <--callBack
};

$(colorDots.init.bind(colorDots));
