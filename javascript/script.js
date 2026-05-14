var sidebar = document.getElementById("sidebar");
var main = document.getElementById("main");
var menuIcon = document.getElementById("menuicon");

var isSidebarOpen = false;

function toggleNav() {
    isSidebarOpen = !isSidebarOpen;
    if (isSidebarOpen) {
        sidebar.style.width = "300px";
        main.style.marginLeft = "300px";
        menuIcon.src = "imagens/icons-close-s.png";
    } else {
        sidebar.style.width = "0px";
        main.style.marginLeft = "0px";
        menuIcon.src = "imagens/icons-menu-s.png";
    }
}

