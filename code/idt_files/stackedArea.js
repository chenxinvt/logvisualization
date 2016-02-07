var sw = 1104, sh = 160;
var brush;
d3.json('./idt_files/data/daily_error_by_type.json', function(data) {
	nv.addGraph(function() {
		var chart = nv.models.stackedAreaChart().margin({
			right : 100
		}).x(function(d) {
			return d[0];
		})//We can modify the data accessor functions...
		.y(function(d) {
			return d[1];
		})//...in case your data is formatted differently.
		.useInteractiveGuideline(true)//Tooltips which show all data points. Very nice!
		.transitionDuration(500).showControls(false)//Allow user to choose 'Stacked', 'Stream', 'Expanded' mode.
		.clipEdge(true);
		//Format x-axis labels with custom function.
		chart.xAxis.tickFormat(function(d) {
			//return d3.time.format('%x')(new Date(d));
			return d3.time.format('%b-%d')(calcDate(d));
		});
		chart.yAxis.tickFormat(d3.format(''));

		d3.select('#chart svg').datum(data).call(chart);
		x2 = d3.time.scale().range([0, sw]).domain(x_dom);
		brush = d3.svg.brush().x(x2).on("brushend", function(d) {

			var x_new_dom = brush.empty() ? x_dom : brush.extent();

			
			//if (!isEqualArrays(x_new_dom.map(format), brush.extent())) {
			//if ((x_new_dom[1] - x_new_dom[0] ) < 209880000) {
			if ((x_new_dom[1] - x_new_dom[0] ) < 2098800000) {
				refreshCords(x_new_dom.map(format)[0], x_new_dom.map(format)[1]);
				$('#time_range').text('[' + formateDate(x_new_dom[0]) + ' -- ' + formateDate(x_new_dom[1]) + ']');
			}
			x.domain(x_new_dom);
			var t = svg.transition().duration(750);
			t.select("g.x.grid").call(xAxis.tickSubdivide(1).tickSize(-sh));
			t.select("g.x.axis").call(xAxis.tickSubdivide(0).tickSize(6));

			t.select("g.y.grid").call(yAxis.tickSubdivide(1).tickSize(-sw));
			t.select("g.y.axis").call(yAxis.tickSubdivide(0).tickSize(6));

			t.selectAll("path.generator").attr("d", area);

		});
		d3.select('#chart svg .nv-stackedWrap').append("g").attr("class", "brush").call(brush).selectAll("rect").attr("height", sh);
		nv.utils.windowResize(chart.update);
		$('#chart g.nv-legend g.nv-series').on('click', function() {
			var i = $('#chart g.nv-legend g.nv-series').index($(this));
			$('#zoom_chart_legend li:eq(' + i + ')').trigger('click');
		});

		return chart;
	});
});

function formateDate(dd) {
	var d = new Date(dd);
	var mn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var wn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	var m = mn[d.getMonth()];
	var dt = d.getDate();
	var w = wn[d.getDay()];
	var h = d.getHours();
	var min = d.getMinutes();
	var s = d.getSeconds();

	if (dt < 10) {
		dt = '0' + dt;
	}
	if (h < 10) {
		h = '0' + h;
	}
	if (min < 10) {
		min = '0' + min;
	}
	if (s < 10) {
		s = '0' + s;
	}
	return w + ', ' + m + ' ' + dt + ' ' + h + ':' + min + ':' + s;
}

function calcDate(num) {
	var myDate = new Date('2014-01-01 00:00:00');
	myDate.setDate(myDate.getDate() + (num - 1));
	return myDate;
}
