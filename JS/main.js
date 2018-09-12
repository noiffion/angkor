
/*
 *  An object containing the characteristics of the sights and three computed observables
 *  'self.isSelected' is a Boolean depending on the 'self.sightClick()' function (the <li>
 *  element is clicked on --> it sets it to true) and the  'markerHighlight' observable which
 *  in turns depends on the opened/closed state of the infowindow  'self.isDisplayed'
 *  is also a Boolean depending on 'searchSights()' function (it filters the list based on
 *  the value of the <input> element)
 */
var Sight = function(id, name, loc, highlightedID, searchedText) {
  let self = this;
  self.id = id,
  self.name = name,
  self.loc = loc,
  self.isSelected = ko.computed(function() 
                    {
                      if (highlightedID() === self.id) {return true;}
                      else {return false;}
                    }),
  self.isDisplayed = ko.computed(function() 
                     {
                       let name = self.name.toLowerCase();
                       if (searchedText()) 
                       {
                         if (name.includes(searchedText().toLowerCase())) {return true;} 
                         else {return false;}
                       } 
                       else {return true;}
                     })
};


var sightsVM = function() {
  var self = this;

 /*
  *  Changes the menu bar icon to a cross and back to three bars and makes
  *  the side menu slide in and out (bindings to: 'mySideNav', <nav> and
  *  <main> elements)
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
  *  then rendering them with foreach in the View (HTML <ul id="sightsList">)
  */
  let locs = JSON.parse(localStorage.getItem("sights"));
  let locsLen = localStorage.getItem("sightsLen");
  
  self.sightsList = ko.observableArray();
  self.highlightedID = ko.observable(0);
  self.searchedText = ko.observable();
  // Creating the sightsList ko array from the 'Sight' objects
  for (let i = 0; i < locsLen; i++) 
  {
    self.sightsList.push(
      (new Sight(locs[i]['id'], locs[i]['name'], locs[i]['loc'],
                 self.highlightedID,  self.searchedText))
    )
  };
  // highlights the clicked item on the sights list
  self.sightClickedOn = function(sight) 
  {
    self.highlightedID(0);
    self.highlightedID(sight.id);
  };

  // highlights an item on the sightlist after clicking on the marker 
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
  // filters the markers based on the filtered list
  self.displayList = ko.computed(function() 
  {
    for (let i = 0; i < locsLen; i++) 
    {
      if (self.sightsList()[i].isDisplayed) {returnMarkers()[i].setVisible(true)}
      else {returnMarkers[i].setVisible(false)}
    };
  });
  */
}

ko.applyBindings(new sightsVM());
