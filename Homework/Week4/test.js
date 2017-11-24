/*
Lucien Koenekoop
10531661

Data Processing
Week 4
*/

window.onload = function () {

	// loads the svg
	d3.xml("test.svg", "image/svg+xml", function(error, xml) {
	    if (error) throw error;
	    document.body.appendChild(xml.documentElement);

	    // lists for legend boxes and colors
	    var boxes = ['#kleur1', '#kleur2', '#kleur3', '#kleur4', '#kleur5', '#kleur6'];
	    var colors = ['#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824'];

	    // lists for legend rects and text
	    var rects = ['#tekst1', '#tekst2', '#tekst3', '#tekst4', '#tekst5', '#tekst6'];
	    var text = ['100', '1000', '10000', '100000', '1000000', '10000000'];

	    // set values for rect element attributes
	    var id_kleur = 'kleur';
	    var id_tekst = 'tekst';
	    var x_kleur = 13;
	    var y_kleur = 13.5;
	    var x_tekst = 46.5;
	    var y_tekst = 13.5;
	    var class_kleur = "st1";
	    var class_tekst = "st2";
	    var width_kleur = 21;
	    var height_kleur = 29;
	    var width_tekst = 119.1;
	    var height_tekst = 29;
	    var dist = 40;

	    // selects the svg element
	    var svg = d3.select("svg")

	    for (i = 1; i <= boxes.length; i++) {

	    	// appends the svg element with rect elements for the legend boxes
	    	svg.append("rect")
	    	.attr("id", id_kleur + i)
	    	.attr("x", x_kleur)
	    	.attr("y", y_kleur + (dist * (i-1)))
	    	.attr("class", class_kleur)
	    	.attr("width", width_kleur)
	    	.attr("height", height_kleur);

	    	// appends the svg element with rect elements for the legend tekst
	    	svg.append("rect")
	    	.attr("id", id_tekst + i)
	    	.attr("x", x_tekst)
	    	.attr("y", y_tekst + (dist * (i-1)))
	    	.attr("class", class_tekst)
	    	.attr("width", width_tekst)
	    	.attr("height", height_tekst);
	    	
			// selects the boxes and fills them with colors
	    	var box = d3.select(boxes[i - 1])
    			.style("fill", colors[i - 1]);

    		// places text elements over the rect elements and fills them with text
    		var rect = d3.select(rects[i - 1])
			svg.append("text")
				.attr("x", Number(rect.attr("x")) + 10)
				.attr("y", Number(rect.attr("y")) + 20)
				.text(text[i - 1]);
    				
    	}
	});

}