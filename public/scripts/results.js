$(() => {

  if (result[0].is_open) {
    $('#poll-closed').hide();
  }

  // Advance IRV by 1 step
  $('#irv-once').on('click', function () {
    console.log('clicked irv once');
    $.ajax({
      url: $(location).attr('pathname'),
      method: 'POST',
      data: {
        "fastForward": false
      },
      success: function () {
        location.reload();
      }
    })
  });

  // Fast forward's IRV to final step
  $('#irv-ff').on('click', function () {
    console.log('clicked');
    $.ajax({
      url: $(location).attr('pathname'),
      method: 'POST',
      data: {
        "fastForward": true
      },
      success: function () {
        location.reload();
      }

    })
  });

  // IRV Info button
  $('#irv-info').on('click', function () {
    console.log('clicked');
  });

  // Resets IRV
  $('#irv-reset').on('click', function () {
    console.log('clicked');
    $.ajax({
      url: $(location).attr('pathname'),
      method: 'PUT',
      success: function () {
        location.reload();
      }
    })
  });

});
