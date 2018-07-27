$(document).ready(function() {
  // Check page scroll to make the 'Scroll' button visible
  $(window).scroll(function() {
    if ($(window).scrollTop() > 400) {
      $('#scrollToTop').show();
    } else {
      $('#scrollToTop').hide();
    }
  });
});
