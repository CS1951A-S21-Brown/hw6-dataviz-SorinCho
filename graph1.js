const graph_1_width = MAX_WIDTH / 2 - 10,
  graph_1_height = 400;

const svg_1 = d3
  .select("#graph1")
  .append("svg")
  .attr("width", graph_1_width)
  .attr("height", graph_1_height)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const x_1 = d3
  .scaleLinear()
  .range([0, graph_1_width - margin.left - margin.right]);

const y_1 = d3
  .scaleBand()
  .range([0, graph_1_height - margin.top - margin.bottom])
  .padding(0.2);

const countRef_1 = svg_1.append("g");

const y_axis_label_1 = svg_1.append("g");

svg_1
  .append("text")
  .attr(
    "transform",
    `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${
      graph_1_height - margin.bottom * 1.5
    })`
  )
  .style("text-anchor", "middle")
  .text("Global Sales (millions)")
  .style("font-size", 12);

svg_1
  .append("text")
  .attr(
    "transform",
    `translate(${-margin.left + 10}, ${
      (graph_1_height - margin.top - margin.bottom) / 2
    })rotate(-90)`
  )
  .style("text-anchor", "middle")
  .text("Game Titles")
  .style("font-size", 12);

const title_1 = svg_1
  .append("text")
  .attr(
    "transform",
    `translate(${(graph_1_width - margin.left - margin.right) / 2}, ${
      -margin.top / 2
    })`
  )
  .style("text-anchor", "middle")
  .style("font-size", 15);

function setYear(val) {
  d3.csv("./data/video_games.csv").then(function (data) {
    data = cleanDataYear(data, val);
    const x_key = "Global_Sales";
    const y_key = "Name";

    x_1.domain([0, d3.max(data, (d) => parseFloat(d[x_key]))]);

    y_1.domain(data.map((d) => d[y_key]));

    y_axis_label_1.call(d3.axisLeft(y_1).tickSize(0).tickPadding(10));

    const color = d3
      .scaleOrdinal()
      .domain(
        data.map(function (d) {
          return d[y_key];
        })
      )
      .range(d3.quantize(d3.interpolateHcl("#8DB580", "#C2CFB2"), 10));

    const mouseover = function (d) {
      this.style.opacity = 1;
    };

    const mouseout = function (d) {
      d3.selectAll(".game-bar").style("opacity", 0.8);
    };

    let bars = svg_1.selectAll("rect").data(data);
    bars = bars.enter().append("rect").merge(bars);

    bars
      .transition()
      .duration(1000)
      .attr("fill", function (d) {
        return color(d[y_key]);
      })
      .attr("class", "game-bar")
      .style("cursor", "pointer")
      .style("opacity", 0.8)
      .attr("x", x_1(0))
      .attr("y", (d) => y_1(d[y_key]))
      .attr("width", (d) => x_1(d[x_key]))
      .attr("height", y_1.bandwidth());

    bars
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", (d) => {
        document.getElementById("select-genre").value = d.Genre;
        setGenre(d.Genre);
      });

    bars = svg_1.selectAll("rect").data(data);

    const counts = countRef_1.selectAll("text").data(data);

    counts
      .enter()
      .append("text")
      .merge(counts)
      .transition()
      .duration(1000)
      .attr("x", (d) => x_1(d[x_key]) + 5)
      .attr("y", (d) => y_1(d[y_key]) + 15)
      .style("text-anchor", "start")
      .text((d) => d[x_key])
      .style("font-size", "10px");

    title_1.text(`Top 10 Games from ${val}`);

    bars.exit().remove();
    counts.exit().remove();
  });
}

function cleanDataYear(data, param) {
  let clean = data;
  if (param != "All Time") {
    clean = data.filter((d) => d.Year == param);
  }

  const genres = {};
  const flatten = clean.reduce((acc, curr) => {
    if (curr["Name"] in acc) {
      acc[curr["Name"]] += parseFloat(curr["Global_Sales"]);
    } else {
      acc[curr["Name"]] = parseFloat(curr["Global_Sales"]);
      genres[curr["Name"]] = curr["Genre"];
    }
    return acc;
  }, {});

  const final = Object.keys(flatten).map((key) => {
    return {
      Name: key,
      Global_Sales: parseFloat(flatten[key].toFixed(2)),
      Genre: genres[key],
    };
  });

  const sorted = final.sort((a, b) => b.Global_Sales - a.Global_Sales);
  return sorted.slice(0, 10);
}

setYear("All Time");
