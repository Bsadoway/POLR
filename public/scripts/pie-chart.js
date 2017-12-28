$(() => {
  google.charts.load('current', {
    'packages': ['corechart']
  });
  google.charts.setOnLoadCallback(drawChart);


  function drawChart() {
    const url = window.location.pathname;
    console.log(url);

    $.ajax({
      url: url,
      method: 'GET'
    }).done((results) => {
      console.log(results);
      // var results = google.visualization.arrayToDataTable([
      //   ['ITEM', 'RANK'],
      //   ['Work', 11],
      //
      // ]);
    });



    var options = {
      title: 'Results of [NAMEOFPOLL]'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data, options);
  }
});
