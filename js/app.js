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
  $(colorDots.html).data('scroll-position', colorDots.scrollPosition);
  $(colorDots.html).data('previous-overflow', colorDots.html.css('overflow'));
  $(colorDots.html).css('overflow', 'hidden');
  window.scrollTo(colorDots.scrollPosition[0], colorDots.scrollPosition[1]);
  console.log($(this.$header).outerHeight());
  this.bodyHeight = this.viewportHeight - $(this.$header).outerHeight(); //DIVs height
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
  this.$startArea.height(this.bodyHeight).css('display', 'block').addClass('animated bounceInUp');
  this.startAreaPadding = (this.bodyHeight - this.$startBtn.outerHeight() - this.$instructionsLink.outerHeight()) / 2; //VARIABLE DECLARATION
  this.$startArea.css('padding', `${this.startAreaPadding}`);
};

colorDots.pushUpTitle = function() { //Title and start btn go up
  this.$h1.animate({marginTop: '0%'}, 1000); //Btn goes up
  setTimeout(this.startButtonAppear.bind(this), 1000); //startBtn goes up
};

colorDots.changeButtonColor = function(e) { //Change button styling
  $(e.target).css({'background-color': this.colors[this.colorCounter]});
  this.colorCounter++;
  if (this.colorCounter === this.colors.length) {
    this.colorCounter = 0;
  }
};

colorDots.changeLinkColor = function(e) {
  $(e.target).css({'color': this.colors[this.linkColorCounter]});
  this.linkColorCounter++;
  if (this.linkColorCounter === this.colors.length) {
    this.linkColorCounter = 0;
  }
};

colorDots.disappearInstructions = function() { //Close Instructions
  this.$instructionsArea.fadeOut(2000);
  if (this.closeLogic === 1) { //if you were in the homepage
    this.$startArea.fadeIn(); //get startArea to appear
    this.closeLogic = 0;
  } else if (this.closeLogic === 2) { //if you were in the game
    this.pauseGame();
    this.$gameOn.fadeIn(); //get Game to appear
    this.closeLogic = 0;
  }
};

colorDots.appearInstructions = function() { //Open Instructions <--can't use THIS here
  if (this === colorDots.$instructionsLink[0]) {
    colorDots.closeLogic = 1;
    colorDots.$startArea.fadeOut(1000);
  } else if (this === colorDots.$inGameInstrLink[0]) {
    if (colorDots.gamePaused === false) colorDots.pauseGame();
    colorDots.closeLogic = 2;
    colorDots.$gameOn.fadeOut(1000);
  }

  colorDots.$instructionsArea.fadeIn(3000);

  //VARIABLE DECLARATIONS
  colorDots.$instructionsHeight = $('.instructions').height();
  colorDots.$instructionsH2Height = $('.instructions-area h2').height();
  colorDots.$closeBtnHeight = $(colorDots.$closeBtn).outerHeight();

  colorDots.$instructionsArea.height(colorDots.bodyHeight).css('padding', `${(colorDots.bodyHeight - colorDots.$instructionsH2Height - colorDots.$instructionsHeight - colorDots.$closeBtnHeight) / 2}`);

  colorDots.$closeBtn.on('click', colorDots.disappearInstructions.bind(colorDots));
};

//GAME LOGIC

colorDots.showGame = function() {
  this.$startArea.css('display', 'none');
  this.$h1.css('display', 'inline-block');
  this.$headerH3.css('display', 'inline-block');
  this.$gameOn.addClass('animated bounceInUp');

  this.$gameArea.css('display', 'block');
  if ($(window).width() < 530) this.$h1.css('text-align', 'left');

  //VARIABLE DECLARATION
  this.$pauseBtnHeight = $(this.$pauseBtn).outerHeight();
  this.otherAreaPadding = (this.otherAreaHeight - this.$pauseBtnHeight) / 2;

  this.$otherArea.height(this.otherAreaHeight).css('padding', `${this.otherAreaPadding}`);

  this.$centerDot.css('background', this.colors[this.progressColorCounter]).attr('value', this.colors[this.progressColorCounter]);
  this.startDotInterval();
  setTimeout(this.appearBubbles.bind(this), 2000);
};

//BUBBLES LOGIC

//CENTER BUBBLE
colorDots.startDotInterval = function() {
  clearInterval(this.dotColors);
  this.dotColors = setInterval(this.changeDotColor.bind(this), this.randomIntervals);
};

colorDots.changeDotColor = function() {
  this.$centerDot.css('background', this.colors[this.progressColorCounter]).attr('value', this.colors[this.progressColorCounter]);
  //Progress colors index at random
  this.progressColorCounter = Math.floor(Math.random() * (this.colors.length));
  //Reassign a random number between 2 seconds and 12 seconds
  this.randomIntervals = Math.floor((Math.random() * (7000 - 2000 + 1)) + 2000);
};

//BUBBLES
//Position values of bubbles
colorDots.xPositionExclude50 = function() {
  this.xCoordinate = Math.floor((Math.random() * (80 - 20 + 1)) + 20);
  if (this.xCoordinate >= 40 && this.xCoordinate <= 55) {
    this.xPositionExclude50();
  } else {
    return this.xCoordinate;
  }
};

colorDots.yPositionExclude50 = function() {
  this.yCoordinate = Math.floor((Math.random() * (80 - 20 + 1)) + 20);
  if (this.yCoordinate >= 40 && this.yCoordinate <= 55) {
    this.yPositionExclude50();
  } else {
    return this.yCoordinate;
  }
};

colorDots.addBubbles = function() {
  this.createABubble(); //add bubbles

  this.xCoordinate = this.xPositionExclude50();
  this.yCoordinate = this.yPositionExclude50();

  //Fade out and remove divs
  this.timeOutBubble = setTimeout(this.disappearBubbles.bind(this), this.disappearBubblesTime);
  this.bubbleIds++;

  this.changeFreqOnScore();//Give a new random number between 1 and 3 seconds to the frequency of bubble appearance
};

colorDots.checkClickEvent = function() { //If click event hasn't fired...
  if ($(`#${this.timerIds}`).attr('value') === $(this.$centerDot).attr('value')) {
    $(`#life-${this.lives}`).css('opacity', '0.3');
    this.lives--;
    this.checkIfAlive();
  }
};

colorDots.appearBubbles = function() { //Make bubbles appear on the screen on set intervals
  clearInterval(colorDots.bubbleIntervals);
  this.bubbleIntervals = setInterval(this.addBubbles.bind(this), this.randomFreq);
};

colorDots.disappearBubbles = function() { //make bubbles disappear after 4 seconds
  if (this.gamePaused === true) clearTimeout(this.timeOutBubble);
  $(`#${this.timerIds}`).addClass('animated zoomOut');
  this.waitToDisappear = setTimeout(colorDots.checkClickRemoveDiv, colorDots.disappearBubblesTime);
  this.timerIds++;
};

colorDots.checkClickRemoveDiv = function() {
  if (colorDots.lives > 0) colorDots.checkClickEvent();
  $(`#${colorDots.removeDiv}`).remove();
  colorDots.removeDiv++;
};

colorDots.createABubble = function() {
  //VARIABLE DECLARATION
  this.bubbleColor = this.colors[Math.floor(Math.random() * (this.colors.length))];

  $('<div/>').addClass('bubble').attr('id', `${this.bubbleIds}`).attr('value', `${this.bubbleColor}`).addClass('animated zoomIn').appendTo(this.$gameBoard).css({
    'left': `${this.xCoordinate}%`,
    'top': `${this.yCoordinate}%`,
    'background-color': this.bubbleColor,
    'padding': Math.floor((Math.random() * (30 - 10 + 1)) + 10)
  }).one('click', this.checkColor.bind(this));
};

colorDots.checkColor = function(e) {
  $(e.target).off('click');
  this.playAudio();
  if ($(e.target).attr('value') === $(this.$centerDot).attr('value')) {
    this.score++;
    this.$score.html(this.score);
    $(e.target).remove();

    //If the user made 10 points in a row and their lives are less than 3 --> add one life
    this.pointsInARow++;
    if (this.lives < 3 && this.pointsInARow === 10) {
      this.lives++;
      $(`#life-${this.lives}`).fadeIn();
    } else if (this.lives === 3 && this.pointsInARow === 10) {
      this.pointsInARow = 0;
    }
  } else {
    $(`#life-${this.lives}`).css('opacity', '0.3');
    this.lives--;
    $(e.target).remove();

    this.pointsInARow = 0; //If user makes a mistake, reset points in a row:

    this.checkIfAlive();
  }
  this.changeLevelOnScore();
};

//LEVELS FUNCTIONS
colorDots.changeFreqOnScore = function() {
  if (this.score < 5) { //freq at level 1
    this.randomFreq = Math.floor((Math.random() * (1200 - 1000 + 1)) + 800);
  } else if (this.score >= 5 && this.score < 10) { //freq at level 2
    this.randomFreq = Math.floor((Math.random() * (1000 - 600 + 1)) + 600);
  } else { //freq at level 3
    this.randomFreq = Math.floor((Math.random() * (1000 - 500 + 1)) + 500);
  }
};

colorDots.nextLevel = function(num) { //Level 2
  this.colors.push(this.colorsNextLevels[num]);
};

colorDots.changeLevelOnScore = function() { //Progress Levels
  if (this.score === 5) {
    this.nextLevel(0);
  } else if (this.score === 10) {
    this.nextLevel(1);
  } else if (this.score === 13) {
    this.nextLevel(2);
  }
};

//GAME OVER LOGIC

colorDots.stopIntervals = function() { //Stop intervals when game is OVER
  clearTimeout(this.nextLevel);
  clearInterval(this.dotColors);
  clearInterval(this.bubbleIntervals);
  clearTimeout(this.waitToDisappear);
};

colorDots.checkIfAlive = function() {
  if (this.lives === 0) {
    this.$bubble.off('click');
    this.stopIntervals();
    this.gameOver();
  }
};

colorDots.reset = function() {
  //Reset the colors array back to the original colors:
  this.colors = ['#15A7A4', '#F1592A', '#F4EE34'];

  //Reset lives and score
  this.lives = 3;
  this.score = 0;
  this.bringLivesBack();

  //Reset reandomFreq back to how it was before the levels advance
  this.randomFreq = Math.floor((Math.random() * (1500 - 1000 + 1)) + 1000);

  //Make game over message disappear and game board appear
  this.$gameOver.fadeOut('slow').css('display', 'none');
  this.$gameArea.fadeIn('slow');

  this.startDotInterval(); //Reactivate intervals for bubbles and center-dot
  setTimeout(this.appearBubbles.bind(this), 2000);
};

colorDots.gameOver = function() { //GAME OVER
  this.colors.splice(3);
  // this.highScore.push(this.score);
  this.checkHighscore();

  setTimeout(this.resetScore, 500);

  this.lives = 3; //reset lives to 3 and make hearts appear again
  setTimeout(this.bringLivesBack.bind(this), 3000);

  this.colors = ['#15A7A4', '#F1592A', '#F4EE34']; //Reset the colors array back to the original colors

  //Make board disappear and make game over message appear
  this.$gameArea.fadeOut('slow');
  this.$gameOver.toggleClass('animated bounceInUp').css('display', 'block');

  this.stopIntervals(); //Stop intervals

  setTimeout(function() {
    colorDots.$playAgain.addClass('animated bounceInUp').css('display', 'inline-block');
  }, 2000);

  this.$playAgain.on('click', this.reset.bind(this));
};

colorDots.resetScore = function() {
  this.score = 0;
  $('#score').html(this.score);
};

//SCORING SYSTEM
colorDots.checkHighscore = function() { //Set high score to local storage
  console.log(window.localStorage);
  if (window.localStorage.highScore) {
    if (this.score > parseInt(window.localStorage.highScore)) window.localStorage.highScore = this.score;
  } else window.localStorage.setItem('highScore', this.score);
  this.$highScoreH3.html(window.localStorage.highScore);
};

colorDots.bringLivesBack = function() { //Makes Lives go back to 3
  this.$lives.css('opacity', '1').toggleClass('animated pulse');
};

//PAUSE GAME
colorDots.pauseGame = function() {
  if (this.gamePaused === false) {
    //stop the interval
    clearInterval(this.dotColors);
    clearInterval(this.bubbleIntervals);
    clearTimeout(this.checkClickRemoveDiv);
    this.gamePaused = true;
    $(this.$pauseBtn).text('PAUSED');
  } else {
    // reactivate interval
    this.startDotInterval();
    this.appearBubbles();
    this.gamePaused = false;
    this.$pauseBtn.text('PAUSE');
  }
};

//SOUND
colorDots.soundOnOff = function() {
  if (this.soundsOn === false) {
    $('audio').data('muted',false);
    this.$soundIcon.removeClass('fa-volume-off').addClass('fa-volume-up');
    this.soundsOn = true;
  } else if (this.soundsOn === true) {
    $('audio').data('muted',true);
    this.$soundIcon.removeClass('fa-volume-up').addClass('fa-volume-off');
    this.soundsOn = false;
  }
};

colorDots.playAudio = function() {
  if (this.soundsOn === true) {
    new Audio(`./sounds/${this.sounds[this.soundsCounter]}.mp3`).play();
    if (this.soundsCounter === this.sounds.length - 1) {
      this.soundsCounter = 0;
    } else {
      this.soundsCounter++;
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
  $( window ).on('resize', this.elementSizes);

  //VARIABLE DECLARATION
  this.bounceInterval = setInterval(this.bounceLetters.bind(this), 200);

  setTimeout(this.pushUpTitle.bind(this), 3000);

  this.$instructionsLink.on('click', this.appearInstructions); // <--don't bind to OBJECT
  this.$startBtn.on('click', this.showGame.bind(this));
  this.$inGameInstrLink.on('click', this.appearInstructions); // <--don't bind to OBJECT
  this.$pauseBtn.on('click', this.pauseGame.bind(this));
  this.$button.on('mouseover', this.changeButtonColor.bind(this));
  this.$aLink.on('mouseover', this.changeLinkColor.bind(this));
  this.$soundIcon.on('click', this.soundOnOff.bind(this));
};

$(colorDots.init.bind(colorDots));
