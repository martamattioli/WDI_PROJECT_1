//For positioning
var viewportHeight = $(window).height();
var headerHeight = viewportHeight * 0.12;
var bodyHeight = viewportHeight * 0.88;
var otherAreaHeight = viewportHeight * 0.15;
var boardHeight = viewportHeight - headerHeight - otherAreaHeight - 20;

//For animations
let h1LettersCounter = 0;

function init() {
  function elementSizes() {
    //Main container
    $('.container').height(viewportHeight);
    //Title Area
    var headerPadding = (headerHeight - 30) / 2;
    $('header').height(headerHeight).css('padding', `${headerPadding}`);
    //Main
    $('main').height(viewportHeight * 0.9);
    //Game Area
    $('.game-area').height(bodyHeight).css('padding', `${headerPadding}`);
    //Game board
    $('.game-board').height(boardHeight);
  }

  elementSizes();

  $( window ).resize(elementSizes);

  //Grab elements
  const $h1Letters = $('h1 span');
  const $h1 = $('h1');
  const $headerH3 = $('header h3');
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

  var closeLogic = 0;

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
    closeLogic = 1;

    $($startArea).fadeOut(1000);
    $($instructionsArea).fadeIn(3000);
    //Instructions
    const $instructionsHeight = $('.instructions').height();
    const $instructionsH2Height = $('.instructions-area h2').height();
    const $closeBtnHeight = $($closeBtn).outerHeight();

    $($instructionsArea).height(bodyHeight).css('padding', `${(bodyHeight - $instructionsH2Height - $instructionsHeight - $closeBtnHeight) / 2}`);

    $($closeBtn).on('click', disappearInstructions);
  }

  function showInstructions() { //Open Instructions
    closeLogic = 2;

    $($gameOn).fadeOut(1000);
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
    $($h1).width('59.5%').css('display', 'inline-block');
    $($headerH3).width('19.5%').css('display', 'inline-block');
    $($gameOn).addClass('animated bounceInUp');

    $($gameArea).css('display', 'block');

    const $pauseBtnHeight = $($pauseBtn).outerHeight();
    console.log($pauseBtnHeight);
    const otherAreaPadding = (otherAreaHeight - $pauseBtnHeight) / 2;

    $($otherArea).height(otherAreaHeight).css('padding', `${otherAreaPadding}`);
  }

  const bounceInterval = setInterval(bounceLetters, 200);
  setTimeout(pushUpTitle, 3000);

  $($instructionsLink).on('click', appearInstructions);
  $($startBtn).on('click', showGame);
  $($inGameInstrLink).on('click', showInstructions);
}

$(init);
