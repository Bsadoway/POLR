$(() => {
  let count = 4;
  // TODO cap item limit
  $('.fa-plus').on('click', function(){
    $('.new-item').append(
      `<div class="">
        <h4>${count}</h4>
        <input class="p-2 d-flex" type='text' id='item${count}' name='item' placeholder="Item${count} goes here">
        <br>
      </div>`
    );
    count++;
  });
});
