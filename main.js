const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = { top: 40, right: 110, bottom: 40, left: 200 };

let graph_1_width = MAX_WIDTH / 2 - 10,
  graph_1_height = 275;
let graph_2_width = MAX_WIDTH / 2 - 10,
  graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2 - 10,
  graph_3_height = 275;

function setSelect() {
  d3.csv("./data/video_games.csv").then((data) => {
    uniqueYears = [...new Set(data.map((d) => d.Year).sort())];

    const yearsSelect = document.getElementById("select-year");

    let year = document.createElement("option");
    year.value = "All Time";
    year.text = "All Time";
    yearsSelect.appendChild(year);

    uniqueYears.forEach((year) => {
      let option = document.createElement("option");
      option.value = year;
      option.text = year;
      yearsSelect.appendChild(option);
    });

    uniqueGenres = [...new Set(data.map((d) => d.Genre).sort())];

    const genresSelect = document.getElementById("select-genre");

    uniqueGenres.forEach((genre) => {
      let option = document.createElement("option");
      option.value = genre;
      option.text = genre;
      genresSelect.appendChild(option);
    });
  });
}

const NA = [
  "Antigua and Barbuda",
  "The Bahamas",
  "Barbados",
  "Belize",
  "Canada",
  "Costa Rica",
  "Cuba",
  "Dominica",
  "Dominican Republic",
  "El Salvador",
  "Grenada",
  "Guatemala",
  "Haiti",
  "Honduras",
  "Jamaica",
  "Mexico",
  "Nicaragua",
  "Panama",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Trinidad and Tobago",
  "USA",
];
const EU = [
  "Albania",
  "Andorra",
  "Armenia",
  "Austria",
  "Azerbaijan",
  "Belarus",
  "Belgium",
  "Bosnia and Herzegovina",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Kazakhstan",
  "Kosovo",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macedonia",
  "Malta",
  "Moldova",
  "Monaco",
  "Montenegro",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Russia",
  "San Marino",
  "Republic of Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Turkey",
  "Ukraine",
  "England",
  "Vatican City",
  "Greenland",
];

setSelect();
