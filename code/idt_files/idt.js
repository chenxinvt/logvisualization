//var sa_all = ['clicks', 'E409', 'E405', 'E501', 'E503', 'E502', 'E401', 'E400', 'E500', 'E403', 'E416', 'E404'];
var sa_all = ['clicks', 'E400', 'E401', 'E403', 'E404', 'E405', 'E409', 'E416', 'E500', 'E501', 'E502', 'E503'];
//var sa_selected = ['clicks', 'E500'];
var sa_selected = sa_all;
var sa_brush_extent = ["2014-01-01 00:00", "2014-08-31 23:00"];
//var colors = d3.scale.ordinal().range(["#1F77B4", "#AEC7E8", "#FF7F0E", "#FFBB78", "#C49C94", "#98DF8A", "#8C564B", "#FF9896", "#9467BD", "#C5B0D5", "#D62728", "#2CA02C"]);
var colors = d3.scale.ordinal().range(["#1F77B4", "#AEC7E8", "#FF7F0E", "#FFBB78", "#2CA02C", "#98DF8A", "#D62728", "#FF9896", "#9467BD", "#C5B0D5", "#8C564B", "#C49C94"]);

var colorIndex = sa_all.indexOf('E500');
