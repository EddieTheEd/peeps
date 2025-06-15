function loadData(path) {
  var request = new XMLHttpRequest();
  request.open("GET", path, false);  
  request.send(null);

  if (request.status === 200) {
    var graphdata = request.responseText;
    } else {
    console.error("Error fetching JSON:", request.statusText);
  }

  return JSON.parse(graphdata);
}

data = loadData("data.json")
base = loadData("base.json")
locations = loadData("locationdata.json")

function main() {
  console.log(date)
  
  people = data.find(p => p.date === date)["locations"];

  const cities = [];
  const flights = [];

  people.forEach(([name, loc]) => {
    const locations = Array.isArray(loc) ? loc : [loc];
    if (locations.length === 1) {
      cities.push([name, locations[0]]);
    } else {
      flights.push([name, locations]);
    }
  });

  // Cities just need to have their line generated first
  
  // Cleanup the cities list to actually only include cities
  
  trueCities = []

  for (let i = 0; i < cities.length; i++) {
      trueCities.push(cities[i][1])
  }

  reallyTrueCities = [...new Set(trueCities)]
  
  
  let map = document.getElementById("map-container");

  for (let i = 0; i < reallyTrueCities.length; i++) {
    let linetype = locations.find(l => l.city === reallyTrueCities[i])["linetype"]
    let coords = locations.find(l => l.city === reallyTrueCities[i])["coordinates"]

    const line = document.createElement('img');
    if (linetype == 1) {
      line.src = 'images/line1.png';
    } else {
      line.src = 'images/line2.png';
    }

    line.style.position = 'absolute';
    line.style.top = `${coords[0]}%`;
    line.style.left = `${coords[1]}%`;
    line.style.width = '4%';
    line.classList.add("temp")
    map.appendChild(line);

  }
  
  // TODO: destroy lines after new!
  
  // Adding people to each city.
  // We start by determining how many people need to be added to each city.
  // Using this we iterate with increment on the value of the width.
  
  const peoplePerCity = {};

  people.forEach(([person, city]) => {
    if (!peoplePerCity[city]) {
      peoplePerCity[city] = [];
    }
    peoplePerCity[city].push(person);
  });

  // We now need to filter out people who are on a plane! This means they will be the ones who are not on the list of cities.
  
  const real = {};
  const plane = {};


  for (const [city, people] of Object.entries(peoplePerCity)) {
    if (reallyTrueCities.includes(city)) {
      real[city] = people;
    } else {
      plane[city] = people;
    }
  }

  // Here, the 'real' object contains each city that is generated, and each person present in that city.
  // The 'plane' object contains each city-city pair with each person on it.
  // We can now start adding people!
}

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Australia/Melbourne",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const parts = formatter.format(new Date()).split("-");
let [year, month, day] = parts.map(Number);
const todayMelbourne = new Date(Date.UTC(year, month - 1, day));
const minDate = todayMelbourne;
let date = minDate.toISOString().split("T")[0];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("datetext").textContent = date;
  main();
});


function incrementDate(rate) {
  const current = new Date(date);
  const max = new Date("2025-12-31");

  current.setDate(current.getDate() + rate);

  if (current <= max) {
    date = current.toISOString().split("T")[0];
    document.getElementById("datetext").textContent = date;
  }
}

function decrementDate(rate) {
  const current = new Date(date);

  current.setDate(current.getDate() - rate);

  if (current >= minDate) {
    date = current.toISOString().split("T")[0];
    document.getElementById("datetext").textContent = date;
  }
}

document.getElementById("left").onclick = function() {
  decrementDate(1);
  main();
};
document.getElementById("right").onclick = function() {
  incrementDate(1);
  main();
};

document.getElementById("doubleleft").onclick = function() {
  decrementDate(7);
  main();
};
document.getElementById("doubleright").onclick = function() {
  incrementDate(7);
  main();
};

