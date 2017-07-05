//For positioning
var viewportHeight = $(window).height();
// var headerHeight = viewportHeight * 0.12;
var headerHeight = 71.27;
// var bodyHeight = viewportHeight * 0.88;
// var bodyHeight = viewportHeight - headerHeight;
var otherAreaHeight = viewportHeight * 0.15;

//For animations
let h1LettersCounter = 0;

//For the game
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
//END FOR THE GAME

function init() {
  //Grab elements
  const html = $('html');

  const $container = $('.container');

  const $header = $('header');
  const $h1Letters = $('h1 span');
  const $h1 = $('h1');
  const $headerH3 = $('header h3');

  // const $main = $('main');

  const $startArea = $('.start-area');
  const $startBtn = $('.start-area button');

  const $instructionsArea = $('.instructions-area');
  const $instructionsLink = $('.start-area a');
  const $closeBtn = $('.instructions-area button');

  const $gameArea = $('.game-area');
  const $gameOn = $('.game-on');
  const $pauseBtn = $('#pause');
  const $otherArea = $('.other-area');
  const $inGameInstrLink = $('.instructions-link a');
  const $gameBoard = $('.game-board');

  var bodyHeight = viewportHeight - $header.outerHeight();
  var boardHeight = bodyHeight - otherAreaHeight - 20;

  function elementSizes() {
    console.log('I fired');
    var scrollPosition = [
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

  function pushUpTitle() { //Title and start btn go up
    $($h1).animate({marginTop: '0%'}, 1000);
    setTimeout(function() {
      $($startArea).height(bodyHeight).css('display', 'block').addClass('animated bounceInUp');
      const startAreaPadding = (bodyHeight - $startBtn.outerHeight() - $instructionsLink.outerHeight()) / 2;
      $($startArea).css('padding', `${startAreaPadding}`);
    }, 1000);


  }

  let closeLogic = 0;

  function disappearInstructions() { //Close Instructions
    $($instructionsArea).fadeOut(2000);
    if (closeLogic === 1) {
      $($startArea).fadeIn();
      closeLogic = 0;
    } else if (closeLogic === 2) {
      $($gameOn).fadeIn();
      closeLogic = 0;
    }
  }

  function appearInstructions() { //Open Instructions

    if (this === $instructionsLink[0]) {
      closeLogic = 1;
      $($startArea).fadeOut(1000);
    } else if (this === $inGameInstrLink[0]) {
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

  function showGame() {
    $($startArea).css('display', 'none');
    $($h1).css('display', 'inline-block');
    $($headerH3).css('display', 'inline-block');
    $($gameOn).addClass('animated bounceInUp');

    $($gameArea).css('display', 'block');

    const $pauseBtnHeight = $($pauseBtn).outerHeight();
    const otherAreaPadding = (otherAreaHeight - $pauseBtnHeight) / 2;

    $($otherArea).height(otherAreaHeight).css('padding', `${otherAreaPadding}`);

    
  }

  const bounceInterval = setInterval(bounceLetters, 200);
  setTimeout(pushUpTitle, 3000);

  $($instructionsLink).on('click', appearInstructions);
  $($startBtn).on('click', showGame);
  $($inGameInstrLink).on('click', appearInstructions);
}

$(init);
