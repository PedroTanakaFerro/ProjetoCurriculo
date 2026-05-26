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

// Funções para o Pop-up (Modal)
function openModal(element) {
    var modal = document.getElementById("projectModal");
    var modalImg = document.getElementById("modalImg");
    var modalText = document.getElementById("modalText");

    modal.style.display = "flex"; // Exibe o modal usando flexbox para centralizar
    modalImg.src = element.src;    // Copia o caminho da imagem clicada
    modalText.innerText = element.getAttribute("data-desc"); // Copia o texto do atributo data-desc
}

function closeModal() {
    var modal = document.getElementById("projectModal");
    modal.style.display = "none"; // Esconde o modal
}

// Opcional: Fecha o modal se o usuário clicar fora da caixa branca
window.onclick = function(event) {
    var modal = document.getElementById("projectModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}