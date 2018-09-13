/*
 *  Code here define variables that are shared between the knockout (main.js) script and
 *  Google Maps (gmaps.js) script. Since the loading of these scripts do not happen always
 *  in the same order and the same time I placed these shared variables here in the base.js
 *  This script is loaded first and it's synchronously loaded.
 */
var gMap;
var markers;
var infWin;
var greenMarker;
var orangeMarker;
var bounce;
var drop;

// Locations on the map - this functions here as a simple hard-coded DB
var sights = [
  {id: 1, name: 'Angkor Wat', loc: {lat: 13.412679, lng: 103.866967}},
  {id: 2, name: 'Angkor Wat Gateway', loc: {lat: 13.412679, lng: 103.861981}},
  {id: 3, name: 'Heaven and Hell Gallery', loc: {lat: 13.4117402, lng: 103.8674229}},
  {id: 4, name: 'North Angkor Pagoda', loc: {lat: 13.4138206, lng: 103.8643089}},
  {id: 5, name: 'Ta Loek Entrance', loc: {lat: 13.4162728, lng: 103.866967}},
  {id: 6, name: 'Ta Pech Entrance', loc: {lat: 13.4090000, lng: 103.867100}},
  {id: 7, name: 'Temple Ruins', loc: {lat: 13.412579, lng: 103.871387}},
  {id: 8, name: 'Terrace of Honor', loc: {lat: 13.4125898, lng: 103.8653972}}
];

// store the locations ('sights') in localStorage for permanent access
let stringSights = JSON.stringify(sights);
localStorage.setItem("sights", stringSights);
localStorage.setItem("sightsLen", sights.length);
