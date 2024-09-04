// map object
let quakeMap = L.map("map", {
    center: [27.96044, -82.30695],
    zoom: 7
  });
  
  // tile layer
  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.opentopomap.org/about">OpenTopoMap</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 17
}).addTo(quakeMap);;
  
  // Load GeoJSON data
  let quakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  
  // Get the data with d3
  d3.json(quakeData).then(function(data) {
    
    // depth marker color
    function getColor(depth) {
        return depth > 90 ? '#660000' :
               depth > 70 ? '#990000' :
               depth > 50 ? '#cc0000' :
               depth > 30 ? '#e57373' :
               depth > 10 ? '#f44336' :
                            '#ffebee';
    }

    // magnitude marker size 
    function getSize(magnitude) {
        return magnitude * 4;  // Scale size for better visibility
    }

    // Add markers
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            const depth = feature.geometry.coordinates[2];
            const magnitude = feature.properties.mag;

            return L.circleMarker(latlng, {
                radius: getSize(magnitude),
                fillColor: getColor(depth),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(`<h3>${feature.properties.title}</h3>
                          <p>Magnitude: ${magnitude}</p>
                          <p>Depth: ${depth} km</p>`);
        }
    }).addTo(quakeMap);

    // legend
    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'legend');
        const grades = [0, 10, 30, 50, 70, 90];
        const colors = ['#ffebee', '#f44336', '#e57373', '#cc0000', '#990000', '#660000'];

        div.innerHTML += '<strong>Depth (km)</strong><br>';
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(quakeMap);
});

