$(() => {

  // add an item to the vote option list
  let count = 4;
  // TODO cap item limit at 10
  $('.add-vote-element').on('click', function() {
    $('#sortable').append(
      `<li class="ui-state-default">
        <input class="p-2" type='text' id='item${count}' name='item' placeholder="Item${count} goes here">
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





  //sort the options into drag and drop
  $("#sortable").sortable();
  $("#sortable").disableSelection();

  $('#refresh').on('click', function() {
    window.location.reload(true);
  });

  $.validate({

  })

});
