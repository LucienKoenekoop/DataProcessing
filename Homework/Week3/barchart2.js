window.onload = function () {

  // set the margin range to fit the axis and values
  var margin = {top: 20, right: 20, bottom: 80, left: 40},
      width = 600 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

  var y = d3.scale.linear().range([height, 0]);

  // define the axis
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  // define the tooltip interaction
  var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<strong>Points:</strong> <span style='color:white'>" + d.Pts + "</span>";
  })

  // add the SVG element
  var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // call the tooltip fucntion
  svg.call(tip);

  // load the json file
  d3.json("uefa.json", function(error, data) {
      data.forEach(function(d) {
          d.Country = d.Country;
          d.Pts = d.Pts;
      });
    
    // scale the range of the data
    x.domain(data.map(function(d) { return d.Country; }));
    y.domain([0, d3.max(data, function(d) { return d.Pts; })]);

    // add x-axis with countries indicating the bars
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-45)");

    // add y-axis with points values for the bars
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Points");

    // Add bar chart and mouse hover events
    svg.selectAll("bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.Country); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.Pts); })
        .attr("height", function(d) { return height - y(d.Pts); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

  });
}