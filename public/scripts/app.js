$(() => {
  // TODO separate into js files based on page functions

  // disable close button and send sms to friends button is poll is closed
  // FOR ADMIN
  function checkIfPollClosed() {
    if (!result.is_open) {
      $('.close-poll').addClass('disabled').attr('disabled', 'disabled');
      $('.friends-button').addClass('disabled').attr('disabled', 'disabled');
      $('#is-poll-closed-text').text('Poll is closed');
    }
  }
  checkIfPollClosed();

  // add an item to the vote option list
  // FOR INDEX
  let count = 4;
  // TODO cap item limit at 10
  $('.add-option').on('click', function() {
    $('.options-box').append(
      `<li class="ui-state-default d-flex">
        <input class="p-2" type='text' id='item${count}' name='item' placeholder="option ${count}">
        <br>
      </li>`
    );
    count++;
  });

  // adds another sms input to the friends form
  // FOR ADMIN
  let smsCount = 3;
  $('.add-sms').on('click', function() {
    $('#friend').append(
      `<input type='text' id='id${smsCount}' class="p-2" name='friends'>`
    );
    smsCount++;
  });

  // toggle friends sms form
  // FOR ADMIN
  $('.friends-button').on('click', function() {
    $('#friends-form').toggle();
  });

  // admin close poll button
  // FOR ADMIN
  $('.close-poll').on('click', function() {
    $.ajax({
      url: $(location).attr('pathname'),
      type: 'PUT',
      success: function() {
        alert('Poll successfully closed');
        location.reload();
      }
    })
  });

  $('.view-results').on('click', function () {
    // const resultsUrl = result.poll_url + '/results';
    $.ajax({
      url: 'results',
      type: 'GET',
      success: function() {
        window.location.href = 'results';
      }
    })
  });

  // redirect back to create a new poll
  // FOR ADMIN
  $('.create-poll').on('click', function() {
    window.location.href = "/";
  });


  //sort the options into drag and drop
  // FOR VOTING
  $("#sortable").sortable();
  $("#sortable").disableSelection();

  // refresh poll button
  $('#refresh').on('click', function() {
    location.reload();
  });

  $.validate({

  })

});
