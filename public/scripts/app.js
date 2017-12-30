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

  // Toggles popover text whenever an element is clicked
  $('.testing2').on('click', function () {
    $('.testing2').popover('toggle');
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

  // Will pop up an dismissable alert box for errors.
  $('put-your-class-here').on('click', function() {
    // $('.alert').alert('close');
    $('.alert').remove();
    $('#poll_title').append(
      `<div class="alert alert-warning alert-dismissible fade show" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <strong>Holy guacamole!</strong> You should check in on some of those fields below.
      </div>`
    );
  });

  $.validate({

  })

});
