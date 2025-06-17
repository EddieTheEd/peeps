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

// line offsets for the start of the balls
lt1offset = [-2.5, 4.5]
lt2offset = [-0.5, 4.5] 
planeoffset = [-5.5,0]

function main() {

  const temps = document.querySelectorAll('.temp');
  temps.forEach(el => el.remove());

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
  
  for (const [city, people] of Object.entries(real)) {
    counter = 0

    let linetype = locations.find(l => l.city === city)["linetype"]
    let coords = locations.find(l => l.city === city)["coordinates"]

    if (linetype == 1) {
      start = coords.map((val, idx) => val + lt1offset[idx])
    } else {
      start = coords.map((val, idx) => val + lt2offset[idx])
    }

    for (const person of people) {
      // get person's image url 
      let imagesrc = base.find(p => p.individual === person)["imageurl"];
      
      profile = document.createElement('img');
      profile.src = imagesrc;
      profile.style.position = 'absolute';
      profile.style.top = `${start[0]}%`;
      profile.style.left = `${start[1]+counter}%`;
      profile.style.width = '2.5%';
      profile.classList.add("temp")
      profile.style.aspectRatio = "1 / 1";
      profile.style.borderRadius = "50%";
      profile.style.border = "0.22vw solid red";
      profile.style.objectFit = "cover";
      map.appendChild(profile);

      counter = counter + 3.5 // incremental distance between balls on the same city 
    }
  }

  // Now we will add the people on planes
  for (const [city, people] of Object.entries(plane)) {
    let cities = city.split(",")
    
    // Coordinates of each city
    location1 = locations.find(l => l.city === cities[0])["coordinates"]
    location2 = locations.find(l => l.city === cities[1])["coordinates"]

    // Plane coordinates at midpoint
    planecoords = [(location1[0]+location2[0])/2, (location1[1]+location2[1])/2]

    // Get angle pointing from first city to second city
    planeangle = Math.atan2(location2[0]-location1[0], location2[1]-location1[1]) * (-180 / Math.PI)

    // Generate plane, rotate it to point to destination
    planeimage = document.createElement("img")
    planeimage.src = 'images/airplane.png';
    planeimage.style.position = 'absolute';
    planeimage.style.top = `${planecoords[0]}%`;
    planeimage.style.left = `${planecoords[1]}%`;
    planeimage.style.width = '2.5%';
    planeimage.classList.add("temp")
    planeimage.style.objectFit = "cover";
    planeimage.style.transform = `rotate(-${planeangle}deg)`
    map.appendChild(planeimage);

    // Adding people
    counter = 0
    start = planecoords.map((val, idx) => val + planeoffset[idx])

  for (const person of people) {
      // get person's image url 
      let imagesrc = base.find(p => p.individual === person)["imageurl"];

      profile = document.createElement('img');
      profile.src = imagesrc;
      profile.style.position = 'absolute';
      profile.style.top = `${start[0]+counter}%`;
      profile.style.left = `${start[1]}%`;
      profile.style.width = '2.5%';
      profile.classList.add("temp")
      profile.style.aspectRatio = "1 / 1";
      profile.style.borderRadius = "50%";
      profile.style.border = "0.22vw solid red";
      profile.style.objectFit = "cover";
      map.appendChild(profile);

      counter = counter + 3.5 // incremental distance between balls on the same city 
    }
  
  }

}




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
