$(() => {

  if(result[0].is_open){
    $('#poll-closed').hide();
  }

  // FOR RESULTS
  $('#irv').on('click', function (){
    console.log('click me here');
    $.ajax({
      url: $(location).attr('pathname'),
      type: 'POST'
    })
  });

  // Advance IRV by 1 step
  $('#irv-once').on('click', function() {
    console.log('clicked irv once');
    $.ajax({
      url: $(location).attr('pathname'),
      method: 'POST',
      data: {
        "fastForward": false
      }
    })
  });

  // Fast forward's IRV to final step
  $('#irv-ff').on('click', function() {
    console.log('clicked');
    $.ajax({
      url: $(location).attr('pathname'),
      method: 'POST',
      data: {
        "fastForward": true
      }
    })
  });

  // Resets IRV
  $('#irv-reset').on('click', function() {
    console.log('clicked');
    $.ajax({
      url: $(location).attr('pathname'),
      method: 'PUT',
    })
  });

});
