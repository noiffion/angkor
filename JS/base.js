// Locations on the map - this functions here as a simple hard-coded DB 
var sights = [ 
  {id: 1, name: 'Angkor Wat', loc: {lat: 13.412679, lng: 103.866967}},
  {id: 2, name: 'Temple Ruins', loc: {lat: 13.412579, lng: 103.871387}},
  {id: 3, name: 'Ta Loek Entrance', loc: {lat: 13.4162728, lng: 103.866967}},
  {id: 4, name: 'Angkor Wat Gateway', loc: {lat: 13.412679, lng: 103.861981}},
  {id: 5, name: 'North Angkor Pagoda', loc: {lat: 13.4138206, lng: 103.8643089}},
  {id: 6, name: 'Terrace of Honor', loc: {lat: 13.4125898, lng: 103.8653972}},
  {id: 7, name: 'Heaven and Hell Gallery', loc: {lat: 13.4117402, lng: 103.8674229}},
  {id: 8, name: 'Ta Pech Entrance', loc: {lat: 13.4090000, lng: 103.867100}}
];

// store the locations in localStorage
let stringSights = JSON.stringify(sights);
localStorage.setItem("sights", stringSights);
localStorage.setItem("sightsLen", sights.length);

/*
 *  The following lines define variables that are shared between the knockout (main.js) and 
 *  Google Maps (gmaps.js) script. Since the loading of these scripts are not always in the
 *  same order I placed these shared variables here in the base.js 
 */

// Creating the markers (Google Maps pins) array
var markers = [];

async function returnMarkers()
{
  return await markers;
}
