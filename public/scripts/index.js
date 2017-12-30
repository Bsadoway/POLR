$(() => {

  // add an item to the vote option list
  let count = 4;
  // TODO cap item limit at 10
  $('.add-option').on('click', function () {
    if (count <= 9) {
      $('.options-box').append(
        `<li class="ui-state-default d-flex">
        <div class="p-2 input-group">
          <span class="input-group-addon testing2" id="basic-addon2">${count}</span>
          <input class="form-control" type='text' id='item${count}' name='item' placeholder="Option ${count}" maxlength="22">
        <br>
        </div>
      </li>`
      );
      count++;
    }
  });

  $('.sms-info').on('click', function () {
    $('.sms-info').popover('toggle');
  });

  $('#needs-validation').on('submit', function () {
    if ($('#needs-validation')[0].checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    $('#needs-validation').addClass('was-validated');
    return true;
  });

});
