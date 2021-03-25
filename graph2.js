// d3.csv("./data/video_games.csv").then(function (data) {
//   big = data.reduce(
//     (acc, curr) => {
//       if (curr["Genre"] in acc["NA"]) {
//         acc["NA"][curr["Genre"]] += parseFloat(curr["NA_Sales"]);
//       } else {
//         acc["NA"][curr["Genre"]] = parseFloat(curr["NA_Sales"]);
//       }

//       if (curr["Genre"] in acc["EU"]) {
//         acc["EU"][curr["Genre"]] += parseFloat(curr["EU_Sales"]);
//       } else {
//         acc["EU"][curr["Genre"]] = parseFloat(curr["EU_Sales"]);
//       }

//       if (curr["Genre"] in acc["JP"]) {
//         acc["JP"][curr["Genre"]] += parseFloat(curr["JP_Sales"]);
//       } else {
//         acc["JP"][curr["Genre"]] = parseFloat(curr["JP_Sales"]);
//       }

//       if (curr["Genre"] in acc["Other"]) {
//         acc["Other"][curr["Genre"]] += parseFloat(curr["Other_Sales"]);
//       } else {
//         acc["Other"][curr["Genre"]] = parseFloat(curr["Other_Sales"]);
//       }
//       return acc;
//     },
//     { NA: {}, EU: {}, JP: {}, Other: {} }
//   );

//   const radius = Math.min(graph_2_width, graph_2_height) / 2;

//   // const NA_data = big["NA"];
//   // const EU_data = big["EU"];
//   // const JP_data = big["JP"];
//   // const Other_data = big["Other"];
//   const regions = ["NA", "EU", "JP", "Other"];

//   regions.forEach((region) => {
//     let data = big[region];
//     for (let [genre, sales] of Object.entries(data)) {
//       sales = parseFloat(sales.toFixed(2));
//       data[genre] = sales;
//     }
//     const id = `#${region}`;
//     var svg = d3
//       .select(id)
//       .append("svg")
//       .attr("width", graph_2_width)
//       .attr("height", graph_2_height)
//       .append("g")
//       .attr(
//         "transform",
//         "translate(" + graph_2_width / 2 + "," + graph_2_height / 2 + ")"
//       );

//     var color = d3.scaleOrdinal().domain(data).range(d3.schemeSet3);
//     // var color = d3
//     //   .scaleOrdinal()
//     //   .domain(Object.keys(data))
//     //   .range(
//     //     d3
//     //       .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
//     //       .reverse()
//     //   );

//     var pie = d3.pie().value(function (d) {
//       return d.value;
//     });
//     var data_ready = pie(d3.entries(data));

//     var arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

//     var tooltip = d3
//       .select(id)
//       .append("div")
//       .style("opacity", 0)
//       .attr("class", "tooltip")
//       .style("background-color", "white")
//       .style("border", "solid")
//       .style("border-width", "1px")
//       .style("border-radius", "5px")
//       .style("padding", "10px");

//     var mouseover = function (d) {
//       tooltip
//         .html("Genre: " + d.data.key + "<br>" + "Value: " + d.data.value)
//         .style("opacity", 1);
//     };
//     var mousemove = function (d) {
//       // tooltip
//       //   .style("left", d3.mouse(this)[0] + 300 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
//       //   .style("top", d3.mouse(this)[1] + 100 + "px");

//       tooltip
//         .style("top", d3.event.layerY + "px")
//         .style("left", d3.event.layerX + 25 + "px");
//     };
//     var mouseleave = function (d) {
//       tooltip.style("opacity", 0);
//     };

//     svg
//       .selectAll("mySlices")
//       .data(data_ready)
//       .enter()
//       .append("path")
//       .attr("d", arcGenerator)
//       .attr("fill", function (d) {
//         return color(d.data.key);
//       })
//       .attr("stroke", "white")
//       .style("stroke-width", "1px")
//       .style("opacity", 0.7)
//       .on("mouseover", mouseover)
//       .on("mousemove", mousemove)
//       .on("mouseleave", mouseleave);

//     // svg
//     //   .selectAll("mySlices")
//     //   .data(data_ready)
//     //   .enter()
//     //   .append("text")
//     //   .text(function (d) {
//     //     return d.data.key;
//     //   })
//     //   .attr("transform", function (d) {
//     //     return "translate(" + arcGenerator.centroid(d) + ")";
//     //   })
//     //   .style("text-anchor", "middle")
//     //   .style("font-size", 12);
//   });
// });
