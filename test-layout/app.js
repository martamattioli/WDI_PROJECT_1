var viewportHeight = $(window).height();
var headerHeight = viewportHeight * 0.1;
var bodyHeight = viewportHeight * 0.9;
var startAreaPadding = (bodyHeight - 91) / 2;
var scoringAreaHeight = bodyHeight * 0.1;
var otherOptHeight = bodyHeight * 0.15;

function init() {
  var getInstructionsDiv = $('.instructions');
  var getInstructionsHeight = getInstructionsDiv.height();

//After initial animation
  //Main container
  $('.container').height(viewportHeight);
  //Title Area
  $('header').height(headerHeight).css('padding', `${(headerHeight - 30) / 2}`);
  //Main
  $('main').height(viewportHeight * 0.9);
  //Start Area
  $('.start-area').height(bodyHeight).css('padding', `${startAreaPadding}`);
  //Game Area
  $('.game-area').height(bodyHeight);
  //Game board
  $('.scoring-area').height(scoringAreaHeight).css('padding', `${(scoringAreaHeight - parseFloat($('h3:first-child').css('font-size'))) / 2}`);
  $('.game-board').height(bodyHeight * 0.65);
  $('.other-options').height(otherOptHeight).css('padding', `${(otherOptHeight - 51) / 2}`);
  //Instructions
  $('.instructions-area').height(bodyHeight).css('padding', `${(bodyHeight - 25 - getInstructionsHeight - 51) / 2}`);

  let counter = 0;
  const $spanArray = $('h1 span');
  const titleInterval = setInterval(function() {
    $($spanArray[counter]).addClass('animated bounce');

    counter++;

    if (counter === $spanArray.length) {
      clearInterval(titleInterval);
    }
  }, 200);

}

$(init);
