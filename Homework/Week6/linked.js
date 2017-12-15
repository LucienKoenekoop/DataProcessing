/*
Lucien Koenekoop
10531661

Data Processing
Week 6
*/

window.onload = function () {

	var countries = ["#BE", "#BG", "#CZ", "#DK", "#DE", "#EE", "#IE", "#GR", "#ES", "#FR", 
					 "#HR", "#IT", "#CY", "#LV", "#LT", "#LU", "#HU", "#MA", "#NL", "#AT",
					 "#PL", "#RO", "#SI", "#SK", "#FI", "#SE", "#GB", "#IS", "#NO", "#AL",
					 "#ME", "#MK", "#TR"];

	// set the margin range to fit the axis and values
	var margin = {top: 20, right: 20, bottom: 80, left: 60},
	    width = 800 - margin.left - margin.right,
	    height = 320 - margin.top - margin.bottom,
	    currentCountry;

	// set the ranges of the axes
	var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
	var y = d3.scale.linear().range([height, 0]);

	var x2 = d3.scale.ordinal().rangeRoundBands([0, width], .1);
	var y2 = d3.scale.linear().range([height, 0]);

	// define the axes
	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10);

	var xAxis2 = d3.svg.axis()
	    .scale(x2)
	    .orient("bottom")

	var yAxis2 = d3.svg.axis()
	    .scale(y2)
	    .orient("left")
	    .ticks(10);

	// add the SVG element
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
	// load the different data files	
	queue()
		.defer(d3.json, 'energy200415.json')
		.defer(d3.csv, 'renewable.csv')
		.defer(d3.xml, 'europe.svg')
		.await(makeChartAndMap);

	function makeChartAndMap(error, json1, csv, xml) {

		// error checking if data was correctly loaded
		if (error) throw error;

		// draw the map of Europe
		document.body.appendChild(xml.documentElement);

		// scale the range of the data
	    x.domain(json1.map(function(d) { return d.Country; }));
	    y.domain([0, 100]);

	    // add x-axis with countries indicating the bars
	    svg.append("g")
	    	.attr("id", "xAxis")
	        .attr("class", "x axis")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis)
	      .selectAll("text")
	        .style("text-anchor", "start")
	        .attr("dx", "-.8em")
	        .attr("dy", "-.55em")
	        .attr("transform", "translate(0,15)");

	    // add y-axis with points values for the bars
	    svg.append("g")
	    	.attr("id", "yAxis")
	        .attr("class", "y axis")
	        .call(yAxis)
	      .append("text")
	        .attr("transform", "rotate(-90)")
	        .attr("x", -10)
	        .attr("y", -40)
	        .attr("dy", ".71em")
	        .style("text-anchor", "end")
	        .text("Renewable Energy of Total (%)");

	    // Add bar chart and mouse hover events
	    svg.selectAll("bar")
	        .data(json1)
	      .enter().append("rect")
	        .attr("id", "bar")
	        .attr("x", function(d) { return x(d.Country); })
	        .attr("width", x.rangeBand())
	        .attr("y", function(d) { return y(d[2015]); })
	        .attr("height", function(d) { return height - y(d[2015]); });

		// syle the countries and implement the mouse events
		for (i = 0; i <= countries.length - 1; i++) {
			country = d3.select(countries[i])
			.attr("stroke", "black")
		  	.attr("fill", "rgba(8, 81, 156, 0.6)")
		  	.attr("class", "countries")
		  	.on("mouseover", hover)
		  	.on("mouseout", out)
		  	.on("click", click);
		  };

		// highlights countries at mouse hover
		function hover() {
			d3.select(this)
				.style("fill", "crimson");
		};

		// stop highlighting countries when mouse is out
		function out() { 
			d3.select(this)
				.style("stroke", "black")
		  		.style("fill", "rgba(8, 81, 156, 0.6)");
		};

		// function contains all the events when clicking a country
		function click() {
					
			// select the clicked country
			country = d3.select(this)

			// search for the current country in the csv data file
			for (i = 0; i <= countries.length - 1; i++) {
				if (country[0][0].id == (csv[i].Country)) {
					currentCountry = csv[i];

					// store the csv data of the current country in a dict
					var csvdata = [
					{
						"name": "Energy",
						"value": currentCountry.Energy
					},
					{
						"name": "Biofuels",
						"value": currentCountry.Biofuels
					},
					{
						"name": "Hydropower",
						"value": currentCountry.Hydropower
					},
					{
						"name": "Wind",
						"value": currentCountry.Wind
					},
					{
						"name": "Solar",
						"value": currentCountry.Solar
					},
					{
						"name": "Geothermal",
						"value": currentCountry.Geothermal
					}
					];

					// set the domains of the secondairy axes 
					xLabels = ["Energy", "Biofuels", "Hydropower", "Wind", "Solar", "Geothermal"];
					x2.domain(xLabels);

					yLabels = [currentCountry.Energy, currentCountry.Biofuels, currentCountry.Hydropower,
							   currentCountry.Wind, currentCountry.Solar, currentCountry.Geothermal];
					y2.domain([0, currentCountry.Energy]);

					// append the secondairy x-axis
				    svg.append("g")
				    	.attr("id", "xAxis2")
				        .attr("class", "x axis")
				        .attr("transform", "translate(0," + height + ")")
				        .call(xAxis2)
				      .selectAll("text")
				        .style("text-anchor", "start")
				        .attr("dx", "-.8em")
				        .attr("dy", "-.55em")
				        .attr("transform", "translate(0,15)");

				    // check wether the secondairy y-axis already exists, if so remove it and the current secondairy bars
				    if (typeof(d3.selectAll("#yAxis2")) !== 'undefined' || d3.selectAll("#yAxis2") !== null) {
				    	d3.select("#yAxis2").remove();
				    	d3.selectAll("#bar2").remove();
				    }

				    // append the scondairy y-axis
		    		svg.append("g")
		    			.attr("id", "yAxis2")
				        .attr("class", "y axis")
				        .call(yAxis2)
				      .append("text")
				        .attr("transform", "rotate(-90)")
				        .attr("x", -10)
				        .attr("y", -40)
				        .attr("dy", ".71em")
				        .style("text-anchor", "end")
				        .text("Distribution of Renewable Energy");

				    // append the secondairy bars
				    svg.selectAll("bar")
				        .data(csvdata)
				      .enter().append("rect")
				        .attr("id", "bar2")
				        .attr("x", function(d) { return x2(d.name); } )
				        .attr("width", x2.rangeBand())
				        .attr("y", function(d) { return y2(d.value); })
				        .attr("height", function(d) { return height - y2(d.value); });
				};	
			};

			// create a switch for the opacity of the primairy and secondairy axes and bars
			var active = bar.active ? false : true,
				newOpacity = active ? 0 : 1;

			var inactive = bar2.inactive ? false : true,
				oldOpacity = inactive ? 1 : 0;

			// change the opacity of the primairy bars and axes
			d3.selectAll("#bar").style("opacity", newOpacity);
			d3.selectAll("#xAxis").style("opacity", newOpacity);
			d3.selectAll("#yAxis").style("opacity", newOpacity);
			bar.active = active;

			// change the opacity of the secondaity bars and axes
			d3.selectAll("#bar2").style("opacity", oldOpacity);
			d3.selectAll("#xAxis2").style("opacity", oldOpacity);
			d3.selectAll("#yAxis2").style("opacity", oldOpacity);
			bar2.inactive = inactive;
		};
	};
};