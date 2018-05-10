$(document).ready(function() {
  $('#header').load('templates/header.html');
  $('#footer').load('templates/footer.html');

  // Do we need to show the cookies message?
  var cookies = getCookie('ignoreMessage');
  if (cookies != 'clicked') {
    $('body').append($('<div>').load('templates/cookies.html'));
  }

  // Set the cookie and hide the ignore message once it's pressed
  $(document).on('click', '#ignoreCookies', function() {
    setCookie('ignoreMessage', 'clicked', 365);
    $('.cookies-message').fadeOut('medium');
  });
});
