// Store endpoint as URL
// let queryURL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-02-25 - 7 days"
let queryURL = " https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Get request
d3.json(queryURL).then(function (data) {
    // Add features to "data" function
    createFeatures(data.features);

    console.log(data)
  });
  
  
  function createFeatures(quakeData) {

  
  // Create function and add features to display in markers
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.type}</h3><hr><p>${(feature.properties.title)}</p>`);
  }

  // Run function for all data
  let earthquakes = L.geoJSON(quakeData, {
    onEachFeature: onEachFeature
  });

  // Add layer to function
  createMap(earthquakes);
}


function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let sat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
})

  // Create basemap
  let baseMaps = {
    "Street Map": street,
    "Satellite Map": sat
  };

  // Create overlay
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map, add streetmap and satellite map layers
  let myMap = L.map("map", {
    center: [
      36.0609, -95.7975
    ],
    zoom: 5,
    layers: [street, sat, earthquakes]
  });

  // Create a layer control and add it to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}
