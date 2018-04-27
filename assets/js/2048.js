$(document).ready(function() {

  // Init the game and the colors for each number
  mapBackground = initBackgrounds();
  mapForeground = initForegrounds();
  board = createBoard();
  init();

  // Hide 2048 tips
  $(document).on('click', '.fa-chevron-up', function() {
    var $arrowUp = $(this);
    var animationTime = 1000;

    // Change arrow, from up to down
    $(this).animateRotate(180, animationTime, function() {
      $arrowUp.removeClass('fa-chevron-up').addClass('fa-chevron-down');
      $arrowUp.animateRotate(0);
    });

    // Hide tips
    $('#howToPlayDescription').fadeOut(animationTime);
  });

  // Show 2048 tips
  $(document).on('click', '.fa-chevron-down', function() {
    var $arrowDown = $(this);
    var animationTime = 1000;

    // Change arrow, from down to up
    $(this).animateRotate(180, animationTime, function() {
      $arrowDown.removeClass('fa-chevron-down').addClass('fa-chevron-up');
      $arrowDown.animateRotate(0);
    });

    // Hide tips
    $('#howToPlayDescription').fadeIn(animationTime);
  });


  /// NOT RELATED TO EVENTS

  // Create an empty board
  function createBoard() {
    var x = new Array(4);
    for (var i = 0; i < 4; ++i) {
      x[i] = new Array(4);
      for (var j = 0; j < 4; ++j) {
        x[i][j] = 0;
      }
    }

    return x;
  }

  // Generate an initial number: 2 or 4
  function getRandomNumber() {
    var possibleNumber = [2, 2, 4, 2, 2, 2, 2, 2, 4, 2];

    return possibleNumber[Math.floor((Math.random(0, possibleNumber.length) * 10))];
  }

  // Returns a random position which is empty
  function getRandomEmptyPosition() {
    var unoccupiedPos = [];

    for (var i = 0; i < 4; ++i) {
      for (var j = 0; j < 4; ++j) {
        if (board[i][j] == 0) {
          unoccupiedPos.push([i, j]);
        }
      }
    }

    return unoccupiedPos[Math.floor((Math.random(0, unoccupiedPos.length) * 10))];
  }

  // Inits the game (board)
  function init() {
    // Place the first number
    makeNumberAppear();

    return board;
  }

  // Initializes the map with the background for each number
  function initBackgrounds() {
    var map = new Map();

    // Insert a color for every available number
    map.set(2, [220, 220, 220]);
    map.set(4, [250, 180, 100]);
    map.set(8, [128, 128, 128]);
    map.set(16, [128, 0, 128]);
    map.set(32, [0, 0, 100]);
    map.set(64, [200, 200, 0]);
    map.set(128, [0, 200, 200]);
    map.set(256, [255, 0, 0]);
    map.set(512, [100, 100, 100]);
    map.set(1024, [0, 128, 128]);
    map.set(2048, [0, 200, 0]);

    return map;
  }

  // Initialize the foreground color for every number
  function initForegrounds() {
    var map = new Map();

    // Insert a color for every available number
    map.set(2, [0, 0, 0]);
    map.set(4, [0, 0, 0]);
    map.set(8, [255, 255, 255]);
    map.set(16, [255, 255, 255]);
    map.set(32, [0, 0, 0]);
    map.set(64, [255, 255, 255]);
    map.set(128, [255, 255, 255]);
    map.set(256, [255, 255, 255]);
    map.set(512, [255, 255, 255]);
    map.set(1024, [255, 255, 255]);
    map.set(2048, [0, 0, 0]);

    return map;
  }

  // Shows a new number in the board
  function makeNumberAppear() {
    var number = getRandomNumber();
    var position = getRandomEmptyPosition();
    var background = mapBackground.get(number).join(',');
    var foreground = mapForeground.get(number).join(',');
    var div = '<div class="rounded cell-number" style="background-color: rgb(' + background + '); color: rgb(' + foreground + ');">' + number + '</div>';

    $(div).hide().appendTo('#' + position[0] + position[1]).fadeIn('medium');
    console.log(mapForeground.get(number));
  }


  // Rotation plugin
  $.fn.animateRotate = function(angle, duration, complete) {
    return this.each(function() {
      var $elem = $(this);

      $({deg: 0}).animate({deg: angle}, {
        duration: duration,
        step: function(now) {
          $elem.css({
            transform: 'rotate(' + now + 'deg)'
          });
        },
        complete: complete || $.noop
      });
    });
  };
});
