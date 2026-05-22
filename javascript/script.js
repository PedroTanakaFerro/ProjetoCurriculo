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

// Configurações do Carrossel
var currentIndex = 0;

function moveCarousel(direction) {
    var track = document.getElementById("carouselTrack");
    var items = document.getElementsByClassName("carousel-item");
    var totalItems = items.length;
    
    // Como exibe 3 por vez, o índice máximo alcançável é (total de itens - 3)
    var maxIndex = totalItems - 3; 

    currentIndex += direction;

    // Trata os limites para não passar do início ou do fim
    if (currentIndex < 0) {
        currentIndex = 0;
    } else if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }

    // Calcula a largura de um item baseado no layout (33.333%) para mover o container de forma responsiva
    var percentageToMove = currentIndex * (100 / 3);
    track.style.transform = "translateX(-" + percentageToMove + "%)";
}
