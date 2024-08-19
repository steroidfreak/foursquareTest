const BASE_API_URL = "https://api.foursquare.com/v3";
const API_KEY = "fsq30S6asd5gUSZuzHHx1O58Fd3yB1nnODQSxSHrPKBdj5I="

async function search(lat, lng, searchTerms) {
    const response = await axios.get(`${BASE_API_URL}/places/search`, {
        params: {
            query: encodeURI(searchTerms), //encodeURI is used to convert special characters to their encoded eqv so that query will be wellformed
            ll: lat + "," + lng,
            sort: "DISTANCE",
            // radius: 1000,
            limit: 50,
            // postcode: searchTerms,

        },
        headers: {
            Accept: "application/json",
            // Provide the API key here
            Authorization: API_KEY
        }
    })
    return response.data;
}

async function searchPostalCode(postalCode) {

    const response = await axios.get(`https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`)

    // console.log(response.data);
    return response.data;
}

// async function drawMarkerOnMap(lat,long){
//     console.log(lat);
//     console.log(long);


//     let smarker = await L.marker(`[${lat}, ${long}]`);
//     smarker.addTo(map);



// }

document.addEventListener("DOMContentLoaded", async function(){

    // set map to centre of singapore
    let map = L.map("map");
    map.setView([1.3521,103.82],13);

    // setup the tile layers
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

    document.querySelector("#submitBtn").addEventListener("click",async function(){

        let input = document.querySelector("#input").value;
        // console.log(input);
        let output = await search(1.29,103.85,input);
        // console.log(output.results);


        // API Endpoint: https://data.gov.sg/api/action/datastore_search?resource_id=139a3035-e624-4f56-b63f-89ae28d4ae4c&q={postal_code}

        let postalCodeResult = await searchPostalCode(input);
        
        let lat = postalCodeResult.results[0].LATITUDE;
        let long = postalCodeResult.results[0].LONGITUDE;

        console.log(lat);
        console.log(long);
        // drawMarkerOnMap(lat,long);
        let s_marker = L.marker([lat, long]);
         s_marker.addTo(map);








    })

    






})