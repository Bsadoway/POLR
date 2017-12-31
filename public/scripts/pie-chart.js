$(() => {
  google.charts.load('current', {
    'packages': ['corechart']
  });
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    const url = window.location.pathname;

    // initialize both normal and IRV arrays and format to google visulation input
    let nameRank = [['Title', 'Rank']];
    result.forEach(item => {
      let items = [];
      items.push(item.poll_item, item.rank);
      nameRank.push(items);
    })

    let irvRank = [['Title', 'IRVrank']];
    result.forEach(item => {
      let items = [];
      items.push(item.poll_item, item.irv_rank);
      irvRank.push(items);
    })

    let pie = google.visualization.arrayToDataTable(nameRank);
    let pieIRV = google.visualization.arrayToDataTable(irvRank);

    var options = {
      title: `${result[0].poll_title}`,
      chartArea: { width: '90%', height: '90%' },
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    var chart2 = new google.visualization.PieChart(document.getElementById('piechartIRV'));

    chart.draw(pie, options);
    chart2.draw(pieIRV, options);
  }
});
