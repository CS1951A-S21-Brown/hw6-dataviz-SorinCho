// var width = 500;
// var height = 400;
// var svg = d3.select("#continents").attr("width", width).attr("height", height);
// var projection = d3
//   .geoNaturalEarth()
//   .scale(width / 1.3 / Math.PI)
//   .translate([width / 2, height / 2]);

// // Load external data and boot
// d3.json("https://piwodlaiwo.github.io/topojson//world-continents.json").then(
//   function (data) {
//     // Draw the map
//     console.log(data);
//     svg
//       .append("g")
//       .selectAll("path")
//       .data(data.features)
//       .enter()
//       .append("path")
//       .attr("fill", (d) => {
//         console.log(d.properties.name);
//         const name = d.properties.name;
//         if (name == "Japan") {
//           return "#A30B37";
//         } else if (name == "USA") {
//           return "BD6B73";
//         }
//         return "#69b3a2";
//       })
//       .attr("d", d3.geoPath().projection(projection))
//       .style("stroke", "#fff");
//   }
// );
