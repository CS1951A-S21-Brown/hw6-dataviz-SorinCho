(graph_2_width = MAX_WIDTH / 3 - 10), (graph_2_height = 275);
const width = MAX_WIDTH * 0.4;
const height = 500;
const svg = d3
  .select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", `translate(${0}, ${20})`);

const projection = d3
  .geoNaturalEarth()
  .scale(width / 1.3 / Math.PI)
  .translate([width / 2, height / 2]);

const svg_pie = d3
  .select("#pie")
  .append("svg")
  .attr("width", graph_2_width)
  .attr("height", graph_2_height * 1.8)
  .append("g")
  .attr(
    "transform",
    `translate(${graph_2_width / 2},${graph_2_height / 2 + 100})`
  );

const title_2 = svg
  .append("text")
  .attr("transform", `translate(${width / 2}, ${margin.top + 15})`)
  .style("text-anchor", "middle")
  .style("font-size", 15)
  .text("Top Genre by Region");

const title_2_pie = svg_pie
  .append("text")
  .attr("transform", `translate(${0}, ${-graph_2_height / 2 - 30})`)
  .style("text-anchor", "middle")
  .style("font-size", 15);

// Load external data and boot
d3.json(
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
).then(function (data) {
  const tooltip = d3
    .select("#graph2")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  const mouseover = function (d) {
    const name = d.properties.name;
    let region = "";
    let topGenre = "";
    if (name == "Japan") {
      region = "Japan";
      topGenre = "Role-Playing";
    } else if (NA.includes(name)) {
      region = "NA";
      topGenre = "Action";
    } else if (EU.includes(name)) {
      region = "EU";
      topGenre = "Action";
    } else {
      region = "Other";
      topGenre = "Action";
    }
    tooltip
      .html("Region: " + region + "<br>" + "Top Genre: " + topGenre)
      .style("opacity", 1);
  };
  const mousemove = function (d) {
    tooltip
      .style("top", d3.event.pageY + "px")
      .style("left", d3.event.pageX + 10 + "px");
  };
  const mouseleave = function (d) {
    tooltip.style("opacity", 0);
  };

  svg
    .append("g")
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("fill", (d) => {
      const name = d.properties.name;
      if (name == "Japan") {
        return "#D81E5B";
      } else if (NA.includes(name)) {
        return "#73683B";
      } else if (EU.includes(name)) {
        return "#006DAA";
      }
      return "#B0C7BD";
    })
    .attr("d", d3.geoPath().projection(projection))
    .style("stroke", "#fff")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .on("click", (d) => setRegion(d.properties.name));
});

function setRegion(name) {
  let region = "Other";
  if (name == "Japan") {
    region = "JP";
  } else if (NA.includes(name)) {
    region = "NA";
  } else if (EU.includes(name)) {
    region = "EU";
  }
  title_2_pie.text(`${region} Sales by Genre`);
  d3.csv("./data/video_games.csv").then(function (data) {
    data = data.reduce((acc, curr) => {
      if (curr["Genre"] in acc) {
        acc[curr["Genre"]] += parseFloat(curr[`${region}_Sales`]);
      } else {
        acc[curr["Genre"]] = parseFloat(curr[`${region}_Sales`]);
      }
      return acc;
    }, {});

    const radius = Math.min(graph_2_width, graph_2_height) / 2;

    for (let [genre, sales] of Object.entries(data)) {
      sales = parseFloat(sales.toFixed(2));
      data[genre] = sales;
    }

    const colors = [
      "#C97064",
      "#BCA371",
      "#4B1D3F",
      "#7FEFBD",
      "#32965D",
      "#CA3CFF",
      "#1C3A13",
      "#C3BEF7",
      "#8A4FFF",
      "#4D5057",
      "#011936",
      "#0496FF",
    ];

    const colors2 = [
      "#984447",
      "#ADD9F4",
      "#476C9B",
      "#468C98",
      "#101419",
      "#678D58",
      "#A6C48A",
      "#FFBE0B",
      "#FFD9CE",
      "#8AEA92",
      "#FFF689",
      "#D6A184",
    ];
    const color = d3.scaleOrdinal().domain(data).range(colors2);
    // const color = d3
    //   .scaleOrdinal()
    //   .domain(Object.keys(data))
    //   .range(
    //     d3
    //       .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
    //       .reverse()
    //   );

    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    const tooltip = d3
      .select("#graph2")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    const mouseover = function (d) {
      tooltip
        .html("Genre: " + d.data.key + "<br>" + "Value: " + d.data.value)
        .style("opacity", 1);
    };
    const mousemove = function (d) {
      tooltip
        .style("top", d3.event.pageY + "px")
        .style("left", d3.event.pageX + 25 + "px");
    };
    const mouseleave = function (d) {
      tooltip.style("opacity", 0);
    };

    const pie = d3.pie().value(function (d) {
      return d.value;
    });
    const data_ready = pie(d3.entries(data));

    let u = svg_pie.selectAll("path").data(data_ready);
    u = u.enter().append("path").merge(u);

    u.transition()
      .duration(1000)
      .attr("d", arcGenerator)
      .attr("fill", function (d) {
        return color(d.data.key);
      })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1);
    u.on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
    u.exit().remove();
  });
}

setRegion("USA");
