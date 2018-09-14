# The Sights of Angkor Wat

This single page application weaves togther two APIs (Google Maps, Flickr) with the knockout.js
library.

It displays eight sites of a landmark Khmer architecture: the Angkor Wat temple complex in Cambodia,
marking these locations in the Google Maps frame with green markers and listing them on the left
in the off-canvas menu in alphabetical order.


### Program files and requiered software

A modern webbroswer is all that is needed, every other kind of software used is downloaded 
automatically (in the main.html 'script' tags).

By modern webbrowser I mean the following ones:
- Chrome 55
- Vivaldi 1.15
- Firefox 42
- Opera 42
- Safari 10.1
- Edge

As mentioned before two APIs are used:
 - [Google Maps API](https://developers.google.com/maps/documentation/javascript/reference/map)
 - [Flickr API](https://www.flickr.com/services/api/)

And the knockout.js framework:
 - [Knockout.js](https://knockoutjs.com/)


### Program structure and behaviour

Structure (HTML), behaviour (JS), and decoration (CSS) are strictly separated: the main.html
contains only the html skeleton of the app with the necessary knockout bindings.

The five scripts in the JS folder (plus one in the main.html) drive the behaviour of the page.<br>
Here is a list of them: (in order of appearance in the main.html file). <br>
<br>In the HEAD:
- (1) The first one is the necessary deferred Gmaps script. Its attributes ('onerror'
'src', 'defer') are set in the gmaps.js file 'gMapsURI()'to keep the HTML nice and clean.
- (2) The base.js is loaded first and it contains the 'Sites' object which lists the attributes
and coordinates of the locations. It is static script loaded synchronously as the data there
is needed in multiple (asynchronously loaded) files. It also contains the declarations of a couple 
of variables shared accross the scripts.
- (3) The third script is the knockout framework: knockout-3.4.2.js


In the BODY:
- (4) The fourth one (flickr.js) contains the four functions needed to connect to the Flickr API
in two steps to retreive data of 10 pictures at a given latitude, longitude and pick one of them
randomly. The one main ('getPhoto()') will return asynchronously the two URIs (one static and the
other is a link to the author's gallery where this picture, the particulars of the owner, and other
pics can be found. This serves as attribution as well.).
- (5) The fifth one (gmaps.js) is the script that connects to the Google Maps API. It contains the
functions directing the behaviour of the onloaded map. It tracks the events happening on the map.
- (6) The sixths one (main.js) contains the knockout ViewModel: it contains the 'Sight' objects in 
a ko.observablearray(). It tracks the events outside of the map and connects the off-canvas list 
elements (and their behaviour: which one gets highlighted, which ones get displayed) to the markers 
and infoWindows on the map.

The main functions are separated in all scripts and detailed comments explaining their behaviour 
are placed above (and inside) each of one them. The scripts are set to be max 100 characters wide.
I attempted to us localStorage to store the data of the 'sites' object but Edge refused to comply
so I abandoned the idea (and it might be worth noting that 
[not everyone](https://dev.to/rdegges/please-stop-using-local-storage-1i04) is on board anyway).


### User interface

After opening the page eight green markers will fall down on the map. Clicking on one of them 
displays an infoWindow with a title and a picture taken at the location of the marker's 100m circle. 
Clicking on the picture will open a new tab leading to the owner's gallery where the original
photo (among others) can be found. Clicking on the same marker will load another picture.

Clicking on the 'sandwich' menu icon will make the off-canvas menu to float in from the left 
displaying a list of the eight sites in alphabetical order. Clicking on one of them has the same
effect as clicking on a marker in the map. Clicking on the searchbox will remove the infoWindow in 
the map. Filtering the markers on the page and the list on the menu on the left can be done with
the searchbox.


### Code sources and examples:

[Off-canvas menu](https://www.w3schools.com/howto/howto_js_off-canvas.asp) <br>
[Sandwich menu icon](https://www.w3schools.com/howto/howto_css_menu_icon.asp) <br>
[Responsive GMap](https://codepen.io/hubpork/pen/xriIz?q=map) <br>
[List element highlighting with knockout.js](https://jsfiddle.net/johnpapa/6FCEe/) <br>
[JS Script loading](https://www.html5rocks.com/en/tutorials/speed/script-loading/)
