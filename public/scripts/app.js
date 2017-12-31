$(() => {

  // disable close button and send sms to friends button is poll is closed
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
  let smsCount = 2;
  $('.add-sms').on('click', function() {
    $('#friend').append(
       `<input class= "p-2 form-control" type = 'tel' pattern = "[0-9]{3}[ -][0-9]{3}[ -][0-9]{4}" id ='id${smsCount}' name='friends' placeholder="(XXX-XXX-XXXX)" required>
        <div class="invalid-feedback"> Must enter a valid phone number.</div>`
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
  $('.friends-button').on('click', function() {
    $('#friends-form').toggle();
  });

  // admin close poll button
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

  // redirect to results from admin
  $('.view-results').on('click', function() {
    window.location.href = `/${result.poll_url}/results`;
  });

  // validation checks
  $('#needs-validation').on('submit', function () {
    if ($('#needs-validation')[0].checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    $('#needs-validation').addClass('was-validated');
    return true;
  });

});
