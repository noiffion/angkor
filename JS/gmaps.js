
// Creating the locations object
let locations = JSON.parse(localStorage.getItem("sites"));


//--------------------------------------------------------------------------------------------------


/*
 *  'gMapsURI()' sets the 'src' and 'onerror' attributes of the gMapsScript <script> tag
 *  which is a deferred tag in the <head> of the main.html and it establishes the connection
 *  to the Google Maps API
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
                  "&v=3&callback=gMapsInit&language=en");
  document.getElementById('gMapsScript').setAttribute('defer', 'defer');
  document.getElementById('gMapsScript').setAttribute('src', gMapsURL);
};
// Setting the attributes of the deferred 'gMapsScript' tag by calling 'gMapsURI()'
gMapsURI();


//--------------------------------------------------------------------------------------------------


// This function creates new marker icons (to change colors on click or on hover)
function makeMarkerIcon(markerColor)
{
  if (markerColor === "green") {return greenMarker}
  else if (markerColor === "orange") {return orangeMarker}
  else {console.log("42")}
};


//--------------------------------------------------------------------------------------------------


/*
 *  This function asynchronously creates the infoWindow content (error message or pic from Flickr)
 */ 
async function infWinContent(marker)
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
  }
  // if there was no problem with the Flickr API:
  else
  {
    let staticURI = imgURI['staticURI'];
    let galleryURI = imgURI['galleryURI'];
    infWin.setContent(`<h2 id="infWinCaption">` + marker.title + `</h2>` +
                      `<a href="${galleryURI}" target="_blank">` +
                      `<img src="${staticURI}">` + `</a>`);
  }
};


//--------------------------------------------------------------------------------------------------


/*
 *  This function closes the infoWindow
 */
function infWinClose(marker, infWin)
{
  marker.setAnimation(null);
  marker.setIcon(makeMarkerIcon('green'))
  infWin.close();
  // putting the marker.id to the value of the hidden <input id="dataTransfer"> element
  document.getElementById("dataTransfer").value = JSON.stringify({id: marker.id, open: false});
  document.getElementById("dataTransfer").focus();
  document.getElementById("dataTransfer").blur();

};


//--------------------------------------------------------------------------------------------------


/*
 *  This function populates the pop-up infoWindow when a marker (or list item) is clicked on
 */
function infoWindow(marker, infWin, bounce)
{
  infWin.marker = marker;
  // Moving the center of the screen so that the full infoWindow can be seen
  let infWinPos = marker.getPosition().toJSON();
  let newMapCenter = {'lat': (infWinPos['lat'] + 0.003),
                     'lng': (infWinPos['lng'])};
  gMap.setCenter(newMapCenter);
  infWin.setContent("Loading...");
  infWin.open(gMap, marker);

  // This is to ensure that only one marker is selected at a time
  mLen = markers.length;
  for (let i = 0; i < mLen; i++)
  {
    markers[i].setAnimation(null);
    markers[i].setIcon(makeMarkerIcon('green'));
  }
  marker.setAnimation(bounce);
  marker.setIcon(makeMarkerIcon('orange'));
  infWinContent(marker);
  document.getElementById("dataTransfer").blur();

   // Make sure the marker property is cleared if the infWin is closed
  infWin.addListener('closeclick', function() 
  {
    infWinClose(marker, infWin);
  });
};


//--------------------------------------------------------------------------------------------------


/*
 *  Creating the markers of the map and attaching three event listeners to them
 */
function makeMarkers(markers, drop, bounce, bounds)
{ 
  // Create a marker per location, and put into markers array
  const icon = 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.6|0|8ACD32|30|_|%E2%80%A2'
  for (let i = 0; i < localStorage.getItem("sitesLen");  i++)
    {
      markers[i].id = locations[i].id;
      markers[i].setMap(gMap);
      markers[i].setPosition(locations[i].loc);
      markers[i].setTitle(locations[i].name);
      markers[i].setIcon(icon);
      markers[i].setAnimation(drop);

      // mouseover event
      markers[i].addListener('mouseover', function()
      {
        this.setIcon(makeMarkerIcon('orange'));
      });
 
      // mouseout event
      markers[i].addListener('mouseout', function()
      {
        if (this.getAnimation() == null) {this.setIcon(makeMarkerIcon('green'));}
      });
  
      // Create an onclick event to open an infoWindow at each marker if it's already opened
      markers[i].addListener('click', function()
      { 
        // putting the marker.id to the value of the hidden <input id="dataTransfer"> element
        document.getElementById("dataTransfer").value = JSON.stringify({id: this.id, open: true});
        // this will trigger the 
        document.getElementById("dataTransfer").focus();
      });
      // Extend the boundaries of the map for each marker
      bounds.extend(markers[i].position);
    }
};


//--------------------------------------------------------------------------------------------------


/*
 *  'gMapsinit()' is the callback function called by the 'gMapsScript' <script>.
 *  It initializes the map content by accessing the Google Maps API
 *  
 */
function gMapsInit()
{
  // Creating a new gMap object
  gMap = new google.maps.Map(document.getElementById('gMap'),
         { center: {lat: 13.412515, lng: 103.867103},
           zoom: 16,
           mapTypeId: google.maps.MapTypeId.SATELLITE });

  // Ensuring that on resizing the browser window the center of the map remains in the
  // center of the viewport
  google.maps.event.addDomListener(window, "resize", function()
  {
	  let center = gMap.getCenter();
	  google.maps.event.trigger(gMap, "resize");
		gMap.setCenter(center);
	});

  // The necessary google.maps objects for the functions above
  infWin = new google.maps.InfoWindow();
  let bounds = new google.maps.LatLngBounds();

  // creating the structure for the array of markers
  markers = [];
  for (let i = 0; i < localStorage.getItem("sitesLen");  i++)
  {
    markers.push((new google.maps.Marker()));
  }

  orangeMarker = new google.maps.MarkerImage(
                     'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.6|0|' +
                     'FF4500' + '|30|_|%E2%80%A2', null, null, null, null)
  greenMarker = new google.maps.MarkerImage(
                    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=0.6|0|' + 
                    '8ACD32' + '|30|_|%E2%80%A2', null, null, null, null)

  drop = google.maps.Animation.DROP;
  bounce = google.maps.Animation.BOUNCE;

  // Creating the markers list
  makeMarkers(markers, drop, bounce, bounds);
  
  // Extending the map with the array of bound extensions 
  gMap.fitBounds(bounds);
};
