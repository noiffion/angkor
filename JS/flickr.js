/*
 *  Two API methods are used to retrieve a photo from Flickr:
 *  1. search the flickr database looking for a list of photos
 *  at the specified location (@ 'lat', 'lon' coordinates)
 *  2. to get the URL of the pic after the id of the first picture has been obtained  
 */

const BASE_URL = "https://api.flickr.com/services/rest/?method=flickr.photos";
const API_KEY = "&api_key=295c598483795b60225b6813082cc15e";


/* 
 *  'searchLink()' is called in 'getPhoto()' to connect to the Flickr API's search method 
 *  which returns a response object containing the info of 10 photos taken 
 *  within 100m radius of the 'lat' 'lon' coordinates
 */
async function searchLink(lat, lon) {
  // URI for the first ('search') API method --> returns 10 pictures
  let searchURL = BASE_URL + ".search" + API_KEY + `&lat=${lat}&lon=${lon}`;
  searchURL += "&radius=0.1&radius_units=km&per_page=10&format=json&nojsoncallback=1";
  // waiting for the Flickr API to respond with a response object
  return await fetch(searchURL);
}


/*
 *  'getInfoLink()' will be called in the first conditional of 'getPhoto()'
 *  it takes a response object and uses the photo Id in it to construct
 *  the link for the second Flickr API method: getInfo and returns a response object
 */
async function getInfoLink(response) {
  let photoId = await response.json();
  // picking one from the ten returned pics at random
  let rnd = Math.floor(Math.random()*10);
  let pId = photoId['photos']['photo'][rnd]['id'];

  // URI for the second ('getInfo') API method
  let getInfURL = BASE_URL + ".getInfo" + API_KEY + "&photo_id=" + pId +
                  "&format=json&nojsoncallback=1"
  // getting and returning the response object with the info of the pic
  return await fetch(getInfURL);
}


/*
 *  'photosLinks()' will be called in the second conditional of 'getPhoto()'
 *  it takes a response object and transforms it into an object containing
 *  two links: the URI of the static Flickr photo and a link to the Flickr user's
 *  gallery displaying the photo
 */
async function photoLinks(response) {
  photoData = await response.json();
  let pD = {};
    pD['id'] = photoData['photo']['id'];
    pD['farm'] = photoData['photo']['farm'];
    pD['server'] = photoData['photo']['server'];
    pD['secret'] = photoData['photo']['secret']; 
    pD['flickrURL'] = photoData['photo']['urls']['url'][0]['_content'];

    // constructing the URL ('src') of the picture
    let staticURL = "https://farm" + pD['farm']; 
    staticURL += ".staticflickr.com/" + pD['server'];
    staticURL += "/" + pD['id'];
    staticURL += "_" + pD['secret'] + "_m.jpg";
    return {'error': false,
            'staticURI': staticURL,
            'galleryURI': pD['flickrURL']} 
}


/*
 *  Using the three functions defined above 'getPhoto()' will use Flickr's two 
 *  API methods in one after another to get two links of one pic which is in the 
 *  vicinity (100m) of the Gmaps marker (at 'lat, lon' coordinates) 
 */
async function getPhoto(lat, lon) {
  try {
    let response = {};
    // waiting for the first response object from 'search' API method
    response[1] = await searchLink(lat, lon);

    if (response[1].ok) {
      // waiting for the second response object from 'getInfo' API method
      response[2] = await getInfoLink(response[1]);
    }

    if (response[2].ok) {
      return await photoLinks(response[2]);
    }

    // if one of the response objects were not ok throw an error
    throw new Error('Request failed: the Flickr API is not responding!'); 

    // if any other thing went wrong in the 'try' -> print an error message and return
    // the object below
  } catch (error) {
    console.log(error);
    return {'error': true};
  } 
}
