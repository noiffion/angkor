
// Opens the sidepanel on clicking the menu bar (3 horizontal lines)
function openSideNav() {
    document.getElementById("mySideNav").style.width = "20vw";
    document.getElementById("sideNavButton").style.marginLeft = "20vw";
}

// Closes the sidepanel on clicking the menu bar (3 horizontal lines)
function closeSideNav() {
    document.getElementById("mySideNav").style.width = "0";
    document.getElementById("sideNavButton").style.marginLeft= "0";
}

// Changes the menu bar icon to a cross and the classToggle callback calls 
// conditinally one of the two function from above on clicking the menu bar
function sideNavToggle() {
    let navButton = document.getElementById("sideNavButton");
    // Callback for the addEventListener below
    function classToggle() {
      console.log(navButton);
      navButton.classList.toggle("cross");
      if (navButton.classList[0]) {
        openSideNav()
      } else {
        closeSideNav()
      }
    }
    navButton.addEventListener("click", classToggle);
}

sideNavToggle()
