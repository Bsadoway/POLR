$(() => {
  //sort the options into drag and drop
  $("#sortable").sortable({
    placeholder: "ui-state-highlight"
  });
  $("#sortable").disableSelection();

});
