$(document).ready(function() {

  // Disable jQuery mobile text
  $.mobile.loading().hide();

  // Some constraints for the game
  TWEET_LINK = 'https://twitter.com/intent/tweet?text=';

  // Init the game and the colors for each number
  mapBackground = initBackgrounds();
  mapForeground = initForegrounds();

  // Do we have cookies to load our components values?
  // BEST SCORE cookie
  var bestScore = getCookie('bestScore');
  if (bestScore) {
    $('.bestScore').first().text(bestScore);
  }

  // BOARD cookie
  var board = getCookie('board');
  var currentScore = getCookie('currentScore');
  game = new Board(board, currentScore);

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

  // Start a new game
  $(document).on('click', '#startNewGame', function() {
    game.resetGame();
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

  // Listen for arrow events (moves for the game)
  $(document).keydown(function(e) {
    e.preventDefault();     // Prevent scrolling the page when pressing the arrows

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
  });

  // Listen for events from mobiles phones
  $('#board').on('swipeleft', function(e) {
    e.preventDefault();
    game.move(Move.LEFT);
  });

  $('#board').on('swiperight', function(e) {
    e.preventDefault();
    game.move(Move.RIGHT);
  });

  $('#board').on('swipeup', function(e) {
    e.preventDefault();
    game.move(Move.TOP);
  });

  $('#board').on('swipedown', function(e) {
    e.preventDefault();
    game.move(Move.BOTTOM);
  });


  /// NOT RELATED TO EVENTS

  // Initializes the map with the background for each number
  function initBackgrounds() {
    var map = new Map();

    // Insert a color for every available number
    map.set(2, [238, 228, 218]);
    map.set(4, [236, 224, 200]);
    map.set(8, [242, 177, 121]);
    map.set(16, [245, 149, 99]);
    map.set(32, [245, 124, 95]);
    map.set(64, [246, 93, 59]);
    map.set(128, [237, 206, 113]);
    map.set(256, [243, 207, 76]);
    map.set(512, [232, 183, 25]);
    map.set(1024, [232, 183, 25]);
    map.set(2048, [237, 197, 3]);

    return map;
  }

  // Initialize the foreground color for every number
  function initForegrounds() {
    var map = new Map();

    // Insert a color of font for every available number
    map.set(2, [0, 0, 0]);
    map.set(4, [0, 0, 0]);
    map.set(8, [255, 255, 255]);
    map.set(16, [255, 255, 255]);
    map.set(32, [255, 255, 255]);
    map.set(64, [255, 255, 255]);
    map.set(128, [255, 255, 255]);
    map.set(256, [255, 255, 255]);
    map.set(512, [255, 255, 255]);
    map.set(1024, [255, 255, 255]);
    map.set(2048, [255, 255, 255]);

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
    var newEle = this.clone(true).appendTo(sel), newPos = newEle.position(), size = newEle.height();
    newEle.remove();

    this.animate({'top' : newPos.top, 'left' : newPos.left}, {duration: speed, queue: false, complete: function() {
        if (yourFunc != null) {
          yourFunc();     // Custom function
        }
      }
    });
  };

  // AppendTo animation plugin
  $.fn.animateMergeAndAppendTo = function(sel, speed, yourFunc) {
    var sizeIncrease = 10, sizeIncreaseHalf = sizeIncrease / 2;       // Size that the division increases
    var $this = this, newEle = this.clone(true).appendTo(sel), newPos = newEle.position(), size = newEle.height();
    newEle.remove();

    $this.animate({'top' : newPos.top - sizeIncreaseHalf, 'left' : newPos.left - sizeIncreaseHalf, 'height' : (size + sizeIncrease) + 'px',
                   'width' : (size + sizeIncrease) + 'px'}, {duration: speed, queue: false, complete: function() {
                        $this.animate({'height' : size + 'px', 'width' : size + 'px', 'top' : newPos.top,
                                       'left' : newPos.left}, speed, function() {
                                              if (yourFunc != null) {
                                                    yourFunc();     // Custom function
                                              }
                                      });
                        }
                  });
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


class Board {
  // Crea una partida por defecto sin ninguna información previa
	constructor(board, score) {
    if (board) {
      this.resetGame(false);

      // Modify the current score only if valid
      if (score) {
        this.points = parseInt(score);
        $('.currentScore').text(score);
      }

      // Parse the given board with a format like [[32, 0, 2, 1], ...]
      board = board.replace(/[\[\]]+/g, '');
      var number = board.split(',');

      for (var i = 0; i < this.SIZE; ++i) {
        for (var j = 0; j < this.SIZE; ++j) {
          this.board[i][j] = parseInt(number[i * this.SIZE + j]);
          if (this.board[i][j] != 0) {
            this.makeNumberAppear(this.board[i][j], [i, j]);
          }
        }
      }
    } else {
      this.resetGame(true);
    }
  }

  // Main method from our board. It represents the movement made with any arrow key
	move(move) {
    if (this.acceptMove) {
      // From now on we won't accept any other movement event until this one is resolved
      this.acceptMove = false;

      // Some variables for the move
  		var result = Status.CAN_MOVE;                      // As the game is not finished, the user can still move...
      var previousPoints = this.points;

      // FIRST STEP: Gather those cells with the same number. It could find a 2048 cell...
  		var reached2048 = this.sumCells(move);
      var didMove = this.compactBoard(move);

      // Change the numbers of points...
      this.modifyScores(previousPoints, this.points);

      // Board still has empty positions...
      if (reached2048) {
        this.buildEndGamePanel(true, this.points);
        result = Status.VICTORY;
      } else if (this.occupiedCells < (this.SIZE * this.SIZE)) {
        // Make a new number appear when the animations are over
        var $ref = this;
        setTimeout(function() {
            if (didMove) {
  			        $ref.makeRandomNumberAppear();

                // Save the grid as a cookie once the new number appears
                setCookie('board', JSON.stringify($ref.board), 365);
            }
            $ref.acceptMove = true;
        }, 160);

      // Otherwise, the board is full. If reached2048 is true then it's a victory
      } else if (!reached2048) {
        if (this.isGameOver()) {
          this.buildEndGamePanel(false, this.points);
          result = Status.DEFEAT;
        } else {
          var $ref = this;
          setTimeout(function() {
              $ref.acceptMove = true;
          }, 160);
        }
      }

  		return result;
    }
  }

  /// PRIVATE METHODS

  // Builds the content of the end-game panel with the specified amount of points and a
  // correct link.
  buildEndGamePanel(victory, points) {
    if (victory) {
      var div = $('.victoryDiv');
      var link = TWEET_LINK + 'I\'ve won a game of 2048 with ' + points + ' points! https://uja2048.github.io';
    } else {
      var div = $('.defeatDiv');
      var link = TWEET_LINK  + 'I\'ve got ' + points + ' in a 2048 game! https://uja2048.github.io';
    }

    // Modify the division with the number of points and the proper link
    div.find('.pointsImage').text(points);
    div.find('a').attr('href', link.split(' ').join('%20'));
    div.fadeIn('slow');
  }

  // Create an empty board
  createBoard(defaultContent) {
    var x = new Array(this.SIZE);
    for (var i = 0; i < this.SIZE; ++i) {
      x[i] = new Array(this.SIZE);
      for (var j = 0; j < this.SIZE; ++j) {
        x[i][j] = defaultContent;
      }
    }

    return x;
  }

  // Creates a copy of the currently active board
  cloneBoard(board) {
    var x = this.createBoard(0);

    for (var i = 0; i < this.SIZE; i++) {
      for (var j = 0; j < this.SIZE; j++) {
        x[i][j] = board[i][j];
      }
    }

    return x;
  }

  /**
   *  Creates a clone of a number cell. That function is added since we can't make
   *  the same animation twice over the same object, so we remove the already used one and
   *  create another one
   */
  createClone(posBoard) {
    var number = this.board[posBoard[0]][posBoard[1]];
    var background = mapBackground.get(number).join(',');
    var foreground = mapForeground.get(number).join(',');
    var div = '<div class="rounded cell-number" style="background-color: rgb(' + background + '); color: rgb(' + foreground + ');"><p>' + number + '</p></div>';

    // By default the clone is hidden
    return $(div).hide().appendTo('#' + posBoard[0] + posBoard[1]);
  }

  // Doesn't leave empty positions between numbers given an specific move
	compactBoard(move) {
    var lastCoordinate = 0, didMove = false;     	   // Last cell seen with a non-zero value.

    if (move == Move.LEFT) {

       for (var y = 0; y < this.SIZE; ++y) {
         for (var x = 0; x < this.SIZE; ++x) {
           if ((this.board[y][x] != 0) && (lastCoordinate != x)) {
            this.board[y][lastCoordinate] = this.board[y][x];
            this.board[y][x] = 0;

            // Animations
            if (this.moveFrom[y][x] != null) {
              // Merge movement
              didMove = true;
              this.joinCellsAndMove([y, x], this.moveFrom[y][x], [y, lastCoordinate]);

              // Reset point value
              this.moveFrom[y][x] = null;
            } else {
              didMove = true;
              this.moveCell([y, x], [y, lastCoordinate]);
            }

            lastCoordinate += 1;
					} else if (this.board[y][x] != 0) {
            lastCoordinate += 1;

            // Even if there's no empty spaces before the cell, there could be a merge movement
            if (this.moveFrom[y][x] != null) {
              didMove = true;
              this.joinCellsAndMove(this.moveFrom[y][x], [y, x], null);
              this.moveFrom[y][x] = null;
            }
          }
        }
        lastCoordinate = 0;
      }

    } else if (move == Move.RIGHT) {
      lastCoordinate = this.SIZE - 1;

			for (var y = 0; y < this.SIZE; ++y) {
        for (var x = (this.SIZE - 1); x >= 0; --x) {
          if ((this.board[y][x] != 0) && (lastCoordinate != x)) {
            this.board[y][lastCoordinate] = this.board[y][x];
            this.board[y][x] = 0;

            // Animations
            if (this.moveFrom[y][x] != null) {
              // Merge movement
              didMove = true;
              this.joinCellsAndMove([y, x], this.moveFrom[y][x], [y, lastCoordinate]);

              // Reset point value
              this.moveFrom[y][x] = null;
            } else {
              didMove = true;
              this.moveCell([y, x], [y, lastCoordinate]);
            }

            lastCoordinate -= 1;
          } else if (this.board[y][x] != 0) {
            lastCoordinate -= 1;

            if (this.moveFrom[y][x] != null) {
              didMove = true;
              this.joinCellsAndMove(this.moveFrom[y][x], [y, x], null);
              this.moveFrom[y][x] = null;
            }
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
            this.board[y][x] = 0;

            // Animations
            if (this.moveFrom[y][x] != null) {
              // Merge movement
              didMove = true;
              this.joinCellsAndMove([y, x], this.moveFrom[y][x], [lastCoordinate, x]);

              // Reset point value
              this.moveFrom[y][x] = null;
            } else {
              didMove = true;
              this.moveCell([y, x], [lastCoordinate, x]);
            }

            lastCoordinate -= 1;
          } else if (this.board[y][x] != 0) {
            lastCoordinate -= 1;

            if (this.moveFrom[y][x] != null) {
                didMove = true;
                this.joinCellsAndMove(this.moveFrom[y][x], [y, x], null);
                this.moveFrom[y][x] = null;
            }
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
            this.board[y][x] = 0;

            // Animations
            if (this.moveFrom[y][x] != null) {
              // Merge movement
              didMove = true;
              this.joinCellsAndMove([y, x], this.moveFrom[y][x], [lastCoordinate, x]);

              // Reset point value
              this.moveFrom[y][x] = null;
            } else {
              didMove = true;
              this.moveCell([y, x], [lastCoordinate, x]);
            }

            lastCoordinate += 1;
          } else if (this.board[y][x] != 0) {
            lastCoordinate += 1;

            if (this.moveFrom[y][x] != null) {
                didMove = true;
                this.joinCellsAndMove(this.moveFrom[y][x], [y, x], null);
                this.moveFrom[y][x] = null;
            }
          }
        }
        lastCoordinate = 0;
      }
    }

    return didMove;
  }

  // Generates an initial number: 2 or 4
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

    return unoccupiedPos[Math.floor((Math.random() * unoccupiedPos.length))];
  }

  // Checks if the game is over (can we merge any cells?). Take into account this method will be called with the board full of numbers
  isGameOver() {
    var cloneBoard = this.cloneBoard(this.board), cloneMoveFrom = this.cloneBoard(this.moveFrom), gameOver = true;

    for (var i = Move.LEFT; i < Move.DOWN; i++) {
      this.sumCells(i);

      // Was there any merge movement?
      if (this.occupiedCells < (this.SIZE * this.SIZE)) {
        gameOver = false;
        break;
      } else {
        this.board = this.cloneBoard(cloneBoard);
        this.occupiedCells = this.SIZE * this.SIZE;
      }
    }

    this.board = cloneBoard;
    this.moveFrom = cloneMoveFrom;
    this.occupiedCells = this.SIZE * this.SIZE;

    return gameOver;
  }

  /*
    Moves a number from an initial position to a destiny one, removing the cell in the intermediate position.
    Position parameters are arrays like [0, 0]
  */
  joinCellsAndMove(posOrigin, posInter, posDestiny) {
    // From array to string
    var posOriginString = posOrigin.join('');
    var posInterString = posInter.join('');

    // The number we'll animate during all this process
    var $numberDiv = $('#' + posOriginString).children('div').first();
    var $toRemoveDiv = $('#' + posInterString).children('div').first();

    if (posDestiny != null) {
      var newNumber = this.board[posDestiny[0]][posDestiny[1]];
      var posDestinyString = posDestiny.join('');
    } else {
      var newNumber = this.board[posInter[0]][posInter[1]];
      var posDestinyString = posInter.join('');
    }

    // Animation
    // 1. Remove the grid where the first number collides
    $toRemoveDiv.hide().remove();

    // 2. Modifies the number according to the collision
    this.joinCollision(newNumber, $numberDiv);

    // 3. Depending on the type of movement, we still need to move the number in the origin until another position
    // The following animation can only be done once, we need to create a clone...
    var $newElement = this.createClone((posDestiny != null) ? posDestiny : posInter);
    var time = 80;
    $numberDiv.animateMergeAndAppendTo('#' + posDestinyString, time, function() {
      $numberDiv.remove();
      $newElement.show();
    });
  }

  // Animates the collision between two numbers, increasing the size of a cell and decreasing it again
  joinCollision(newNumber, $cell) {
    var size = $cell.height();
    var newBackground = 'rgb(' + mapBackground.get(newNumber).join(',') + ')';
    var newForeground = 'rgb(' + mapForeground.get(newNumber).join(',') + ')';

    $cell.children('p').text(newNumber);
    $cell.css({'background-color' : newBackground, 'color' : newForeground});
  }

  // Shows a new number in the board
  makeRandomNumberAppear() {
    var number = this.getRandomNumber();
    var position = this.getRandomEmptyPosition();
    this.makeNumberAppear(number, position);
  }

  // Shows the specified number in the position that is also given
  makeNumberAppear(number, position) {
    var background = mapBackground.get(number).join(',');
    var foreground = mapForeground.get(number).join(',');
    var div = '<div class="rounded cell-number" style="background-color: rgb(' + background + '); color: rgb(' + foreground + ');"><p>' + number + '</p></div>';

    // Animation to make it appear
    $(div).hide().appendTo('#' + position[0] + position[1]).fadeIn('medium');

    // Save the number in the matrix
    this.board[position[0]][position[1]] = number;

    // Increase the number of cells
    this.occupiedCells += 1;
  }

  // Changes the scores values and creates the animation to show the difference of points
  modifyScores(prevScore, nextScore) {
    if (prevScore != nextScore) {
      // Scores to manipulate and animate
      var originalScore = $('.currentScore').first();
      var clone = originalScore.first().clone();
      $('#currentScoreContainer').append(clone);

      // Animation to show the amount of points we've got, and score modification
      clone.text('+' + (nextScore - prevScore));
      clone.css('font-size', '18px');
      clone.animate({top : '-=100px', 'opacity' : '0'}, 'slow', function() { clone.remove(); });
      $('.currentScore').first().text(nextScore);

      // Save the cookie with the current score
      setCookie('currentScore', nextScore, 365);

      // Do we need to change the value of best score?
      var bestScore = parseInt($('.bestScore').text());
      if (bestScore < nextScore) {
        $('.bestScore').text(nextScore);
        setCookie('bestScore', nextScore, 365);
      }
    }
  }

  // Moves a cell from a origin position to a destiny with an animation
  moveCell(posOrigin, posDestiny, deleteCell = true) {
    var posOriginString = posOrigin.join('');
    var posDestinyString = posDestiny.join('');
    var $cell = $('#' + posOriginString).children('div').first();
    var time = 120;

    // The following animation can only be done once, we need to create a clone...
    var $newElement = this.createClone(posDestiny);
    $cell.animateAppendTo('#' + posDestinyString, time, function() {
      $cell.remove();
      $newElement.show();
    });
  }

  // Cleans all the variables and UI components to start a new game
  resetGame(createNumbers = true) {
    // Hide end-game panels
    $('#victoryDiv').hide();
    $('#defeatDiv').hide();

    // Delete the cookies of the current game
    setCookie('currentScore', 0, -1);
    setCookie('board', 0, -1);

    // Restarting properties
    this.acceptMove = true;       // We won't accept moves until the current one (if there's a move at this moment) is fully computed
    this.occupiedCells = 0;
    this.SIZE = 4;                // Size of the board
    this.board = this.createBoard(0);     // 0 is the default value
    this.moveFrom = this.createBoard(null);
    this.points = 0;

    // Clean UI
    $('div').remove('.cell-number');
    $('.currentScore').text('0');


    // By default the board already has 2 numbers (2 | 4).
    if (createNumbers) {
      this.makeRandomNumberAppear();
      this.makeRandomNumberAppear();
    }
  }

  // Joins cells with the same value
  sumCells(move) {
		var lastInt = -1, reached2048 = false, lastCoordinate = 0;

  	if (move == Move.LEFT) {
      for (var y = 0; y < this.SIZE; ++y) {
        for (var x = 0; x < this.SIZE; ++x) {
          if (this.board[y][x] != 0) {

            // Coordinate is saved only in case the last number had a different value or there is not a previous number different from zero
            if ((lastInt == -1) || (lastInt != this.board[y][x])) {
              lastInt = this.board[y][x];
              lastCoordinate = x;
            } else {
              this.board[y][x] = 2 * this.board[y][x];
              this.board[y][lastCoordinate] = 0;
              this.moveFrom[y][x] = [y, lastCoordinate];    // Save the origin of that merge move
              lastInt = -1;
              this.occupiedCells -= 1;
              this.points += this.board[y][x];

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
        for (var x = (this.SIZE - 1); x >= 0; --x) {
          if (this.board[y][x] != 0) {
            if ((lastInt == -1) || (lastInt != this.board[y][x])) {
              lastInt = this.board[y][x];
              lastCoordinate = x;
            } else {
              this.board[y][x] =  2 * this.board[y][x];
              this.board[y][lastCoordinate] = 0;
              this.moveFrom[y][x] = [y, lastCoordinate];
              lastInt = -1;
              this.occupiedCells -= 1;
              this.points += this.board[y][x];

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
        for (var y = (this.SIZE - 1); y >= 0; --y) {
          if (this.board[y][x] != 0) {
            if ((lastInt == -1) || (lastInt != this.board[y][x])) {
              lastInt = this.board[y][x];
              lastCoordinate = y;
            } else {
              this.board[y][x] = 2 * this.board[y][x];
              this.board[lastCoordinate][x] = 0;
              this.moveFrom[y][x] = [lastCoordinate, x];
              lastInt = -1;
              this.occupiedCells -= 1;
              this.points += this.board[y][x];

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
        for (var y = 0; y < this.SIZE; ++y) {
          if (this.board[y][x] != 0) {
            if ((lastInt == -1) || (lastInt != this.board[y][x])) {
              lastInt = this.board[y][x];
              lastCoordinate = y;
            } else {
              this.board[y][x] = this.board[y][x] + this.board[y][x];
              this.board[lastCoordinate][x] = 0;
              this.moveFrom[y][x] = [lastCoordinate, x];
              lastInt = -1;
              this.occupiedCells -= 1;
              this.points += this.board[y][x];

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
