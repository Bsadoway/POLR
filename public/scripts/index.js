$(() => {

  $('#email').on('click', function () {
    $('#switch-option').html(
      `<input class="p-2 form-control" type='email' id='creator' name='creator_email' placeholder="E-mail" required>
        <div class="invalid-feedback">
          Must enter a valid e-mail address.
        </div>`
    )
  });

  $('#phone').on('click', function () {
    $('#switch-option').html(
      `<input class="p-2 form-control" type='tel' pattern="[0-9]{3}[ -][0-9]{3}[ -][0-9]{4}" id='creator' name='creator_sms' placeholder="(XXX-XXX-XXXX)" required>
        <div class="invalid-feedback">
          Must enter a valid phone number.
        </div>`
    )
  });
  // add an item to the vote option list
  let count = 3;
  // TODO cap item limit at 10
  $('.add-option').on('click', function () {
    if (count <= 9) {
      $('.options-box').append(
        `<li class="ui-state-default d-flex">
        <div class="p-2 input-group">
          <span class="input-group-addon testing2" id="basic-addon2">${count}</span>
          <input class="form-control" type='text' id='item${count}' name='item' placeholder="Option ${count}" maxlength="22" required>
        <br>
        </div>
      </li>`
      );
      count++;
    }
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
