$(()=>{

  // add an item to the vote option list
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

});
