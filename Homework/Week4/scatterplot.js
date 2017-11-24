window.onload = function () {

	var margin = {top: 50, right: 400, bottom: 150, left: 100},
    	width = 1400 - margin.left - margin.right,
    	height = 600 - margin.top - margin.bottom;

	var x = d3.scale.linear()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var r = d3.scale.linear()
  		.range([3.5,50]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .tickSize(-height)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .tickSize(-width)
	    .orient("left");

	var tip = d3.tip()
		.attr("class", "d3-tip")
		.offset([-10,0])
		.html(function(d) {
			return "<strong>Country:</strong> <span style='color:white'>" + d.Country + "</span><br><strong>Value:</strong> <span style='color:white'>€" + d.Value + " mld</span>"; 
		})

	var svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	d3.tsv("data.tsv", function(error, data) {
	  if (error) throw error;

	  data.forEach(function(d) {
	    d.Points = +d.Points;
	    d.Foreigners = +d.Foreigners;
	    d.Value = +d.Value;
	  });

	  x.domain(d3.extent(data, function(d) { return d.Points; })).nice();
	  y.domain(d3.extent(data, function(d) { return d.Foreigners; })).nice();
	  r.domain(d3.extent(data, function(d) { return d.Value; })).nice()

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("Points");

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Percentage Foreign Players (%)")

	  svg.selectAll(".dot")
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("cx", function(d) { return x(d.Points); })
	      .attr("cy", function(d) { return y(d.Foreigners); })
	      .attr("r", function(d) {return r(d.Value); })
	      .style("fill", function(d) { return color(d.Country); })
	      .on("mouseover", tip.show)
	      .on("mouseout", tip.hide)

	  var legend = svg.selectAll(".legend")
	      .data(color.domain())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(25," + i * 20 + ")"; });

	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color);

	  legend.append("text")
	      .attr("x", width + 10)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "start")
	      .text(function(d) { return d; });

      legend.on("mouseover", function(type) {
      	  d3.selectAll(".legend")
        	.style("opacity", 0.1);
      	  d3.select(this)
        	.style("opacity", 1);
      	  d3.selectAll(".dot")
        	.style("opacity", 0.1)
        	.filter(function(d) { return d["Country"] == type; })
        	.style("opacity", 1);
    	})
    	.on("mouseout", function(type) {
      	  d3.selectAll(".legend")
        	.style("opacity", 1);
      	  d3.selectAll(".dot")
        	.style("opacity", 1);
    	});
	});
}