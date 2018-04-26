$(document).ready(function() {
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
