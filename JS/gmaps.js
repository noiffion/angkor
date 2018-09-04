
let gMap;
// initMap is the callback function called by the googleapi script
function initMap() {
  // Creating a new gMap object
  gMap = new google.maps.Map(document.getElementById('gMap'), {
    center: {lat: 13.444527, lng: 103.829549},
    zoom: 12 
  });
} 

