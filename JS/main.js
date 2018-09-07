
// Opens the sidepanel on clicking the menu bar (3 horizontal lines)
function openSideNav() {
    document.getElementById("mySideNav").style.width = "15vw";
    document.getElementsByTagName("nav")[0].style.marginLeft = "15vw";
    document.getElementsByTagName("main")[0].style.marginLeft = "15vw";
}

// Closes the sidepanel on clicking the menu bar (3 horizontal lines)
function closeSideNav() {
    document.getElementById("mySideNav").style.width = "0";
    document.getElementsByTagName("nav")[0].style.marginLeft= "0";
    document.getElementsByTagName("main")[0].style.marginLeft = "0";
}

// Changes the menu bar icon to a cross and the classToggle callback calls 
// conditinally one of the two function from above on clicking the menu bar
function sideNavToggle() {
    let navButton = document.getElementById("sideNavButton");
    // Callback for the addEventListener below
    function classToggle() {
      navButton.classList.toggle("cross");
      if (navButton.classList[0]) {
        openSideNav()
      } else {
        closeSideNav()
      }
    }
    navButton.addEventListener("click", classToggle);
}


function searchSights() {
    let input, filter, ul, li, a, i, liLen;
    input = document.getElementById("inputSight");
    filter = input.value.toUpperCase();
    ul = document.getElementById("sightList");
    li = ul.getElementsByTagName("li");
    liLen = li.length;
    for (i = 0; i < liLen; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

sideNavToggle();
