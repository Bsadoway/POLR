$(() => {
  google.charts.load('current', {
    'packages': ['corechart']
  });
  google.charts.setOnLoadCallback(drawChart);


  function drawChart() {
    const url = window.location.pathname;
    console.log(url);
    //
    // $.ajax({
    //   url: url,
    //   method: 'GET'
    // }).done((results) => {
    //   console.log(results);
    // });

    let nameRank = [['Title', 'Rank']];
    result.forEach(item => {
      let items = [];
      items.push(item.poll_item, item.rank);
      nameRank.push(items);
    })

    let pie = google.visualization.arrayToDataTable(nameRank);

    var options = {
      title: 'Results of [NAMEOFPOLL]'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(pie, options);
  }
});
