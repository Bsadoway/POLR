$(() => {
  let count = 4;
  // TODO cap item limit
  $('.fa-plus').on('click', function(){
    $('#sortable').append(
      `<li class="ui-state-default">
        <input class="p-2" type='text' id='item${count}' name='item' placeholder="Item${count} goes here">
        <br>
      </li>`
    );
    count++;
  });

  $( "#sortable" ).sortable();
  $( "#sortable" ).disableSelection();



});
