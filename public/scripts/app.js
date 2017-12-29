$(() => {

  // add an item to the vote option list
  let count = 4;
  // TODO cap item limit at 10
  $('.add-option').on('click', function() {
    $('#options-box').append(
      `<li class="ui-state-default d-flex">
        <input class="p-2" type='text' id='item${count}' name='item' placeholder="option ${count}">
        <br>
      </li>`
    );
    count++;
  });

  // adds another sms input to the friends form
  let smsCount = 3;
  $('.add-sms').on('click', function() {
    $('#friend').append(
      `<input type='text' id='id${smsCount}' class="p-2" name='friends'>`
    );
    smsCount++;
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
      }
    })
  });

  // redirect back to create a new poll
  $('.create-poll').on('click', function(){
    window.location.href = "/";
  });


  //sort the options into drag and drop
  $("#sortable").sortable();
  $("#sortable").disableSelection();

  // refresh poll button
  $('#refresh').on('click', function() {
    window.location.reload(true);
  });

  $.validate({

  })

});
