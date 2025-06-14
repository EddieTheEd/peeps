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

function main() {
  console.log(date)
  console.log(data.find(p => p.date === date)["locations"]);
}

// Get today's date (start of day, to avoid timezone issues)
const today = new Date(Date.now() + 86400000);
today.setHours(0, 0, 0, 0);

// Use this as the minimum date
const minDate = new Date(today);

// Start at today's date
let date = today.toISOString().split("T")[0];

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

console.log(base);
