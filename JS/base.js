// Locations on the map - this functions as a hard-coded DB 
var sights = [ 
  {name: 'Angkor Wat', loc: {lat: 13.412679, lng: 103.866967}},
  {name: 'Temple Ruins', loc: {lat: 13.412579, lng: 103.871387}},
  {name: 'Ta Loek Entrance', loc: {lat: 13.4162728, lng: 103.866967}},
  {name: 'Angkor Wat Gateway', loc: {lat: 13.412679, lng: 103.861981}},
  {name: 'North Angkor Pagoda', loc: {lat: 13.4138206, lng: 103.8643089}},
  {name: 'Terrace of Honor', loc: {lat: 13.4125898, lng: 103.8653972}},
  {name: 'Heaven and Hell Gallery', loc: {lat: 13.4117402, lng: 103.8674229}},
  {name: 'Ta Pech Entrance', loc: {lat: 13.4090000, lng: 103.867100}}
];

// store the locations in localStorage
let stringSights = JSON.stringify(sights);
localStorage.setItem("sights", stringSights);
