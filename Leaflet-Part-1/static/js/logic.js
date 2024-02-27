// Store endpoint as URL
// let queryURL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-02-25 - 7 days"
let queryURL =
  " https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// Get request
d3.json(queryURL).then(function (data) {
  // Add features to "data" function
  createFeatures(data.features);

  console.log(data);
});

function createFeatures(quakeData) {
  // Create function and add features to display in markers
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      `<h3>${feature.properties.title}</h3><hr><p>${feature.geometry.coordinates[2]}</p>`
    );
  }

  function KDRcolor(y) {
    switch (true) {
      case y > 90:
        return "red";
      case y > 70:
        return "orangered";
      case y > 50:
        return "orange";
      case y > 30:
        return "yellow";
      case y > 10:
        return "yellowgreen";
      default:
        return "green";
    }
  }

  function KDRradius(x) {
    if (x == 0) {
      return 1;
    }
    return x * 5;
  }
  function KDRstyle(feature) {
    return {
      fillColor: KDRcolor(feature.geometry.coordinates[2]),
      color: "black",
      fillOpacity: .50,
      radius: KDRradius(feature.properties.mag),
    };
  }
  // Run function for all data
  let earthquakes = L.geoJSON(quakeData, {
    pointToLayer: function (feature, latlong) {
      return L.circleMarker(latlong);
    },
    style: KDRstyle,
    onEachFeature: onEachFeature,
  });

  // Add layer to function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Create the base layers.
  let street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  let sat = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  );

  // Create basemap
  let baseMaps = {
    "Street Map": street,
    "Satellite Map": sat,
  };

  // Create overlay
  let overlayMaps = {
    Earthquakes: earthquakes,
  };

  // Create map, add streetmap and satellite map layers
  let myMap = L.map("map", {
    center: [36.0609, -95.7975],
    zoom: 5,
    layers: [street, sat, earthquakes],
  });

  // Create a layer control and add it to the map
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);

    // Create legend
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let labels = {
        KDRcolor
      };

      let legendInfo = "<h1>Quake Data<br /></h1>" +
      "<div class=\"labels\">" +
      "</div>";

    div.innerHTML = legendInfo;

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };


    // Add legend to map
    legend.addTo(myMap);
  
}
