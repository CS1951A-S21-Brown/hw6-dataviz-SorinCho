"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var graph_3_width = MAX_WIDTH / 2 - 10,
    graph_3_height = 400;
var svg_3 = d3.select("#graph3").append("svg").attr("width", graph_3_width).attr("height", graph_3_height).append("g").attr("transform", "translate(".concat(margin["left"], ", ").concat(margin["top"], ")"));
var x_3 = d3.scaleLinear().range([0, graph_3_width - margin.left - margin.right]);
var y_3 = d3.scaleBand().range([0, graph_3_height - margin.top - margin.bottom]).padding(0.2);
var countRef_3 = svg_3.append("g");
var y_axis_label_3 = svg_3.append("g");
svg_3.append("text").attr("transform", "translate(".concat((graph_3_width - margin.left - margin.right) / 2, ", ").concat(graph_3_height - margin.bottom * 1.5, ")")).style("text-anchor", "middle").text("Global Sales (millions)").style("font-size", 12);
svg_3.append("text").attr("transform", "translate(".concat(-margin.left + 10, ", ").concat((graph_1_height - margin.top - margin.bottom) / 2, ")rotate(-90)")).style("text-anchor", "middle").text("Publishers").style("font-size", 12);
var title_3 = svg_3.append("text").attr("transform", "translate(".concat((graph_3_width - margin.left - margin.right) / 2, ", ").concat(-margin.top / 2, ")")).style("text-anchor", "middle").style("font-size", 15);

function setGenre(val) {
  d3.csv("./data/video_games.csv").then(function (data) {
    data = cleanDataGenre(data, val);
    var x_key = "sales";
    var y_key = "publisher";
    x_3.domain([0, d3.max(data, function (d) {
      return parseFloat(d[x_key]);
    })]);
    y_3.domain(data.map(function (d) {
      return d[y_key];
    }));
    y_axis_label_3.call(d3.axisLeft(y_3).tickSize(0).tickPadding(10));
    var color = d3.scaleOrdinal().domain(data.map(function (d) {
      return d[y_key];
    })).range(d3.quantize(d3.interpolateHcl("#D66853", "#364156"), 10));

    var mouseover = function mouseover(d) {
      this.style.opacity = 1;
    };

    var mouseleave = function mouseleave(d) {
      d3.selectAll(".game-bar").style("opacity", 0.8);
    };

    var bars = svg_3.selectAll("rect").data(data);
    bars = bars.enter().append("rect").merge(bars);
    bars.transition().duration(1000).attr("fill", function (d) {
      return color(d[y_key]);
    }).attr("class", "publisher-bar").style("cursor", "pointer").style("opacity", 0.8).attr("x", x_3(0)).attr("y", function (d) {
      return y_3(d[y_key]);
    }).attr("width", function (d) {
      return x_3(d[x_key]);
    }).attr("height", y_3.bandwidth());
    bars.on("mouseover", mouseover).on("mouseleave", mouseleave);
    var counts = countRef_3.selectAll("text").data(data);
    counts.enter().append("text").merge(counts).transition().duration(1000).attr("x", function (d) {
      return x_3(d[x_key]) + 5;
    }).attr("y", function (d) {
      return y_3(d[y_key]) + 12;
    }).style("text-anchor", "start").text(function (d) {
      return d[x_key];
    }).style("font-size", "10px");
    title_3.text("Top 10 Publishers for ".concat(val));
    d3.selectAll("text").style("font-weight", "normal");
    d3.select("#graph3 > svg > g > g:nth-child(2) > g:nth-child(2) > text").style("font-weight", "bold");
    d3.select("#graph3 > svg > g > g:nth-child(1) > text:nth-child(1)").style("font-weight", "bold");
    bars.exit().remove();
    counts.exit().remove();
  });
}

function cleanDataGenre(data, param) {
  var filtered = data.filter(function (d) {
    return d.Genre == param;
  });
  var reduced = filtered.reduce(function (acc, curr) {
    if (curr["Publisher"] in acc) {
      acc[curr["Publisher"]] += parseFloat(curr["Global_Sales"]);
    } else {
      acc[curr["Publisher"]] = parseFloat(curr["Global_Sales"]);
    }

    return acc;
  }, {});
  var clean = [];

  for (var _i = 0, _Object$entries = Object.entries(reduced); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        publisher = _Object$entries$_i[0],
        sales = _Object$entries$_i[1];

    sales = parseFloat(sales.toFixed(2));
    clean.push({
      publisher: publisher,
      sales: sales
    });
  }

  clean = clean.sort(function (a, b) {
    return b.sales - a.sales;
  });
  return clean.slice(0, 10);
}

setGenre("Action");