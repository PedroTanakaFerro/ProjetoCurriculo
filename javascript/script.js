var sidebar = document.getElementById("sidebar");
var main = document.getElementById("main");
var menuIcon = document.getElementById("openbtn");

function openNav() {
    sidebar.style.width = "300px";
    main.style.marginLeft = "300px";
    openbtn.style.display = "none";
}

function closeNav() {
    sidebar.style.width = "0px";
    main.style.marginLeft = "0px";
    openbtn.style.display = "inline";
}
