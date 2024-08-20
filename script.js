const BASE_API_URL = "https://api.foursquare.com/v3";
const API_KEY = "fsq30S6asd5gUSZuzHHx1O58Fd3yB1nnODQSxSHrPKBdj5I=";

const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
  
let schoolLayerGroup = L.layerGroup();
let foodLayerGroup = L.layerGroup();
let s_marker = L.marker([1,3521,103.82]);

// set map to centre of singapore
let map = L.map("map");
map.setView([1.3521,103.82],13);

// setup the tile layers
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

async function search(lat, lng, searchTerms) {
    const response = await axios.get(`${BASE_API_URL}/places/search`, {
        params: {
            query: encodeURI(searchTerms), //encodeURI is used to convert special characters to their encoded eqv so that query will be wellformed
            ll: lat + "," + lng,
            sort: "DISTANCE",
            radius: 1000,
            limit: 50,
            // postcode: searchTerms,

        },
        headers: {
            Accept: "application/json",
            // Provide the API key here
            Authorization: API_KEY
        }
    })
    console.log(response.data);
    return response.data;
}

async function searchPostalCode(postalCode) {

    const response = await axios.get(`https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`)

    // console.log(response.data);
    return response.data;
}

document.addEventListener("DOMContentLoaded", async function(){

    document.querySelector("#submitBtn").addEventListener("click",async function(){
        let input = document.querySelector("#input").value;
        schoolLayerGroup.clearLayers();
        s_marker.remove();


        // API Endpoint: https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&q={postal_code}

        let postalCodeResult = await searchPostalCode(input);
        
        let lat = postalCodeResult.results[0].LATITUDE;
        let long = postalCodeResult.results[0].LONGITUDE;

        console.log(lat);
        console.log(long);
        // drawMarkerOnMap(lat,long);
        s_marker = L.marker([lat, long], {icon: redIcon});
        map.setView([lat, long], 16)
        // s_marker = L.marker([lat, long]);
        s_marker.addTo(map);
        s_marker.bindPopup(`<p>${postalCodeResult.results[0].ADDRESS}</p>`)

        let schoolResult = await search(lat,long,"school");
        let foodResult = await search(lat,long,"hawker");

        console.log(foodResult);
        

        // let schoolLayer = drawMarkerOnLayer(schoolResult);

        schoolLayerGroup = drawMarkerOnLayer(schoolResult).addTo(map);

        // schoolLayerGroup.addTo(map);

         







    })

})

function drawMarkerOnLayer(data){

    let length = data.results.length;
    console.log(data.results.length)
    let nearbyLocationMarkerLayer = L.markerClusterGroup();
    for(let i=0; i<length; i++){
        // console.log(data.results[i].geocodes.main.latitude,data.results[i].geocodes.main.longitude);
        // console.log(data.results[i].name);
        let name = data.results[i].name;
        if (name.includes("Primary")||name.includes("primary")) {
            console.log(name);
            let schoolMarker=L.marker([data.results[i].geocodes.main.latitude,data.results[i].geocodes.main.longitude]).addTo(nearbyLocationMarkerLayer);
            schoolMarker.bindPopup(`<p>${data.results[i].name}, ${data.results[i].distance}m away from location.</p>`)
            name = "";
        }
        // L.marker([data.results[i].geocodes.main.latitude,data.results[i].geocodes.main.longitude]).addTo(nearbyLocationMarkerLayer);
    }

        return nearbyLocationMarkerLayer;
       
}

function drawMarkerOnLayerGroup(data){

    let length = data.results.length;
    console.log(data.results.length)
    
    let nearbyLocationMarkerLayerGroup = L.layerGroup();
    for(let i=0; i<length; i++){
        console.log(data.results[i].geocodes.main.latitude,data.results[i].geocodes.main.longitude);
        L.marker([data.results[i].geocodes.main.latitude,data.results[i].geocodes.main.longitude]).addTo(nearbyLocationMarkerLayerGroup);
    }

        return nearbyLocationMarkerLayerGroup;
       
}
