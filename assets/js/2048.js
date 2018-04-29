$(document).ready(function() {

  // Init the game and the colors for each number
  mapBackground = initBackgrounds();
  mapForeground = initForegrounds();
  game = new Board();

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

  // Listen for arrow events
  $(document).keydown(function(e) {
    switch (e.which) {
      case 37:  // Left arrow
        game.move(Move.LEFT);
        break;
      case 38:  // Up arrow
        game.move(Move.UP);
        break;
      case 39:  // Right arrow
        game.move(Move.RIGHT);
        break;
      case 40: // Bottom arrow
        game.move(Move.DOWN);
        break;
    }
    console.log(game.board);
  });


  /// NOT RELATED TO EVENTS

  // Initializes the map with the background for each number
  function initBackgrounds() {
    var map = new Map();

    // Insert a color for every available number
    map.set(2, [220, 220, 220]);
    map.set(4, [250, 240, 100]);
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

  // AppendTo animation plugin
  $.fn.animateAppendTo = function(sel, speed, yourFunc) {
    var $this = this, newEle = $this.clone(true).appendTo(sel), newPos = newEle.position();
    newEle.hide();
    $this.css('position', 'absolute').animate(newPos, speed, function() {
        newEle.show();
        $this.remove();
    });
    return newEle;
  };
});


/// GAME JAVASCRIPT

// Type of moves the player can make in the board
const Move = {
	LEFT: 1,
	RIGHT: 2,
	UP: 3,
	DOWN: 4,
};

// State of the current game
const Status = {
	DEFEAT: 5,
	CAN_MOVE: 6,
	VICTORY: 7,
};

// Point of the board
class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
  }
}


class Board {
	constructor() {
    // Intializing properties
    this.occupiedCells = 2;
    this.SIZE = 4;
    this.board = this.createBoard();

    // By default the board already has 2 numbers (2 | 4).
    this.makeNumberAppear();
    this.makeNumberAppear();
  }

  // Main method from our board. It represents the movement made with any arrow key
	move(move) {
		var reached2048 = false;                          // 2048 is not finished until we find a 2048 cell
		var result = Status.CAN_MOVE;                      // As the game is not finished, the user can still move...

    // FIRST STEP: Gather those cells with the same number. It could find a 2048 cell...
		reached2048 = this.sumCells(move);

    // Board still has empty positions...
		if (this.occupiedCells < (this.SIZE * this.SIZE)) {
			this.compactBoard(move);
			this.makeNumberAppear();
			this.occupiedGrids += 1;

    // Otherwise, the board is full. If reached2048 is true then it's a victory
    } else if (!reached2048) {
			result = Status.DEFEAT;
    } else {
			result = Status.VICTORY;
    }

		return result;
  }

  /// PRIVATE METHODS

  // Create an empty board
  createBoard() {
    var x = new Array(this.SIZE);
    for (var i = 0; i < this.SIZE; ++i) {
      x[i] = new Array(this.SIZE);
      for (var j = 0; j < this.SIZE; ++j) {
        x[i][j] = 0;
      }
    }

    return x;
  }

  // Doesn't leave empty positions between numbers given an specific move
	compactBoard(move) {
    var lastCoordinate = 0;     	   // Last cell seen with a non-zero value.

    if (move == Move.LEFT) {

       for (var y = 0; y < this.SIZE; ++y) {
         for (var x = 0; x < this.SIZE; ++x) {
           if ((this.board[y][x] != 0) && (lastCoordinate != x)) {
            this.board[y][lastCoordinate] = this.board[y][x];
						lastCoordinate += 1;
            this.board[y][x] = 0;

            // Move the cell to the destiny positions

					} else if (this.board[y][x] != 0) {
            lastCoordinate += 1;
          }
        }
        lastCoordinate = 0;
      }

    } else if (move == Move.RIGHT) {
      lastCoordinate = this.SIZE - 1;

			for (var y = (this.SIZE - 1); y >= 0; --y) {
        for (var x = (this.SIZE - 1); x >= 0; --x) {
          if ((this.board[y][x] != 0) && (lastCoordinate != x)) {
            this.board[y][lastCoordinate] = this.board[y][x];
            lastCoordinate -= 1;
            this.board[y][x] = 0;
          } else if (this.board[y][x] != 0) {
            lastCoordinate -= 1;
          }
        }
        lastCoordinate = this.SIZE - 1;
      }

    } else if (move == Move.DOWN) {
      lastCoordinate = this.SIZE - 1;

      for (var x = 0; x < this.SIZE; ++x) {
        for (var y = (this.SIZE - 1); y >= 0; --y) {
          if ((this.board[y][x] != 0) && (lastCoordinate != y)) {
            this.board[lastCoordinate][x] = this.board[y][x];
            lastCoordinate -= 1;
            this.board[y][x] = 0;
          } else if (this.board[y][x] != 0) {
            lastCoordinate -= 1;
          }
        }
        lastCoordinate = this.SIZE - 1;
      }

    } else if (move == Move.UP) {
      lastCoordinate = 0;

      for (var x = 0; x < this.SIZE; ++x) {
        for (var y = 0; y < this.SIZE; ++y) {
          if ((this.board[y][x] != 0) && (lastCoordinate != y)) {
            this.board[lastCoordinate][x] = this.board[y][x];
            lastCoordinate += 1;
            this.board[y][x] = 0;
          } else if (this.board[y][x] != 0) {
            lastCoordinate += 1;
          }
        }
        lastCoordinate = 0;
      }
    }
  }


  // Generate an initial number: 2 or 4
  getRandomNumber() {
    var possibleNumber = [2, 2, 4, 2, 2, 2, 2, 2, 4, 2];

    return possibleNumber[Math.floor((Math.random(0, possibleNumber.length) * 10))];
  }

  // Returns a random position which is empty
  getRandomEmptyPosition() {
    var unoccupiedPos = [];

    for (var i = 0; i < 4; ++i) {
      for (var j = 0; j < 4; ++j) {
        if (this.board[i][j] == 0) {
          unoccupiedPos.push([i, j]);
        }
      }
    }

    return unoccupiedPos[Math.floor((Math.random(0, unoccupiedPos.length) * 10))];
  }

  /*
    Moves a number to another position and removes the number on that destiny position
    Both position parameters are strings like 00, where the first number is the
    row and the second one is the column.
  */
  joinCells(posOrigin, posDestiny, newNumber) {
    var $destinyNumber = $('#' + posDestiny).children('div').first();
    var $newElement = $('#' + posOrigin).children('div').first().animateAppendTo('#' + posDestiny, 'fast');
    var size = $newElement.height();

    // Once our number at the origin position is at the destiny position, we must animate the collision
    $destinyNumber.remove().fadeOut('fast', function() {
      // Some variables
      var newBackground = 'rgb(' + mapBackground.get(newNumber).join(',') + ')';
      var newForeground = 'rgb(' + mapForeground.get(newNumber).join(',') + ')';
      var sizeIncrease = 5, sizeIncreaseHalf = sizeIncrease / 2;
      var time = 50;

      $newElement.children('p').text(newNumber);
      $newElement.animate({'backgroundColor' : newBackground, 'color' : newForeground}, time * 3);
      $newElement.animate({'height' : (size + sizeIncrease) + 'px', 'width' : (size + sizeIncrease) + 'px', 'top' : '-=' + sizeIncreaseHalf + 'px',
                           'left' : '-=' + sizeIncreaseHalf + 'px'},
                           time, function() {
                             $newElement.animate({'height' : size + 'px', 'width' : size + 'px', 'top' : '+=' + sizeIncreaseHalf + 'px',
                             'left' : '+=' + sizeIncreaseHalf + 'px'},
                             time);
                           });
    });
  }


  // Shows a new number in the board
  makeNumberAppear() {
    var number = this.getRandomNumber();
    var position = this.getRandomEmptyPosition();
    var background = mapBackground.get(number).join(',');
    var foreground = mapForeground.get(number).join(',');
    var div = '<div class="rounded cell-number" style="background-color: rgb(' + background + '); color: rgb(' + foreground + ');"><p>' + number + '</p></div>';

    // Animation to make it appear
    $(div).hide().appendTo('#' + position[0] + position[1]).fadeIn('medium');

    // Save the number in the matrix
    this.board[position[0]][position[1]] = number;
  }

  // Joins cells with the same value
  sumCells(move) {
		var lastInt = -1;
    var reached2048 = false;
    var lastCoordinate = 0;

  	if (move == Move.LEFT) {
      for (var y = 0; y < this.SIZE; ++y) {
        for (var x = 0; x < this.SIZE; ++x) {
          if (this.board[y][x] != 0) {

            // Coordinate is saved only in case the last number had a different value or there is not a previous number different from zero
            if ((lastInt == -1) || (lastInt != this.board[y][x])) {
              lastInt = this.board[y][x];
              lastCoordinate = x;
            } else {
              this.joinCells(y + '' + x, y + '' + lastCoordinate, 2 * this.board[y][x]);

              this.board[y][x] = 2 * this.board[y][x];
              this.board[y][lastCoordinate] = 0;
              lastInt = -1;
              this.occupiedCells -= 1;

              // Victory!!
              if (this.board[y][x] == 2048) {
                reached2048 = true;
              }
            }
          }
        }
        lastInt = -1;
      }

    } else if (move == Move.RIGHT) {
      for (var y = 0; y < this.SIZE; ++y) {
        for (var x = this.SIZE; x >= 0; --x) {
          if (this.board[y][x] != 0) {
            if ((lastInt == -1) || (lastInt != this.board[y][x])) {
              lastInt = this.board[y][x];
              lastCoordinate = x;
            } else {
              this.joinCells(y + '' + x, y + '' + lastCoordinate, 2 * this.board[y][x]);

              this.board[y][x] =  2 * this.board[y][x];
              this.board[y][lastCoordinate] = 0;
              lastInt = -1;
              this.occupiedCells -= 1;

              if (this.board[y][x] == 2048) {
                reached2048 = true;
              }
            }
          }
        }
        lastInt = -1;
      }

    } else if (move == Move.DOWN) {
      for (var x = 0; x < this.SIZE; ++x) {
        for (var y = 0; y < this.SIZE; ++y) {
          if (this.board[y][x] != 0) {
            if ((lastInt == -1) || (lastInt != this.board[y][x])) {
              lastInt = this.board[y][x];
              lastCoordinate = y;
            } else {
              this.joinCells(lastCoordinate + '' + x, y + '' + x, 2 * this.board[y][x]);

              this.board[y][x] = 2 * this.board[y][x];
              this.board[lastCoordinate][x] = 0;
              lastInt = -1;
              this.occupiedCells -= 1;

              if (this.board[y][x] == 2048) {
                reached2048 = true;
              }
            }
          }
        }
        lastInt = -1;
      }

    } else if (move == Move.UP) {
      for (var x = 0; x < this.SIZE; ++x) {
        for (var y = (this.SIZE - 1); y >= 0; --y) {
          if (this.board[y][x] != 0) {
            if ((lastInt == -1) || (lastInt != this.board[y][x])) {
              lastInt = this.board[y][x];
              lastCoordinate = y;
            } else {
              this.joinCells(lastCoordinate + '' + x, y + '' + x, 2 * this.board[y][x]);

              this.board[y][x] = this.board[y][x] + this.board[y][x];
              this.board[lastCoordinate][x] = 0;
              lastInt = -1;
              this.occupiedCells -= 1;

              if (this.board[y][x] == 2048) {
                reached2048 = true;
              }
            }
          }
        }
        lastInt = -1;
      }
    }

    return reached2048;
  }
}
