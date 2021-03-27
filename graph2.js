const pie_width = MAX_WIDTH / 3 - 10,
  pie_height = 275;
const map_width = MAX_WIDTH * 0.5;
const map_height = 500;
const svg_map = d3
  .select("#map")
  .append("svg")
  .attr("width", map_width)
  .attr("height", map_height)
  .attr("transform", `translate(${0}, ${20})`);

const map_proj = d3
  .geoNaturalEarth()
  .scale(map_width / 1.8 / Math.PI)
  .translate([map_width / 2, map_height / 2]);

const svg_pie = d3
  .select("#pie")
  .append("svg")
  .attr("width", pie_width)
  .attr("height", pie_height * 1.8)
  .append("g")
  .attr("transform", `translate(${pie_width / 2},${pie_height / 2 + 100})`);

const title_2 = svg_map
  .append("text")
  .attr("transform", `translate(${map_width / 2}, ${margin.top + 15})`)
  .style("text-anchor", "middle")
  .style("font-size", 15)
  .text("Top Genre by Region");

const title_2_pie = svg_pie
  .append("text")
  .attr("transform", `translate(${0}, ${-pie_height / 2 - 30})`)
  .style("text-anchor", "middle")
  .style("font-size", 15);

d3.json("./data/world.geojson").then(function (data) {
  const tooltip = d3
    .select("#graph2")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("box-shadow", "2px 2px 5px")
    .style("border-radius", "5px")
    .style("padding", "15px");

  const mouseover = function () {
    const name = this.classList[1];
    let region = "";
    let topGenre = "";
    if (name == "JP") {
      region = "Japan";
      topGenre = topGenres[name];
    } else if (name == "NA") {
      region = "North America";
      topGenre = topGenres[name];
    } else if (name == "EU") {
      region = "Europe";
      topGenre = topGenres[name];
    } else {
      region = "Other";
      topGenre = topGenres[name];
    }
    d3.selectAll(".region").style("opacity", 0.5).style("stroke-opacity", 0.1);
    d3.selectAll(`.${name}`).style("opacity", 1).style("stroke-opacity", 1);
    tooltip
      .html(`Region: ${region}<br>Top Genre: ${topGenre}`)
      .transition()
      .duration(200)
      .style("opacity", 0.9);
  };
  const mousemove = function () {
    tooltip
      .style("top", d3.event.pageY + "px")
      .style("left", d3.event.pageX + 20 + "px");
  };
  const mouseout = function () {
    tooltip.style("opacity", 0);
    d3.selectAll(".region").style("opacity", 0.9).style("stroke-opacity", 0.3);
  };

  svg_map
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
    .attr("d", d3.geoPath().projection(map_proj))
    .style("cursor", "pointer")
    .style("stroke-opacity", 0.3)
    .style("opacity", 0.9)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseout", mouseout)
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
  d3.csv("./data/video_games.csv").then((data) => {
    data = aggGenres(data, region);

    const pie_radius = Math.min(pie_width, pie_height) / 2;

    let total = 0;
    for (let [genre, sales] of Object.entries(data)) {
      sales = parseFloat(sales.toFixed(2));
      total += sales;
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

    const tooltip = d3
      .select("#graph2")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("box-shadow", "2px 2px 5px")
      .style("border-radius", "5px")
      .style("padding", "15px");

    const mouseover = function (d) {
      this.style.opacity = 1;
      tooltip
        .html(
          `Genre: ${d.data.key} <br> Global Sales: ${
            d.data.value
          }M <br> Sales Share: ${((d.data.value / total) * 100).toFixed(2)}%`
        )
        .transition()
        .duration(200)
        .style("opacity", 0.9);
    };
    const mousemove = function () {
      tooltip
        .style("top", d3.event.pageY + "px")
        .style("left", d3.event.pageX + 25 + "px");
    };
    const mouseout = function () {
      d3.selectAll(".slice").style("opacity", 0.8);
      tooltip.style("opacity", 0);
    };

    const pie = d3.pie().value((d) => d.value);
    const pie_data = pie(d3.entries(data));
    const color = d3.scaleOrdinal().domain(data).range(colors);
    const arcs = d3.arc().innerRadius(0).outerRadius(pie_radius);

    let pie_section = svg_pie.selectAll("path").data(pie_data);
    pie_section = pie_section.enter().append("path").merge(pie_section);

    pie_section
      .transition()
      .duration(1000)
      .attr("class", "slice")
      .attr("d", arcs)
      .attr("fill", (d) => color(d.data.key))
      .style("cursor", "pointer")
      .style("opacity", 0.8)
      .attr("stroke", "white")
      .style("stroke-width", "3px");

    pie_section
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseout", mouseout)
      .on("click", (d) => {
        document.getElementById("select-genre").value = d.data.key;
        setGenre(d.data.key);
      });
    pie_section.exit().remove();
  });
}

setRegion("USA");
