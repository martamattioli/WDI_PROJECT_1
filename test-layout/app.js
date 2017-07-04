var viewportHeight = $(window).height();
var headerHeight = viewportHeight * 0.12;
var bodyHeight = viewportHeight * 0.9;
var startAreaPadding = (bodyHeight - 91) / 2;
var otherAreaHeight = viewportHeight * 0.15;
var boardHeight = viewportHeight - headerHeight - otherAreaHeight - 20;

function init() {
//After initial animation
  //Main container
  $('.container').height(viewportHeight);
  //Title Area
  var headerPadding = (headerHeight - 30) / 2;

  $('header').height(headerHeight).css('padding', `${headerPadding}`);

  //Main
  $('main').height(viewportHeight * 0.9);

  //Start Area
  $('.start-area').height(bodyHeight).css('padding', `${startAreaPadding}`);

  //Game Area
  $('.game-area').height(bodyHeight).css('padding', `${headerPadding}`);

  //Game board
  var pauseBtnHeight = $('#pause').outerHeight();
  var otherAreaPadding = (otherAreaHeight - pauseBtnHeight) / 2;

  console.log(pauseBtnHeight);
  $('.other-area').height(otherAreaHeight).css('padding', `${otherAreaPadding}`);

  $('.game-board').height(boardHeight);

  //Instructions
  var getInstructionsDiv = $('.instructions');
  var getInstructionsHeight = getInstructionsDiv.height();

  $('.instructions-area').height(bodyHeight).css('padding', `${(bodyHeight - 25 - getInstructionsHeight - 51) / 2}`);

  //ANIMATE TITLE ON LOAD
  let counter = 0;
  const $spanArray = $('h1 span');
  const titleInterval = setInterval(function() {
    $($spanArray[counter]).css('opacity', '1');

    $($spanArray[counter]).addClass('animated bounce');

    counter++;

    if (counter === $spanArray.length) {
      clearInterval(titleInterval);
    }
  }, 200);

  setTimeout(function())
}

$(init);
