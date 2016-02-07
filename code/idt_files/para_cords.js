function loadCords(dataFile) {
	$('#para_cords').find('canvas, svg').remove();

	var parcoords = d3.parcoords()("#para_cords").alpha(0.2).mode("queue")// progressive rendering
	.height(240).margin({
		top : 36,
		left : 80,
		right : 0,
		bottom : 16
	});

	// load csv file and create the chart
	//d3.csv('./idt_files/data/count_merge_refine_last_week.csv', function(data) {
	d3.csv(dataFile, function(data) {
		// slickgrid needs each data element to have an id
		data.forEach(function(d, i) {
			//d.id = d.id || i;
		});

		parcoords.data(data).color(function() {
			return colors(colorIndex);
		}).alpha(0.2).render().reorderable().brushMode("1D-axes").interactive().rate(200);
		// setting up grid
		var column_keys = d3.keys(data[0]);
		var columns = column_keys.map(function(key, i) {
			return {
				id : key,
				name : key,
				field : key,
				sortable : true
			};
		});
		// create data table, row hover highlighting
		var grid = d3.divgrid();
		d3.select("#grid").datum(data.slice(0, 100)).call(grid).selectAll(".row").on({
			"mouseover" : function(d) {
				parcoords.highlight([d]);
			},
			"mouseout" : parcoords.unhighlight
		});
		parcoords.on("brush", function(d) {
			d3.select("#grid").datum(d.slice(0, 100)).call(grid).selectAll(".row").on({
				"mouseover" : function(d) {
					parcoords.highlight([d]);
				},
				"mouseout" : parcoords.unhighlight
			});
		});

	});

	d3.select('#btnReset').on('click', function() {
		parcoords.brushReset();
	});
	d3.select('#sltPredicate').on('change', function() {
		parcoords.brushPredicate(this.value);
	});
}

function refreshCords(tStart, tEnd) {
	var sl = sa_selected.length;
	if (sl > 0) {
		var query_str = 'action=get-daily-error&details=' + tStart + '|' + tEnd;
		for (var i = 0; i < sl; i++) {
			var c = sa_selected[i];
			if (c != 'clicks')
				query_str += '|' + c;
		}
		loadCords('./idt_files/php/get_data.php?' + query_str);
	}
}

$('#time_range').text('[' + formateDate('2014-01-01 00:00') + ' -- ' + formateDate('2014-01-02 00:00') + ']');
refreshCords('2014-01-01 00:00', '2014-01-02 00:00');
