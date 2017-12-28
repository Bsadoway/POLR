$(() => {

  // add an item to the vote option list
  let count = 4;
  // TODO cap item limit
  $('.fa-plus').on('click', function() {
    $('#sortable').append(
      `<li class="ui-state-default">
        <input class="p-2" type='text' id='item${count}' name='item' placeholder="Item${count} goes here">
        <br>
      </li>`
    );
    count++;
  });


  $('.friends-button').on('click', function() {
    $('#friends-form').append(
      `<form action='' method='POST'>
         <label for='friends'>Phone #</label>
           <input type='text' id='id1' class="p-2" name='friends'>
           <input type='text' id='id2' class="p-2" name='friends'>
           <button type="submit" class="btn btn-primary btn-lg btn-block"> Submit </button>
           <br>
           <i class="fa fa-plus fa-2x" aria-hidden="true"></i>
       </form>`
    );
  });

  //sort the options into drag and drop
  $("#sortable").sortable();
  $("#sortable").disableSelection();


});
