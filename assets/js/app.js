$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDo6ilThVghK4ctbORrJ7ujJrl6IF39VHs",
    authDomain: "uja-2048-52718.firebaseapp.com",
    databaseURL: "https://uja-2048-52718.firebaseio.com",
    projectId: "uja-2048-52718",
    storageBucket: "uja-2048-52718.appspot.com",
    messagingSenderId: "770426857642"
  };
  firebase.initializeApp(config);

  // Our database
	var db = firebase.database();
  var storage = firebase.storage();

  // Listeners
  db.ref().child('background').once('value', function(snapshot) {
    var backgroundRef = storage.ref('background/' + snapshot.val().current);
    backgroundRef.getDownloadURL().then(
      // Success function
      function(url) {
        $('body').css('background-image', 'url(' + url + ')');
      }).catch(function onError(error) {
      })
	});
});
