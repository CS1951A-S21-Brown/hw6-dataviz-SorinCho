const pie_width = MAX_WIDTH / 3 - 10,
  pie_height = 275;
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
  .attr("width", pie_width)
  .attr("height", pie_height * 1.8)
  .append("g")
  .attr("transform", `translate(${pie_width / 2},${pie_height / 2 + 100})`);

const title_2 = svg
  .append("text")
  .attr("transform", `translate(${width / 2}, ${margin.top + 15})`)
  .style("text-anchor", "middle")
  .style("font-size", 15)
  .text("Top Genre by Region");

const title_2_pie = svg_pie
  .append("text")
  .attr("transform", `translate(${0}, ${-pie_height / 2 - 30})`)
  .style("text-anchor", "middle")
  .style("font-size", 15);

// Load external data and boot
d3.json("./data/world.geojson").then(function (data) {
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
    const name = this.classList[1];
    let region = "";
    let topGenre = "";
    if (name == "JP") {
      region = "Japan";
      topGenre = "Role-Playing";
    } else if (name == "NA") {
      region = "North America";
      topGenre = "Action";
    } else if (name == "EU") {
      region = "Europe";
      topGenre = "Action";
    } else {
      region = "Other";
      topGenre = "Action";
    }
    d3.selectAll(".region").style("opacity", 0.5).style("stroke-opacity", 0.1);
    d3.selectAll(`.${name}`).style("opacity", 1).style("stroke-opacity", 1);
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
    d3.selectAll(".region").style("opacity", 0.9).style("stroke-opacity", 0.3);
  };

  svg
    .append("g")
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("class", (d) => {
      const name = d.properties.name;
      if (name == "Japan") {
        return "region JP";
      } else if (NA.has(name)) {
        return "region NA";
      } else if (EU.has(name)) {
        return "region EU";
      }
      return "region Other";
    })
    .attr("d", d3.geoPath().projection(projection))

    .style("cursor", "pointer")
    .style("opacity", 0.9)
    .style("stroke-opacity", 0.3)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .on("click", (d) => setRegion(d.properties.name));

  d3.selectAll(".JP").attr("fill", "#D81E5B").style("stroke", "#D81E5B");
  d3.selectAll(".NA").attr("fill", "#73683B").style("stroke", "#73683B");
  d3.selectAll(".EU").attr("fill", "#006DAA").style("stroke", "#006DAA");
  d3.selectAll(".Other").attr("fill", "#B0C7BD").style("stroke", "#B0C7BD");
});

function setRegion(name) {
  let region = "Other";
  let label = "Other";
  if (name == "Japan") {
    region = "JP";
    label = "Japan";
  } else if (NA.has(name)) {
    region = "NA";
    label = "North America";
  } else if (EU.has(name)) {
    region = "EU";
    label = "Europe";
  }
  title_2_pie.text(`${label} Sales by Genre`);
  d3.csv("./data/video_games.csv").then(function (data) {
    data = data.reduce((acc, curr) => {
      if (curr["Genre"] in acc) {
        acc[curr["Genre"]] += parseFloat(curr[`${region}_Sales`]);
      } else {
        acc[curr["Genre"]] = parseFloat(curr[`${region}_Sales`]);
      }
      return acc;
    }, {});

    const radius = Math.min(pie_width, pie_height) / 2;

    for (let [genre, sales] of Object.entries(data)) {
      sales = parseFloat(sales.toFixed(2));
      data[genre] = sales;
    }

    const colors = [
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
    const color = d3.scaleOrdinal().domain(data).range(colors);

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
      this.style.opacity = 1;
      tooltip
        .html("Genre: " + d.data.key + "<br>" + "Global Sales: " + d.data.value)
        .style("opacity", 1);
    };
    const mousemove = function (d) {
      tooltip
        .style("top", d3.event.pageY + "px")
        .style("left", d3.event.pageX + 25 + "px");
    };
    const mouseleave = function (d) {
      d3.selectAll(".slice").style("opacity", 0.8);
      tooltip.style("opacity", 0);
    };

    const pie = d3.pie().value(function (d) {
      return d.value;
    });
    const data_ready = pie(d3.entries(data));

    let slice = svg_pie.selectAll("path").data(data_ready);
    slice = slice.enter().append("path").merge(slice);

    slice
      .transition()
      .duration(1000)
      .attr("class", "slice")
      .attr("d", arcGenerator)
      .attr("fill", function (d) {
        return color(d.data.key);
      })
      .attr("stroke", "white")
      .style("stroke-width", "3px")
      .style("cursor", "pointer")
      .style("opacity", 0.8);
    slice
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("click", (d) => {
        document.getElementById("select-genre").value = d.data.key;
        setGenre(d.data.key);
      });
    slice.exit().remove();
  });
}

setRegion("USA");
