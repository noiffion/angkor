
/*
 *  The function sets the visibility of the individual markers.
 *  Checking the type of markers (its undefined initially) to avoid errors. 
 *  It is called when we filter the list on the left of the webpage.
 */
function visibleMarker(i, bool)
{
  try
  {
    if (typeof markers === 'object') 
    {
      for (let n = 1; n < markers.length; n++)
      {
        // a sight id and its associated marker position number in the markers list might
        // not be identical so it has to be checked here
        if (i === markers[n].id)
        {
           markers[n].setVisible(bool);
           break;
        }
      }
    }
  }
  catch (error) {alert(error);}
};


//--------------------------------------------------------------------------------------------------


/*
 *  Clicking on one of the list items on the left will open up an infoWindow on a marker.
 */
function connectListToMarker(i)
{
  try
  {
    if (typeof infWin === 'object' && typeof markers === 'object')
    { 
      for (let n = 0; n < markers.length; n++)
      {
        // a sight id and its associated marker position number in the markers list might
        // not be identical so it has to be checked here
        if (i === markers[n].id) 
        {
          infoWindow(markers[n], infWin, bounce); 
          break;
        }
      }
    }
  }
  catch (error) {alert(error);
  }
};
 

//--------------------------------------------------------------------------------------------------


/*
 *  An object containing the characteristics of the sights and two computed observables.
 *  'isSelected' is a boolean depending on the 'sightClickedOn()' and 'markerClickedOn()'
 *  functions. If the <li> element or a marker on the map is clicked on 'highlightedID' will take
 *  the id of the associated Sight object and 'isSelected' will turn true. That triggers the 
 *  'selected' CSS class on which makes the color of the list item orange. 
 *  'isDisplayed' will be true depending on the 'searchSights' function (if the searchbox on the
 *  upper left contains letters that are in the names of the sights it returns true for the 
 *  'isDisplayed' properties for those Sight objects and they remain visible in accordance with the 
 *  binding). These 'Sight' objects will be stored in the 'sightsList = ko.observableArray()'
 */
var Sight = function(id, name, loc, highlightedID, searchedText) {
  let self = this;
  self.id = id,
  self.name = name,
  self.loc = loc,
  self.isSelected = ko.computed(function()
                    {
                      if (highlightedID() === self.id)  
                      {
                        connectListToMarker(self.id);
                        return true;
                      }
                      else {return false;}
                    }),
  self.isDisplayed = ko.computed(function()
                     {
                       let name = self.name.toLowerCase();
                       // check if there is anything in the searchbox
                       if (searchedText())
                       {
                         // display the sights which contain the letters typed in the searchbox
                         if (name.includes(searchedText().toLowerCase())) 
                         {
                            visibleMarker(self.id, true);
                            return true;
                         }
                         // display nothing if there are letters in the searchbox which
                         // are not in the name of the sights
                         else 
                         {
                            
                            visibleMarker(self.id, false);
                            return false;
                         }
                       }
                       // display everything if there is nothing in the searchbox
                       else 
                       {
                         visibleMarker(self.id, true);
                         return true;
                       }
                     })
};


//--------------------------------------------------------------------------------------------------


// The ViewModel
var sightsVM = function() {
  var self = this;

 /*
  *  Changes the menu bar icon to a cross and back to three bars and makes
  *  the side menu slide in and out (bindings to: 'mySideNav', <nav> and
  *  <main> elements).
  */ 
  self.sideNav = ko.observable(false);
  self.sideNavToggle = function()
  {
    if (self.sideNav()) {self.sideNav(false);}
    else {self.sideNav(true);}
  };

 /*
  *  Putting the list of sights in the "locationList" <ul> tag by first putting
  *  the list of sights from the localStorage to the 'sightsList' observablearray
  *  then rendering them with foreach in the View (HTML <ul id="sightsList">).
  */
  let locs = JSON.parse(localStorage.getItem("sights"));
  let locsLen = localStorage.getItem("sightsLen");
  
  self.sightsList = ko.observableArray();
  // 'highlightedID' will contain an id
  self.highlightedID = ko.observable(0);
  // 'searchedText' will contain letters from the searchbox
  self.searchedText = ko.observable();
  // Creating the sightsList ko array from the 'Sight' objects
  for (let i = 0; i < locsLen; i++)
  {
    self.sightsList.push(
      (new Sight(locs[i]['id'], locs[i]['name'], locs[i]['loc'],
                 self.highlightedID,  self.searchedText))
    )
  };

 /*
  *  sets 'highlightedID' to the id of the item that will be highlighted
  *  or to 0 if there is nothing to be highlighted (binding to <li>) 
  */
  self.sightClickedOn = function(sight)
  {
    self.highlightedID(0);
    self.highlightedID(sight.id);
  };

 /*
  *  sets 'highlightedID' to the id of the item that will be highlighted
  *  or to 0 if there is nothing to be highlighted (binding to the hidden
  *  <input> element that takes values from the Google Maps markers when 
  *  they are clicked on
  */
  self.markerClickedOn = function(SightsVM, event)
  {
    if (JSON.parse(event.currentTarget.value).open)
    {
      self.highlightedID(0);
      self.highlightedID(JSON.parse(event.currentTarget.value).id);
    }
    else
    {
      self.highlightedID(0);
    }
  };


  // filters the list based on input characters
  self.searchSights = function(sightsVM, event)
  {
    self.searchedText(event.currentTarget.value);
  };


 /*
  *  if the searchbox is clicked on it clears the highlights and the markers of the 
  *  map (from changing colors and bouncing)
  */
  self.searchClickedOn = function()
  {
    // closing the infowindow and setting the marker green on clicking the search box
    if (typeof infWin === 'object') 
    { 
      let i = self.highlightedID()
      for (let n = 0; n < markers.length; n++)
      {
        // a sight id and its associated marker position number in the markers list might
        // not be identical so it has to be checked here
        if (i === markers[n].id)
        {
          // remove highlight
          infWinClose(markers[n], infWin);
          break;
        }
      }
    }
    self.highlightedID(0);
  }
};

ko.applyBindings(new sightsVM());
