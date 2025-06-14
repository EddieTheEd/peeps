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

console.log(base);
