// Create the map object with specified center and zoom level. [Refs: Mod-15/Day1/Act-2]
let myMap = L.map("map", {
    center: [44.967243, -103.771556],
    zoom: 4,
});

// Create the base title layers from Openstreetmap. [Refs: Mod-15/Day1/Act-2]
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

function getStyle(earthquakeInfo) {
    return {
        fillColor: getDepthColor(earthquakeInfo.geometry.coordinates[2]),
        opacity: 1,
        fillOpacity: 1,
        color: "black",
        weight: 0.5,
        radius: calculateRadius(earthquakeInfo.properties.mag)
    };
}

function getDepthColor(depth) {
    if (depth > 90) return "#e05f5a"
    else if (depth > 70) return "#e4a057"
    else if (depth > 50) return "#e9b733"
    else if (depth > 30) return "#e8db2d"
    else if (depth > 10) return "#d8f72c"
    else return "#abf52a";
}

function calculateRadius(magnitude) {
    if (magnitude === 0) return 1;
    return magnitude * 3;
}

function createPopup(feature) {
    return `Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}<br>Location: ${feature.properties.place}`
}

function createLegend() {

}

// Establish geoJSON URL [Refs: Mod-15/Day2/Act-04]
geoJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Getting GeoJSON data with d3 for the USGS Earthquakes
d3.json(geoJSON).then(function (data) {  // [Refs: Mod-15/Day2/Act-01]
    // console.log(data);
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        //Call pointToLayer function
        // L.getJSON creates several internal variables we can use, including: feature,
        //      layer, latlng
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: getStyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup(createPopup(feature))
        }
    }).addTo(myMap);

    let legend = L.control({ position: "bottomright" });
    // let legend = L.control();

    legend.onAdd = function () {
        let depths = ["90+", "70-90", "50-70", "30-50", "10-30", "-10-10"];
        let colors = ["#e05f5a", "#e4a057", "#e9b733", "#e8db2d", "#d8f72c", "#abf52a"];
        let div = L.DomUtil.create("div", "legend");

        for (let i = 0; i < depths.length; i++) {
            div.innerHTML += `<i style="background: ${colors[i]}"></i>${depths[i]}<br>`;
        }

        return div;
    }

    legend.addTo(map);
});