/*
 *  Code here define variables that are shared between the knockout (main.js) script and
 *  Google Maps (gmaps.js) script. Since the loading of these scripts do not happen always
 *  in the same order and the same time I placed these shared variables here in the base.js
 *  This script is loaded first and it's synchronously loaded.
 */
let gMap;
let markers;
let infWin;
let greenMarker;
let orangeMarker;
let bounce;
let drop;

// Locations on the map - this functions here as a simple hard-coded DB
let sites = [
  {id: 1, name: 'Angkor Wat', loc: {lat: 13.412679, lng: 103.866967}},
  {id: 2, name: 'Angkor Wat Gateway', loc: {lat: 13.412679, lng: 103.861981}},
  {id: 3, name: 'Heaven and Hell Gallery', loc: {lat: 13.4117402, lng: 103.8674229}},
  {id: 4, name: 'North Angkor Pagoda', loc: {lat: 13.4138206, lng: 103.8643089}},
  {id: 5, name: 'Ta Loek Entrance', loc: {lat: 13.4162728, lng: 103.866967}},
  {id: 6, name: 'Ta Pech Entrance', loc: {lat: 13.4090000, lng: 103.867100}},
  {id: 7, name: 'Temple Ruins', loc: {lat: 13.412579, lng: 103.871387}},
  {id: 8, name: 'Terrace of Honor', loc: {lat: 13.4125898, lng: 103.8653972}}
];

// store the locations ('sites') in localStorage for permanent access
let stringSites = JSON.stringify(sites);
localStorage.setItem("sites", stringSites);
localStorage.setItem("sitesLen", sites.length);
