/*
Lucien Koenekoop
10531661

Data Processing
Week 5
*/

window.onload = function () {

	// set the size for the plot and it's margins
	var margin = {top: 50, right: 70, bottom: 50, left: 60},
	    width = 1024 - margin.left - margin.right,
	    height = 576 - margin.top - margin.bottom;

	// reformats the date in actual time
	var parseDate = d3.time.format("%Y%m%d").parse; 

	// set the ranges
	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	// set different colors for different lines
	var color = d3.scale.category10();

	// define the axes
	var xAxis = d3.svg.axis()
		.scale(x)
		.tickSize(-height)
	    .orient("bottom")
	    .ticks(12);

	var yAxis = d3.svg.axis()
		.scale(y)
		.tickSize(-width)
		.tickFormat(function(d) { return d + " °C"})
	    .orient("left")
	    .ticks(10);

	// define the lines
	var avgLine = d3.svg.line()
		.interpolate("basis")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.avg / 10); });

	var maxLine = d3.svg.line()
		.interpolate("basis")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.max / 10); });

	var minLine = d3.svg.line()
		.interpolate("basis")
	    .x(function(d) { return x(d.date); })
	    .y(function(d) { return y(d.min / 10); });
	    
	// adds the svg canvas
	var svg = d3.select("body")
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// get the data
	d3.json("1993.json", function(error, data) {
	    data.forEach(function(d) {
	    	d.id = d.id;
			d.date = parseDate(d.date);
			d.avg = +d.avg;
			d.max = +d.max;
			d.min = +d.min;
			
	    });

	    // strips the date and id datalist from the dataset
	    color.domain(d3.keys(data[0]).filter(function(key) {
      	  return key !== "date" &&  key !== "id";
    	}));

	    // create a dict with for the 3 left datalists with it's date and temperature
	    var tempLines = color.domain().map(function(name) {
	      return {
	        name: name,
	        values: data.map(function(d) {
	          return {
	            date: d.date,
	            temperature: +d[name]
	          };
	        })
	      };
	    });

	    // scale the range of the data
	    x.domain(d3.extent(data, function(d) { return d.date; })).nice();
	    // y.domain(d3.extent(data, function(d) { return d.avg / 10; })).nice();
	    y.domain([-20,40]);

	    // nest the entries by id
	    var ID = d3.nest()
	        .key(function(d) {return d.id;})
	        .entries(data);

	    // loop through the entries
	    ID.forEach(function(d) {

	        svg.append("path")
	            .attr("class", "line")
	            .style("stroke", function() {
                	return d.color = color(tempLines[0].name); })
	            .attr("d", maxLine(d.values));

	        svg.append("path")
	            .attr("class", "line")
	            .style("stroke", function() {
                	return d.color = color(tempLines[1].name); })
	            .attr("d", avgLine(d.values));

	        svg.append("path")
	            .attr("class", "line")
	            .style("stroke", function() {
                	return d.color = color(tempLines[2].name); })
	            .attr("d", minLine(d.values));  

	    });

	    // add the X Axis
	    svg.append("g")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis)
	      .selectAll("text")
	      	.attr("class", "label")
	        .style("text-anchor", "end")
	        .attr("dx", "-.8em")
	        .attr("dy", "-.55em")
	        .attr("transform", "rotate(-45)");

	    // add the Y Axis
	    svg.append("g")
	        .attr("class", "y axis")
	        .call(yAxis)
	      .append("text")
	      	.attr("class", "label")
	        .attr("transform", "rotate(-90)")
	        .attr("y", -50)
	        .attr("dy", ".71em")
	        .style("text-anchor", "end")
	        .text("Temperature");

	    // add the legend
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

	    // add mouse event listeners to the legend
	    legend.on("mouseover", function(type) {
      	  d3.selectAll(".legend")
        	.style("opacity", 0.1);
      	  d3.select(this)
        	.style("opacity", 1);
      	  d3.selectAll(".line")
        	.style("opacity", 0.1)
        	.filter(function(d) { return d == type; })
        	.style("opacity", 1);
        	// console.log(data);
    	})
    	.on("mouseout", function(type) {
      	  d3.selectAll(".legend")
        	.style("opacity", 1);
      	  d3.selectAll(".line")
        	.style("opacity", 1);
        });

    	// add mouse-over-effects to the plot
	    var mouseG = svg.append("g")
      		.attr("class", "mouse-over-effects");

      	mouseG.append("path")
	      .attr("class", "mouse-line")
	      .style("stroke", "black")
	      .style("stroke-width", "1px")
	      .style("opacity", "0");

	    var lines = document.getElementsByClassName('line');

	    var mousePerLine = mouseG.selectAll('.mouse-per-line')
	      .data(tempLines)
	      .enter().append("g")
	      .attr("class", "mouse-per-line");

	    // creates small cirkle at intersection of vertical hover-line and graph lines
	    mousePerLine.append("circle")
	      .attr("r", 7)
	      .style("stroke", function(d) {
	        return color(d.name);
	      })
	      .style("fill", "none")
	      .style("stroke-width", "1px")
	      .style("opacity", "0");

	    mousePerLine.append("text")
      	  .attr("transform", "translate(10,3)");

      	// apply mouse-over/on/out-effects
      	mouseG.append('svg:rect')
	      .attr('width', width)
	      .attr('height', height)
	      .attr('fill', 'none')
	      .attr('pointer-events', 'all')
	      .on('mouseout', function() {
	        d3.select(".mouse-line")
	          .style("opacity", "0");
	        d3.selectAll(".mouse-per-line circle")
	          .style("opacity", "0");
	        d3.selectAll(".mouse-per-line text")
	          .style("opacity", "0");
	      })
	      .on('mouseover', function() {
	        d3.select(".mouse-line")
	          .style("opacity", "1");
	        d3.selectAll(".mouse-per-line circle")
	          .style("opacity", "1");
	        d3.selectAll(".mouse-per-line text")
	          .style("opacity", "1");
	      })
	      .on('mousemove', function() {
	        var mouse = d3.mouse(this);
	        d3.select(".mouse-line")
	          .attr("d", function() {
	            var d = "M" + mouse[0] + "," + height;
	            d += " " + mouse[0] + "," + 0;
	            return d;
	          });

	        // show pop-up values of variables
	        d3.selectAll(".mouse-per-line")
	          .attr("transform", function(d, i) {
	            // console.log(width/mouse[0])
	            var xDate = x.invert(mouse[0]),
	                bisect = d3.bisector(function(d) { return d.date; }).right;
	                idx = bisect(d.values, xDate);
	            
	            var beginning = 0,
	                end = lines[i].getTotalLength(),
	                target = null;

	            while (true){
	              target = Math.floor((beginning + end) / 2);
	              pos = lines[i].getPointAtLength(target);
	              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
	                  break;
	              }
	              if (pos.x > mouse[0])      end = target;
	              else if (pos.x < mouse[0]) beginning = target;
	              else break; //position found
	            }
	            
	            d3.select(this).select('text')
	              .text(y.invert(pos.y).toFixed(2) + "˚C\n" + x.invert(pos.x))
	              
	            return "translate(" + mouse[0] + "," + pos.y +")";
	        });
		});
	})
}