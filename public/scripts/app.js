$(() => {
  // TODO separate into js files based on page functions
  // disable close button and send sms to friends button is poll is closed
  // FOR ADMIN
  function checkIfPollClosed() {
    if (!result.is_open) {
      // $('.list-group').remove();
      $('.close-poll').remove();
      $('.friends-button').remove();
      $('#is-poll-closed-text').text('Poll is closed');
    }
  }
  checkIfPollClosed();


  // adds another sms input to the friends form
  // FOR ADMIN
  let smsCount = 3;
  $('.add-sms').on('click', function() {
    $('#friend').append(
      `<input type='text' id='id${smsCount}' class="form-control p-2" name='friends'>`
    );
    smsCount++;
  });

  //copy to clipboard button
  var clipboard = new Clipboard('#copy');
  clipboard.on('success', function(e) {
    $('#copy').tooltip({trigger: 'click'});
  });
  clipboard.on('error', function(e) {
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

  $('.view-results').on('click', function() {
    window.location.href = `/${result.poll_url}/results`;
  });

  // redirect back to create a new poll
  // FOR ADMIN
  $('.create-poll').on('click', function() {
    window.location.href = "/";
  });

  // refresh poll button
  $('#refresh').on('click', function() {
    location.reload();
  });

});
