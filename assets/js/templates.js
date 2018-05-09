$(document).ready(function() {
  $('#header').load('templates/header.html');
  $('#footer').load('templates/footer.html');
  $('.cookies-message').hide();

  // Do we need to show the cookies message?
  var cookies = getCookie('ignoreMessage');
  if (!cookies) {
    $('.cookies-message').show();
  }

  // Set the cookie and hide the ignore message once it's pressed
  $(document).on('click', '#ignoreCookies', function() {
    setCookie('ignoreMessage', true, 365);
    $('.cookies-message').fadeOut('medium');
  });
});
