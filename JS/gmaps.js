
// The Google Maps object
var gMap;

// Creating the locations object
var locations = JSON.parse(localStorage.getItem("sights"));


/*
 *  'gMapsURI()' will set the 'src' and 'onerror' attributes of the gMapsScript <script> tag
 *  which is a deferred tag in the <head> of the main.html and it establishes the connection
 *  the Google Maps API
 */
function gMapsURI()
{
  // Displaying an error message on encountering errors (eg. network and firewall problems)
  document.getElementById('gMapsScript').setAttribute('onerror',
           "document.getElementById('mainFrame').innerHTML =" +
           "'<br>' + '&nbsp; Unfortunately, we could no load Google Maps. ' + '<br>' +" +
           "'<br>' + '&nbsp; Check your network connections and firewall settings, please!';");
  // Setting the GMaps API URI for the 'gMapsScript' <script> tag
  let gMapsURL = ("https://maps.googleapis.com/maps/api/js?" +
                  "key=AIzaSyC8GtH7D9GZ9wxLQgQ4b3UendpuOUOsqYQ" +
                  "&v=3&callback=gMapsInit&language=en")
  document.getElementById('gMapsScript').setAttribute('src', gMapsURL);
};
// Setting the attributes of the deferred 'gMapsScript' tag by calling 'gMapsURI()'
gMapsURI();

// 'gMapsinit()' is the callback function called by the 'gMapsScript' <script>
function gMapsInit()
{
  // Creating a new gMap object
  gMap = new google.maps.Map(document.getElementById('gMap'),
         {
           center: {lat: 13.412515, lng: 103.867103},
           zoom: 16,
           mapTypeId: google.maps.MapTypeId.SATELLITE
         });

  // Ensuring that on resizing the browser window the center of the map remains in the
  // center of the viewport
  google.maps.event.addDomListener(window, "resize", function()
  {
	  var center = gMap.getCenter();
	  google.maps.event.trigger(gMap, "resize");
		gMap.setCenter(center);
	});

  // The infWin and bounds variables for the markers (Google Maps pins)
  var infWin = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  
  // This function creates new marker icons (to change colors on click or on hover)
  function makeMarkerIcon(markerColor)
  {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.6|0|' + markerColor + '|30|_|%E2%80%A2',
      null, null, null, null)
    return markerImage;
  }

  // This function populates the infowindow when a marker is clicked
  function infoWindow(marker, infWin)
  {
    infWin.marker = marker;
    infWin.setContent("Loading...");
    // putting the marker.id to the value of the hidden <input id="dataTransfer"> element
    let infWinHighlight = {id: marker.id, open: true};
    document.getElementById("dataTransfer").value = JSON.stringify(infWinHighlight);
    document.getElementById("dataTransfer").focus();
    
    // This function creates the infowindow content (error message or pic)
    async function infWinContent()
    {
      let lat = marker.getPosition().lat();
      let lng = marker.getPosition().lng();
      // waiting for the 'getPhoto()' defined in flickr.js
      let imgURI = await getPhoto(lat, lng);
      // if there was an error connecting to the Flickr API:
      if (imgURI['error'] == true)
      {
        let errMsg = ["Unfortunately, the photo from", "Flickr could not be reached.",
                      "Please, consult the consol for", "further information!"];
        infWin.setContent(`<h2 id="infWinCaption">` + marker.title + `</h2>` +
                          `<p id="errMsg">` +
                           errMsg[0] + `<br>` + errMsg[1] + `<br>` + `<br>` +
                           errMsg[2] + `<br>`+ errMsg[3] + `<br>` +
                          `</p>`);
      // if there was no problem with the Flickr API:
      }
      else
      {
        let staticURI = imgURI['staticURI'];
        let galleryURI = imgURI['galleryURI'];
        infWin.setContent(`<h2 id="infWinCaption">` + marker.title + `</h2>` +
                          `<a href="${galleryURI}" target="_blank">` +
                          `<img src="${staticURI}">` + `</a>`);
      }
    }
    infWinContent();
    
    infWin.open(gMap, marker);
    // Make sure the marker property is cleared if the infWin is closed
    infWin.addListener('closeclick', function()
    {
      marker.setAnimation(null);
      marker.setIcon(makeMarkerIcon('8ACD32'))
      infWin.setMarker = null;
      // putting the marker.id to the value of the hidden <input id="dataTransfer"> element
      infWinHighlight = {id: marker.id, open: false};
      document.getElementById("dataTransfer").value = JSON.stringify(infWinHighlight);
      document.getElementById("dataTransfer").focus();
    });
  }
  
  // Iterating the locations list from above to create an array of markers
  for (let i = 0; i < localStorage.getItem("sightsLen");  i++)
  {
    // Get the position from the locations list.
    // Create a marker per location, and put into markers array
    let marker = new google.maps.Marker(
    {
      map: gMap,
      id: locations[i].id,
      title: locations[i].name,
      position: locations[i].loc,
      animation: google.maps.Animation.DROP,
      icon: 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.6|0|8ACD32|30|_|%E2%80%A2'
    });
    // Push the marker to our array of markers
    markers.push(marker);

    marker.addListener('mouseover', function()
    {
      this.setIcon(makeMarkerIcon('FF4500'));
    });

    marker.addListener('mouseout', function()
    {
      if (this.getAnimation() == null)
      {
        this.setIcon(makeMarkerIcon('8ACD32'));
      }

    });

    // Create an onclick event to open an infowindow at each marker
    marker.addListener('click', function()
    {
      mLen = markers.length;
      // This is to ensure that only one marker is selected at a time
      for (let a = 0; a < mLen; a++)
      {
        markers[a].setAnimation(null);
        markers[a].setIcon(makeMarkerIcon('8ACD32'));
      }
      this.setAnimation(google.maps.Animation.BOUNCE);
      this.setIcon(makeMarkerIcon('FF4500'));
      infoWindow(this, infWin);
      // Moving the center of the screen so that the full infoWindow can be seen
      let infWinPos = this.getPosition().toJSON();
      let newPosition =
      {
        'lat': (infWinPos['lat'] + 0.003),
        'lng': (infWinPos['lng'])
      }
      let newMapCenter = new google.maps.LatLng(newPosition)
      gMap.setCenter(newMapCenter);
    });
    bounds.extend(markers[i].position);
  }
  // Extend the boundaries of the map for each marker
  gMap.fitBounds(bounds);
}
