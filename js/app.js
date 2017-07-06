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
  this.scrollPosition = [ //Block screen scroll
    self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
    self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
  ];
  this.html.data('scroll-position', this.scrollPosition);
  this.html.data('previous-overflow', this.html.css('overflow'));
  this.html.css('overflow', 'hidden');
  window.scrollTo(this.scrollPosition[0], this.scrollPosition[1]);

  this.bodyHeight = this.viewportHeight - this.$header.outerHeight(); //DIVs height
  this.otherAreaHeight = this.viewportHeight * 0.15;
  this.boardHeight = this.viewportHeight - this.headerHeight - this.otherAreaHeight - 20;

  $(this.$container).height(this.viewportHeight); //Main container

  this.headerPadding = (this.headerHeight - 30) / 2; //Title Area
  $(this.$header).css('padding', `${this.headerPadding}`);
  $(this.$gameArea).height(this.bodyHeight).css('padding', `${this.headerPadding}`); //Game Area
  $(this.$gameBoard).height(this.boardHeight); //Game board
  $(this.$gameOver).height(this.bodyHeight).css('padding', `${(this.bodyHeight - 210) / 2}`); //Game over height
};

colorDots.bounceLetters = function() { //Each letter of the title bouces in
  $(this.$h1Letters[this.h1LettersCounter]).css('opacity', '1').addClass('animated bounce');
  this.h1LettersCounter++;
  if (this.h1LettersCounter === this.$h1Letters.length) {
    clearInterval(this.bounceLetters);
  }
};

colorDots.startButtonAppear = function() {
  $(this.$startArea).height(this.bodyHeight).css('display', 'block').addClass('animated bounceInUp');
  this.startAreaPadding = (this.bodyHeight - this.$startBtn.outerHeight() - this.$instructionsLink.outerHeight()) / 2; //VARIABLE DECLARATION
  $(this.$startArea).css('padding', `${this.startAreaPadding}`);
};

colorDots.pushUpTitle = function() { //Title and start btn go up
  $(this.$h1).animate({marginTop: '0%'}, 1000); //Btn goes up
  setTimeout(this.startButtonAppear.bind(this), 1000); //startBtn goes up
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

colorDots.disappearInstructions = function() { //Close Instructions
  $(colorDots.$instructionsArea).fadeOut(2000);
  if (colorDots.closeLogic === 1) { //if you were in the homepage
    $(colorDots.$startArea).fadeIn(); //get startArea to appear
    colorDots.closeLogic = 0;
  } else if (colorDots.closeLogic === 2) { //if you were in the game
    colorDots.pauseGame();
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
      colorDots.pauseGame();
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

//GAME LOGIC

colorDots.showGame = function() {
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
  setTimeout(colorDots.appearBubbles, 2000);
};

//BUBBLES LOGIC

//CENTER BUBBLE
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

//BUBBLES
//Position values of bubbles
colorDots.xPositionExclude50 = function() {
  colorDots.xCoordinate = Math.floor((Math.random() * (80 - 20 + 1)) + 20);
  if (colorDots.xCoordinate >= 40 && colorDots.xCoordinate <= 55) {
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

colorDots.addBubbles = function() {
  colorDots.createABubble(); //add bubbles

  colorDots.xCoordinate = colorDots.xPositionExclude50();
  colorDots.yCoordinate = colorDots.yPositionExclude50();

  //Fade out and remove divs
  colorDots.timeOutBubble = setTimeout(colorDots.disappearBubbles, colorDots.disappearBubblesTime);
  colorDots.bubbleIds++;

  colorDots.changeFreqOnScore();//Give a new random number between 1 and 3 seconds to the frequency of bubble appearance
};

colorDots.checkClickEvent = function() { //If click event hasn't fired...
  if ($(`#${colorDots.timerIds}`).attr('value') === $(colorDots.$centerDot).attr('value')) {
    $(`#life-${colorDots.lives}`).css('opacity', '0.3');
    colorDots.lives--;
    console.log(`lives if click hasn't happened: ${colorDots.lives}`);
    colorDots.checkIfAlive();
  }
};

colorDots.appearBubbles = function() { //Make bubbles appear on the screen on set intervals
  clearInterval(colorDots.bubbleIntervals);
  colorDots.bubbleIntervals = setInterval(colorDots.addBubbles, colorDots.randomFreq); // <--callBack
};

colorDots.disappearBubbles = function() { //Function to make bubbles disappear after 4 seconds
  if (colorDots.gamePaused === true) {
    clearTimeout(colorDots.timeOutBubble);
  }
  $(`#${colorDots.timerIds}`).addClass('animated zoomOut');
  setTimeout( function() {
    if (colorDots.lives > 0) { //If click event doesn't happen --> remove a life
      colorDots.checkClickEvent();
    }
    $(`#${colorDots.removeDiv}`).remove();
    colorDots.removeDiv++;
  }, colorDots.disappearBubblesTime + 500);
  colorDots.timerIds++;
};

colorDots.createABubble = function() {
  //VARIABLE DECLARATION
  colorDots.bubbleColor = colorDots.colors[Math.floor(Math.random() * (colorDots.colors.length))];

  $('<div/>').addClass('bubble').attr('id', `${colorDots.bubbleIds}`).attr('value', `${colorDots.bubbleColor}`).addClass('animated zoomIn').appendTo(colorDots.$gameBoard).css({
    'left': `${colorDots.xCoordinate}%`,
    'top': `${colorDots.yCoordinate}%`,
    'background-color': colorDots.bubbleColor,
    'padding': Math.floor((Math.random() * (30 - 10 + 1)) + 10)
  }).one('click', colorDots.checkColor); //<--callBack
};

colorDots.checkColor = function(e) {
  $(e.target).off('click');
  colorDots.playAudio();
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

    colorDots.checkIfAlive();
  }
  colorDots.changeLevelOnScore();
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

//GAME OVER LOGIC

colorDots.stopIntervals = function() { //Stop intervals when game is OVER
  clearTimeout(colorDots.nextLevel);
  clearInterval(colorDots.dotColors);
  clearInterval(colorDots.bubbleIntervals);
};

colorDots.checkIfAlive = function() {
  if (colorDots.lives === 0) {
    $(colorDots.$bubble).off('click');
    colorDots.stopIntervals();
    colorDots.gameOver();
  }
};

colorDots.gameOver = function() { //GAME OVER
  colorDots.colors.splice(3);
  colorDots.highScore.push(colorDots.score);
  colorDots.sortHighscore();
  //display high score - do not reset it
  $(colorDots.$highScoreH3).html(colorDots.highScore[colorDots.highScore.length - 1]);

  setTimeout(function() { //reset score to 0
    colorDots.score = 0;
    $(colorDots.$score).html(colorDots.score);
  }, 500);

  colorDots.lives = 3; //reset lives to 3 and make hearts appear again
  setTimeout(colorDots.bringLivesBack, 3000); //<-- callBack

  colorDots.colors = ['#15A7A4', '#F1592A', '#F4EE34']; //Reset the colors array back to the original colors

  //Make board disappear and make game over message appear
  $(colorDots.$gameArea).fadeOut('slow');
  $(colorDots.$gameOver).toggleClass('animated bounceInUp').css('display', 'block');

  colorDots.stopIntervals(); //Stop intervals

  setTimeout(function() {
    $(colorDots.$playAgain).addClass('animated bounceInUp').css('display', 'inline-block');
  }, 2000);

  colorDots.reset = function() {
    //Reset the colors array back to the original colors:
    colorDots.colors = ['#15A7A4', '#F1592A', '#F4EE34'];

    //Reset lives and score
    colorDots.lives = 3;
    colorDots.score = 0;
    colorDots.bringLivesBack();

    //Reset reandomFreq back to how it was before the levels advance
    colorDots.randomFreq = Math.floor((Math.random() * (1500 - 1000 + 1)) + 1000);

    //Make game over message disappear and game board appear
    $(colorDots.$gameOver).fadeOut('slow').css('display', 'none');
    $(colorDots.$gameArea).fadeIn('slow');

    colorDots.startDotInterval(); //Reactivate intervals for bubbles and center-dot
    setTimeout(colorDots.appearBubbles, 2000); // <--callBack
  };

  colorDots.$playAgain.on('click', colorDots.reset); // <--callBack
};

//SCORING SYSTEM
colorDots.sortHighscore = function() { //To sort high score array
  colorDots.highScore.sort(function(a, b) {
    return a-b;
  });
};

colorDots.bringLivesBack = function() { //Makes Lives go back to 3
  $(colorDots.$lives).css('opacity', '1').toggleClass('animated pulse');
};

//PAUSE GAME
colorDots.pauseGame = function() {
  if (colorDots.gamePaused === false) {
    //stop the interval
    clearInterval(colorDots.dotColors);
    clearInterval(colorDots.bubbleIntervals);
    colorDots.gamePaused = true;
    $(colorDots.$pauseBtn).text('PAUSED');
  } else {
    // reactivate interval
    colorDots.startDotInterval();
    colorDots.appearBubbles();
    colorDots.gamePaused = false;
    $(colorDots.$pauseBtn).text('PAUSE');
  }
};

//SOUND
colorDots.soundOnOff = function() {
  if (colorDots.soundsOn === false) {
    $('audio').data('muted',false);
    $(colorDots.$soundIcon).removeClass('fa-volume-off').addClass('fa-volume-up');
    colorDots.soundsOn = true;
  } else if (colorDots.soundsOn === true) {
    $('audio').data('muted',true);
    $(colorDots.$soundIcon).removeClass('fa-volume-up').addClass('fa-volume-off');
    colorDots.soundsOn = false;
  }
};

colorDots.playAudio = function() {
  if (colorDots.soundsOn === true) {
    new Audio(`./sounds/${colorDots.sounds[colorDots.soundsCounter]}.mp3`).play();
    if (colorDots.soundsCounter === colorDots.sounds.length - 1) {
      colorDots.soundsCounter = 0;
    } else {
      colorDots.soundsCounter++;
    }
  }
};

//
//END VARIABLES
//

colorDots.init = function() {
  //Grab elements
  this.html = $('html'); //MAIN CONTAINERS VARS
  this.$container = $('.container');
  this.$button = $('button');
  this.$aLink = $('a');
  this.$header = $('header'); //HEADER VARS
  this.$h1Letters = $('h1 span');
  this.$h1 = $('h1');
  this.$headerH3 = $('header h3');
  this.$startArea = $('.start-area'); //START AREA VARS
  this.$startBtn = $('.start-area button');
  this.$instructionsArea = $('.instructions-area'); //INSTRUCTIONS VARS
  this.$instructionsLink = $('.start-area a');
  this.$closeBtn = $('.instructions-area button');
  this.$gameArea = $('.game-area'); //GAME VARS
  this.$gameOn = $('.game-on');
  this.$score = $('#score');
  this.$centerDot = $('.center-dot');
  this.$bubble = $('.bubble');
  this.$lives = $('.lives');
  this.$pauseBtn = $('#pause');
  this.$soundIcon = $('i');
  this.$otherArea = $('.other-area');
  this.$inGameInstrLink = $('.instructions-link a');
  this.$gameBoard = $('.game-board');
  this.$gameOver = $('.game-over');
  this.$playAgain = $('.play-again');
  this.$highScoreH3 = $('.high-score');

  this.bodyHeight = this.viewportHeight - this.$header.outerHeight();
  this.boardHeight = this.bodyHeight - this.otherAreaHeight - 20;

  this.elementSizes();
  $( window ).resize(this.elementSizes);

  //VARIABLE DECLARATION
  this.bounceInterval = setInterval(this.bounceLetters.bind(this), 200); // <--callBack

  setTimeout(this.pushUpTitle.bind(this), 3000);

  this.$instructionsLink.on('click', this.appearInstructions); // <--callBack
  this.$startBtn.on('click', this.showGame); // <--callBack
  this.$inGameInstrLink.on('click', this.appearInstructions); // <--callBack
  this.$pauseBtn.on('click', this.pauseGame); // <--callBack
  this.$button.on('mouseover', this.changeButtonColor); // <--callBack
  this.$aLink.on('mouseover', this.changeLinkColor); // <--callBack
  this.$soundIcon.on('click', this.soundOnOff); // <--callBack
};

$(colorDots.init.bind(colorDots));
