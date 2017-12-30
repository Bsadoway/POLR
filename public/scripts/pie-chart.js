$(() => {
  let nameRank = [];
  result.forEach(item => {
    let items = {};
    items = {
      y: item.rank,
      label: item.poll_item
    }
    nameRank.push(items);
  });

  var chart = new CanvasJS.Chart("piechart", {
    animationEnabled: true,
    title: {
      text: result[0].poll_title
    },
    legend: {
      cursor: "pointer",
      itemclick: explodePie
    },
    data: [{
      type: "pie",
      startAngle: 240,
      yValueFormatString: "##0.00\"%\"",
      showInLegend: "true",
      legendText: "{label}",
      indexLabel: "{label} {y}",
      dataPoints: nameRank,
    }]
  });
  chart.render();

  function explodePie(e) {
    if (typeof(e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
    } else {
      e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
    }
    e.chart.render();

  }
});
