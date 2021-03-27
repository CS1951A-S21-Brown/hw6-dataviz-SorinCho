const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = { top: 40, right: 110, bottom: 40, left: 200 };

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

function aggGenres(data, region) {
  data = data.reduce((acc, curr) => {
    if (curr["Genre"] in acc) {
      acc[curr["Genre"]] += parseFloat(curr[`${region}_Sales`]);
    } else {
      acc[curr["Genre"]] = parseFloat(curr[`${region}_Sales`]);
    }
    return acc;
  }, {});

  return data;
}

function topGenre(data, region) {
  data = aggGenres(data, region);
  return Object.keys(data).reduce((a, b) => (data[a] > data[b] ? a : b));
}

const topGenres = {};

function setTopGenres() {
  const regions = ["NA", "EU", "JP", "Other"];
  regions.forEach((region) => {
    d3.csv("./data/video_games.csv").then((data) => {
      topGenres[region] = topGenre(data, region);
    });
  });
}

const NA = new Set([
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
]);
const EU = new Set([
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
]);

setSelect();
setTopGenres();
