var viewportHeight = $(window).height();
var headerHeight = viewportHeight * 0.12;
var bodyHeight = viewportHeight * 0.88;
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

  //Game Area
  $('.game-area').height(bodyHeight).css('padding', `${headerPadding}`);

  //Game board
  var pauseBtnHeight = $('#pause').outerHeight();
  var otherAreaPadding = (otherAreaHeight - pauseBtnHeight) / 2;

  $('.other-area').height(otherAreaHeight).css('padding', `${otherAreaPadding}`);

  $('.game-board').height(boardHeight);

  //Instructions
  var getInstructionsDiv = $('.instructions');
  var getInstructionsHeight = getInstructionsDiv.height();

  $('.instructions-area').height(bodyHeight).css('padding', `${(bodyHeight - 25 - getInstructionsHeight - 51) / 2}`);

  //ANIMATE TITLE ON LOAD
  //Each letter bouces
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
  //Then the title goes to the top and the start area comes in
  setTimeout(function() {
    $('h1').animate({marginTop: '0%'}, 1000);
    setTimeout(function() {
      $('.start-area').css('display', 'block').addClass('animated bounceInUp');
      //Start Area
      var startBtnHeight = $('.start-area button').outerHeight();
      var instructionsLinkHeight = $('.start-area a').outerHeight();
      var startAreaPadding = (bodyHeight - startBtnHeight - instructionsLinkHeight) / 2;

      $('.start-area').height(bodyHeight).css('padding', `${startAreaPadding}`);
    }, 1000);
  }, 3000);

  
}

$(init);
