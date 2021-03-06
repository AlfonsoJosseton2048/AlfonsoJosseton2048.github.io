![markdown](https://img.shields.io/badge/markdown-HTML5-green.svg)
![stylesheet](https://img.shields.io/badge/stylesheet-CSS3-green.svg)
![javascript](https://img.shields.io/badge/javascript-jQuery-green.svg)
![database](https://img.shields.io/badge/database-Firebase-green.svg)
![license](https://img.shields.io/badge/license-Apache-blue.svg)

# 2048
**Welcome to the Home page of 2048!**

<p align="center">
  <img src="assets/images/2048/logo.png" width="140px" alt="2048 icon">
</p>

### Table of Contents
**[How to play](#how-to-play)**<br>
**[Issues](#issues)**<br>
**[Technologies](#technologies)**<br>

## How to play
2048 is a board game where you will have only even numbers.
All you need to do is to **merge identical numbers**, this way you can reach higher values.<br>
You will get the **victory** once the **2048 value is reached**. :tada: :tada:

<p align="center">
  <img src="assets/images/examples/board.png" width="320px" alt="board">
</p>

At the beginning you'll get only two numbers (could have a value of 2, like in the image, or 4).<br>
You can **merge the numbers by using the arrows keys**:

<p align="center">
  <img src="assets/images/body/arrowkeys.svg" width="150px" alt="arrows">
</p>

You can also merge the numbers by doing the **swipe gesture**, specially for mobile phones:

<p align="center">
  <img src="assets/images/examples/swipe.png" width="300px" alt="swipe gesture">
</p>

Using the arrows or the swipe gesture could make some cells collide, but that event also moves all the numbers in the specified direction:

<p align="center">
  <img src="assets/images/examples/swipeDownExample.png" width="320px" alt="swipe down example">
</p>

Everytime you press an arrow key or use an swipe gesture, **if you move or collide any cell, a new number will appear!** This way you get more and more numbers...

<p align="center">
  <img src="assets/images/examples/newNumberExample.gif" width="320px" alt="new-number">
</p>

If you get as many numbers as cells has the board, then you are in trouble!! :warning: <br>
If you still have any move where you can collide cells your game is still alive, but it will be hard to get out of that situation.

<br>
That moment where you can't do any move (thus, the board is totally occuppied by numbers) then your game is completely lost. :wink:

<p align="center">
  <img src="assets/images/examples/gameOverExample.gif" width="320px" alt="new-number">
</p>

The screen you must reach looks like that:

<p align="center">
  <img src="assets/images/examples/victoryExample.gif" width="320px" alt="new-number">
</p>


## Issues (Currenly disabled)
We're opened to suggestions, that's why we've created a small ['Issues' page](https://AlfonsoJosseton2048.github.io/issues.html), like the Github one :octocat: where you can only create and check the issues other users submitted. <br>
That could be nice in case you don't want to sign in Github or you don't have an account. <br>

Otherwise we prefer you to submit your issue to [Github](https://github.com/AlfonsoJosseton2048/AlfonsoJosseton2048.github.io/issues), so we can discuss and interact with other users. That's up to you!

## Technologies
Which technologies have we used?
* [HTML5](https://www.w3schools.com/html/html5_intro.asp)
* [CSS](https://www.w3schools.com/css/default.asp)
* [Bootstrap](https://getbootstrap.com/)
* [jQuery](https://jquery.com/)
* [jQuery Mobile](http://jquerymobile.com/)
* [jQuery API](https://api.jquery.com/)
* [Firebase](https://firebase.google.com/?hl=es-419)
