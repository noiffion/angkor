// Two API methods are used to retrieve a photo from Flickr:
// 1. search the flickr database looking for a list of photos
// at the specified location (@ 'lat', 'lon' coordinates)
// 2. to get the URL of the pic after the id of the first picture has been obtained  
// This is accomplished by using nested async-await-fetch() functions

// Creating the locations object 
var locs = JSON.parse(localStorage.getItem("sights"));

// Getting the id of one pic which is in the vicinity (100m) 
// of the marker (at 'lat, lon' coordinates) 
async function getPhoto(lat, lon) {
  try {
    const API_KEY = "&api_key=295c598483795b60225b6813082cc15e";
    const BASE_URL = "https://api.flickr.com/services/rest/?method=flickr.photos";
    // URI for the first ('search') API method --> returns 10 pictures
    let searchURL = BASE_URL + ".search" + API_KEY + `&lat=${lat}&lon=${lon}`;
    searchURL += "&radius=0.1&radius_units=km&per_page=10&format=json&nojsoncallback=1";
    // console.log(searchURL);

    let response = await fetch(searchURL);
    // console.log('The first response (picture id):'); 
    // console.log(response);
    if (response.ok) {
      let jsonResponse = await response.json();
      // picking one from the ten returned pics
      let rnd = Math.floor(Math.random()*10);
      let photoId = jsonResponse['photos']['photo'][rnd]['id'];
      // console.log(`The photo id is: ${photoId}`);

      // URI for the second ('getInfo') API method
      let getInfURL = BASE_URL + ".getInfo" + API_KEY + "&photo_id=" + photoId +
                         "&format=json&nojsoncallback=1"
      // getting the URL for the pic with Flickr getInf API method
      response = await fetch(getInfURL);
      // console.log('The second response (image URL):');
      // console.log(response);
      if (response.ok) {
        jsonResponse = await response.json();
        let photoData = {};
        photoData['id'] = jsonResponse['photo']['id'];
        photoData['farm'] = jsonResponse['photo']['farm'];
        photoData['server'] = jsonResponse['photo']['server'];
        photoData['secret'] = jsonResponse['photo']['secret']; 
        photoData['flickrURL'] = jsonResponse['photo']['urls']['url'][0]['_content'];
        return photoData;
      }
    }
    // if the response object was not ok throw an error
    throw new Error('Request failed: the Flickr API is not responding!'); 

    // if any other thing went wrong in the 'try' -> print an error message
  } catch (error) {
    console.log(error.message);
  } 
}

async function createImageURL(lat, lon) {
  // waiting for the photoData object from getPhoto
  let pD = await getPhoto(lat, lon);
  // console.log('The photo object:');
  // console.log(pD);
  // constructing the URL ('src') of the picture
  let src = "https://farm" + pD['farm']; 
  src += ".staticflickr.com/" + pD['server'];
  src += "/" + pD['id'];
  src += "_" + pD['secret'] + "_m.jpg";
  return src;
}

