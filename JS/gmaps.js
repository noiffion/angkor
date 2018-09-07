
// The Google Maps object
var gMap;

// Creating the locations object
var locations = JSON.parse(localStorage.getItem("sights"));

// Creating the markers (Google Maps pins) array
var markers = [];


// initMap is the callback function called by the googleapi script
function initMap() {
  // Creating a new gMap object
  gMap = new google.maps.Map(document.getElementById('gMap'), {
    center: {lat: 13.412515, lng: 103.867103},
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.SATELLITE
  });

  // On resizing the browser window the center of the map remains in the center of the viewport
  google.maps.event.addDomListener(window, "resize", function() {
	  var center = gMap.getCenter();
	  google.maps.event.trigger(gMap, "resize");
		gMap.setCenter(center);
	});

  // the infWin and bounds variable for the markers
  var infWin = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  
  // This function creates new marker icons (to change colors on click or on hover)
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.6|0|' + markerColor + '|30|_|%E2%80%A2',
      null, null, null, null)
    return markerImage;
  }

  // This function populates the infowindow when a marker is clicked
  function infoWindow(marker, infWin) {
    // Check to make sure the infowindow is not already opened on this marker
    infWin.marker = marker;
    infWin.setContent("Loading...");
    
    async function infWinContent() {
      let lat = marker.getPosition().lat();
      let lng = marker.getPosition().lng();
      // waiting for the 'createImageURL()' defined in flickr.js
      let imgURI = await createImageURL(lat, lng) 
      console.log(imgURI);
      infWin.setContent(`<h2 id="infWinCaption">` + marker.title + `</h2>` +
                        `<div>` + `<img src="${imgURI}">` + `<div>`);
    }
    infWinContent();
    
    infWin.open(gMap, marker);
    // Make sure the marker property is cleared if the infWin is closed
    infWin.addListener('closeclick', function(){
      marker.setAnimation(null);
      marker.setIcon(makeMarkerIcon('8ACD32'))
      infWin.setMarker = null; 
    });
  }
  
  // Iterating the locations list from above to create an array of markers
  let locLen = locations.length
  for (let i = 0; i < locLen; i++) {
    // Get the position from the locations list.
    // Create a marker per location, and put into markers array
    let marker = new google.maps.Marker({
      id: i,
      map: gMap,
      position: locations[i].loc,
      title: locations[i].name,
      animation: google.maps.Animation.DROP,
      icon: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.6|0|8ACD32|30|_|%E2%80%A2'
    });
    // Push the marker to our array of markers
    markers.push(marker);
    marker.addListener('mouseover', function() {
      this.setIcon(makeMarkerIcon('FF4500'));
    });
    marker.addListener('mouseout', function() {
      if (this.getAnimation() == null) {
        this.setIcon(makeMarkerIcon('8ACD32')); 
      }
    });

    // Create an onclick event to open an infowindow at each marker
    marker.addListener('click', function() {
      mLen = markers.length
      for (let a = 0; a < mLen; a++) {
        if (this.id != markers[a].id) {
          markers[a].setAnimation(null);
          markers[a].setIcon(makeMarkerIcon('8ACD32'));
        }
      }
      this.setAnimation(google.maps.Animation.BOUNCE);
      this.setIcon(makeMarkerIcon('FF4500'));
      infoWindow(this, infWin);
      gMap.setCenter(this.getPosition());
    });
    bounds.extend(markers[i].position);
  }
  // Extend the boundaries of the map for each marker
  gMap.fitBounds(bounds);
}
