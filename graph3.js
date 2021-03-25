let svg_3 = d3
  .select("#graph3")
  .append("svg")
  .attr("width", graph_3_width)
  .attr("height", graph_3_height)
  .append("g")
  .attr("transform", `translate(${margin["left"]}, ${margin["top"]})`);

let x_3 = d3
  .scaleLinear()
  .range([0, graph_3_width - margin.left - margin.right]);

let y_3 = d3
  .scaleBand()
  .range([0, graph_3_height - margin.top - margin.bottom])
  .padding(0.1);

let countRef_3 = svg_3.append("g");

let y_axis_label_3 = svg_3.append("g");

svg_3
  .append("text")
  .attr(
    "transform",
    `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${
      graph_3_height - margin.bottom * 1.5
    })`
  )
  .style("text-anchor", "middle")
  .text("Global Sales (millions)")
  .style("font-size", 12);

svg_3
  .append("text")
  .attr(
    "transform",
    `translate(${-margin.left + 10}, ${
      (graph_1_height - margin.top - margin.bottom) / 2
    })rotate(-90)`
  )
  .style("text-anchor", "middle")
  .text("Publishers")
  .style("font-size", 12);

let title_3 = svg_3
  .append("text")
  .attr(
    "transform",
    `translate(${(graph_3_width - margin.left - margin.right) / 2}, ${
      -margin.top / 2
    })`
  )
  .style("text-anchor", "middle")
  .style("font-size", 15);

function setGenre(val) {
  d3.csv("./data/video_games.csv").then(function (data) {
    data = cleanDataGenre(data, val);
    const x_key = "sales";
    const y_key = "publisher";

    x_3.domain([0, d3.max(data, (d) => parseFloat(d[x_key]))]);

    y_3.domain(data.map((d) => d[y_key]));

    y_axis_label_3.call(d3.axisLeft(y_3).tickSize(0).tickPadding(10));

    let bars = svg_3.selectAll("rect").data(data);

    let color = d3
      .scaleOrdinal()
      .domain(
        data.map(function (d) {
          return d[y_key];
        })
      )
      .range(d3.quantize(d3.interpolateHcl("#D66853", "#364156"), 10));

    bars
      .enter()
      .append("rect")
      .merge(bars)
      .transition()
      .duration(1000)
      .attr("fill", function (d) {
        return color(d[y_key]);
      })
      .attr("x", x_3(0))
      .attr("y", (d) => y_3(d[y_key]))
      .attr("width", (d) => x_3(d[x_key]))
      .attr("height", y_3.bandwidth());

    let counts = countRef_3.selectAll("text").data(data);

    counts
      .enter()
      .append("text")
      .merge(counts)
      .transition()
      .duration(1000)
      .attr("x", (d) => x_3(d[x_key]) + 5)
      .attr("y", (d) => y_3(d[y_key]) + 12)
      .style("text-anchor", "start")
      .text((d) => d[x_key])
      .style("font-size", "10px");

    title_text = `Top 10 Publishers for ${val}`;

    title_3.text(title_text);

    bars.exit().remove();
    counts.exit().remove();
  });
}

function cleanDataGenre(data, param) {
  let filtered = data.filter((d) => d.Genre == param);
  let reduced = filtered.reduce((acc, curr) => {
    if (curr["Publisher"] in acc) {
      acc[curr["Publisher"]] += parseFloat(curr["Global_Sales"]);
    } else {
      acc[curr["Publisher"]] = parseFloat(curr["Global_Sales"]);
    }
    return acc;
  }, {});

  clean = [];

  for (let [publisher, sales] of Object.entries(reduced)) {
    sales = parseFloat(sales.toFixed(2));
    clean.push({ publisher, sales });
  }

  clean = clean.sort((a, b) => b.sales - a.sales);

  return clean.slice(0, 10);
}

setGenre("Sports");
