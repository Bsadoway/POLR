$(() => {
  google.charts.load('current', {
    'packages': ['corechart']
  });
  google.charts.setOnLoadCallback(drawChart);


  function drawChart() {
    const url = window.location.pathname;
    console.log(url);

    // initialize the array and format to google visulation input
    let nameRank = [['Title', 'Rank']];
    result.forEach(item => {
      let items = [];
      items.push(item.poll_item, item.rank);
      nameRank.push(items);
      console.log(nameRank);
    })

    let pie = google.visualization.arrayToDataTable(nameRank);

    var options = {
      title: 'Results of [NAMEOFPOLL]'
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(pie, options);
  }
});