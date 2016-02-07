var svg;
//var m = [79, 80, 160, 79];
var m = [19, 80, 30, 79];
var w = 1280 - m[1] - m[3];
var h = 240 - m[0] - m[2];
var parse = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
var format = d3.time.format("%Y-%m-%d %H:%M");
var x, x2, y;
var x_dom = [];
// Axes.
var xAxis, yAxis;
var area;
function drawStackedArea(cols) {
	d3.select("#zoom_chart svg").remove();
	x = d3.time.scale().range([0, w]);
	y = d3.scale.linear().range([h, 0]);
	x_dom = [];
	// Axes.
	xAxis = d3.svg.axis().scale(x).orient("bottom");
	yAxis = d3.svg.axis().scale(y).orient("left");
	area = d3.svg.area().x(function(d) {
		return x(d.x);
	}).y0(function(d) {
		return y(d.y0);
	}).y1(function(d) {
		return y(d.y0 + d.y);
	});
	svg = d3.select("#zoom_chart").append("svg:svg").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");

	svg.append("svg:rect").attr("width", w).attr("height", h);

	svg.append("svg:clipPath").attr("id", "clip").append("svg:rect").attr("x", x(0)).attr("y", y(1)).attr("width", x(1) - x(0)).attr("height", y(0) - y(1));

	d3.csv("./idt_files/data/count_error_all.csv", function(data) {
		// get header names
		var header_row = d3.keys(data[0]);
		var gen_names = header_row.filter(function(s) {
			return cols.indexOf(s) != -1;
		}).map(function(s) {
			return s;
		});
		// Parse times and power for generators.
		var stack_gens = d3.layout.stack()(gen_names.map(function(gen_kind) {
			return data.map(function(d) {
				return {
					x : parse(d.hour),
					y : +d[gen_kind]
				};
			});
		}));
		index_last_gen = stack_gens.length - 1;
		index_last_time = stack_gens[0].length - 1;
		// Compute the minimum and maximum date, and the maximum price.
		// d0 = stack_gens[0].map(function(d){return d.x});
		//the whole domain
		x_dom = [stack_gens[0][0].x, stack_gens[0][index_last_time].x];
		//d3.select("#current_window").text(x_dom.map(format).join(" to "));
		//just a small part of domain
		y_dom = [0, d3.max(stack_gens[index_last_gen], function(d) {
			return d.y0 + d.y;
		})];

		x.domain(x_dom);
		y.domain(y_dom);

		//svg.append("svg:g").attr("class", "x grid").attr("transform", "translate(0," + h + ")").call(xAxis.tickSubdivide(0).tickSize(-h));
		svg.append("svg:g").attr("class", "y grid").attr("transform", "translate(0,0)").call(yAxis.tickSubdivide(1).tickSize(-w));
		svg.append("svg:g").attr("class", "x axis").attr("transform", "translate(0," + h + ")").call(xAxis.tickSubdivide(0).tickSize(6));
		svg.append("svg:g").attr("class", "y axis").call(yAxis.tickSubdivide(0).tickSize(6));
		svg.selectAll("g.generator").data(stack_gens).enter().append("svg:path").attr("class", "generator").style("fill", function(d, i) {
			var ct = sa_selected[i];
			return colors(sa_all.indexOf(ct));
		}).style("stroke", function(d, i) {
			var ct = sa_selected[i];
			return colors(sa_all.indexOf(ct));
		}).style("stroke-opacity", function() {
			return 1 / sa_selected.length;
		}).attr("clip-path", "url(#clip)").attr("d", area);
	});
}

function initializeErrorCat() {
	var l = sa_all.length;
	var $li = $('<li title="clicks">Total Clicks</li>').css({
		'color' : '#FFF',
		'background' : colors(0)
	}).on('click', function() {
		$(this).toggleClass('error_excluded');
		updateErrorCat();
	});
	$('#zoom_chart_legend').append($li);
	for (var i = 1; i < l; i++) {
		var $li = $('<li title="' + sa_all[i] + '">' + sa_all[i] + '</li>').css({
			'color' : '#FFF',
			'background' : colors(i)
		}).on('click', function() {
			$(this).toggleClass('error_excluded');
			updateErrorCat();
		});
		$('#zoom_chart_legend').append($li);
	}

	$('#zoom_chart_legend li').each(function(i) {
		if (sa_selected.indexOf($(this).attr('title')) == -1) {
			$(this).addClass('error_excluded');
		}
	});
}

function updateErrorCat() {
	sa_selected = [];
	var x = -1;
	$('#zoom_chart_legend li').each(function(i) {
		if (!$(this).hasClass('error_excluded')) {
			x++;
			sa_selected.push($(this).attr('title'));
		}
	});
	if (x > -1)
		colorIndex = sa_all.indexOf(sa_selected[x]);
	drawStackedArea(sa_selected);
	//refreshCords('2014-01-06 00:00:00', '2014-01-07 00:00:00');
}

function isEqualArrays(arr1, arr2) {
	if (arr1.length != arr2.length) {
		return false;
	}
	var l = arr1.length;
	for (var i = 0; i < l; i++) {
		if (arr1.indexOf(arr2[i]) == -1) {
			return false;
		}
	}
	return true;
}

initializeErrorCat();
drawStackedArea(sa_selected);
