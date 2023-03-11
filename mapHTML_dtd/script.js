var slider = document.getElementById("myRange");
var dateprint = document.getElementById("value_slider");
var select = document.getElementById("pm-select");
var playButton = document.getElementById("playButton");
var pm = select.value;

// === Slider ===

slider.min = (new Date("2021-10-01")).getTime();
slider.max = (new Date("2022-07-31")).getTime();
slider.value = ( parseInt(slider.max) + parseInt(slider.min)) / 2;

date = new Date( parseInt(slider.value) );
dateprint.innerHTML = String(date.getDate()) + "/" + String(date.getMonth() + 1) + "/" + String(date.getFullYear());

slider.oninput = function() {
  date = new Date( parseInt(this.value) );
  dateprint.innerHTML = String(date.getDate()) + "/" + String(date.getMonth() + 1) + "/" + String(date.getFullYear());
  setDayData(parseInt(this.value), pm);
}

// === Map ===

var mymap = L.map('map').setView([53.3501, -6.26], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  tileSize: 512,
  zoomOffset: -1
}).addTo(mymap);

// === Heatmap ===

var heat;

// Créer une liste de couleurs qui sera utilisée pour la Heatmap en fonction des valeurs
var colors = [
  "#00FFFF", // cyan
  "#00FF00", // vert
  "#FFFF00", // jaune
  "#FF0000", // rouge
  "#8B4513", // marron
  "#800080" // violet
];

// Créer une fonction pour mapper les valeurs aux couleurs
function getColor(value) {
  if (value <= 10) {
    return colors[0];;
  } else if (value <= 20) {
    return colors[1];
  } else if (value <= 25) {
    return colors[2];
  } else if (value <= 50) {
    return colors[3];
  } else if (value <= 75) {
    return colors[4];
  } else {
    return colors[5];
  }
}

function addHeatmap(data) {
  heat = L.heatLayer(data, {
    radius: 25,
    CanvasGradient: getColor,
    blur: 50,
   }).addTo(mymap);
}

function printNoData() {
  var popup = L.popup()
    .setLatLng([53.3501, -6.26])
    .setContent("No data for this day")
    .openOn(mymap);
}

function clearHeatmap() {
  if (heat) {
    mymap.removeLayer(heat);
    heat = null;
  }
}

// === Select ===

select.addEventListener("change", function() {
  console.log("Select changed:  " + this.value);
  pm = this.value;
  setDayData(parseInt(slider.value), pm);
});

// === Play button ===

playButton.addEventListener("click", function() {

  // Si la heatmap est déjà en train de jouer, on l'arrête
  if (playButton.classList.contains("playing")) {
    playButton.classList.remove("playing");
    playButton.innerHTML = "Play";
    return;
  }

  console.log("Start playing");
  playButton.classList.add("playing");
  
  // Récupérer la date de début et de fin

  var dateDebut = parseFloat(slider.value);
  var dateFin = parseFloat(slider.max);
  
  // Parcourir tous les timestamps de la date de début à la date de fin
  function refreshHeatmap(timestamp, dateFin, pm) {
    if ((timestamp <= dateFin) && playButton.classList.contains("playing")) {
      setDayData(slider.value, pm);
      slider.value = timestamp;
      date = new Date( parseInt(slider.value) );
      dateprint.innerHTML = String(date.getDate()) + "/" + String(date.getMonth() + 1) + "/" + String(date.getFullYear());

      setTimeout(function() {
        refreshHeatmap(timestamp + 86400000, dateFin, pm);
      }, 500);
    }
  }
  
  refreshHeatmap(dateDebut, dateFin, pm);
});