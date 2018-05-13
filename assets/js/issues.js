$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDo6ilThVghK4ctbORrJ7ujJrl6IF39VHs",
    authDomain: "uja-2048-52718.firebaseapp.com",
    databaseURL: "https://uja-2048-52718.firebaseio.com",
    projectId: "uja-2048-52718",
    storageBucket: "",
    messagingSenderId: "770426857642"
  };
  firebase.initializeApp(config);

  // Our database
	var db = firebase.database();

  // Listeners
  db.ref().child('issues').on('child_added', function(snapshot) {
		addIssue(snapshot.key, snapshot.val().title, snapshot.val().description, snapshot.val().date);
	});


  /// Listen for events in the interface

  // Click of 'Create issue button'. Adds a new issue to the database
	$('#createIssue').on('click', function(e) {
		// Don't load the page again.
		e.preventDefault();

    var title = $('#titleInsertIssue').val();
    var description = $('#descriptionInsertIssue').val();
    // Are the input values valid?
    if (title && description) {
      // Reference to the issues path
      var issues = db.ref('issues');
      var data = {
        title: title,
      	description: description,
        date: Date.now()
      }
      issues.push(data);
    } else {
      $('#errorInsertUser').text('The title and the description of the issue cannot be empty.');
      $('.modal-dialog').effect('shake', {times: 2}, 600);
    }
	});

  $(document).on('click', '.dropdown-item', function() {
    $('.dropdown-item').removeClass('active');
    $(this).addClass('active');
    console.log($(this).text());
    sortList($(this).text());
  });

  // Exit button or Cancel were pressed, so inputs will be cleaned as well as the error message
  $('.modal').on('click', '.close, #closeModal', function() {
    // Inputs
    $('#titleInsertIssue').val('');
    $('#descriptionInsertIssue').val('');

    // Error message
    $('#errorInsertUser').text('');
  });


  /// 'PRIVATE' METHODS
  // Add an issue to the current list
  function addIssue(key, title, description, dateTimestamp) {
    var date = new Date(dateTimestamp);
    var dateString = 'Date: ' + date.toGMTString();
    $('#issueList').append('<li id="' + key + '" class="list-group-item"><a href=""><h6 class="m-0 p-0"><i class="mr-2 fas fa-exclamation-circle"></i>' + title + '</h6></a><p class="small text-muted m-0 p-0 pt-2">' + dateString + '</p></li>');
  }

  // Save the identifier of the issue to show it in the new page
  $(document).on('click', '.list-group-item', function() {
    console.log('Hola');
  });

  // Sort list of issues
  function sortList(type) {
    var list = document.getElementById('issueList'), i, switching = true, b, shouldSwitch;

    // Loop until no switching is done
    while (switching) {
      switching = false;
      listElements = list.getElementsByTagName('li');

      // Loop through all list-items:
      for (i = 0; i < (listElements.length - 1); i++) {
        shouldSwitch = false;

        // Should we switch the rows?
        console.log(listElements[i].getElementsByTagName('p')[0].innerHTML);
        if ((type == 'Newest') &&
            (listElements[i].getElementsByTagName('p')[0].innerHTML > listElements[i + 1].getElementsByTagName('p')[0].innerHTML)) {
          shouldSwitch = true;
          break;
        } else if ((type == 'Oldest') &&
            (listElements[i].getElementsByTagName('p')[0].innerHTML < listElements[i + 1].getElementsByTagName('p')[0].innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }

      if (shouldSwitch) {
        listElements[i].parentNode.insertBefore(listElements[i + 1], listElements[i]);
        switching = true;
      }
    }
  }
});
