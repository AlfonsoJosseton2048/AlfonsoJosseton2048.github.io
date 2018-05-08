// Returns the value of a cookie taking into account its name
function getCookie(cname) {
  var name = cname + "=";
  var cookieArray = document.cookie.split(';');

  for(var i = 0; i < cookieArray.length; i++) {
      var cookieVar = cookieArray[i];
      while (cookieVar.charAt(0) == ' ') {
        cookieVar = cookieVar.substring(1);
      }
      // Is the specified cname inside this string?
      if (cookieVar.indexOf(name) == 0) {
        return cookieVar.substring(name.length, cookieVar.length);
      }
  }

  return "";
}

// Creates or overwrite the value of a cookie
function setCookie(cname, cvalue, exdays) {
  // Calculate the date where the cookie should expire (exdays)
  var date = new Date();
  date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
  document.cookie = cname + "=" + cvalue + "; expires=" + date + "; path=/";
}
