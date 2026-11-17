var tela = document.querySelector('canvas');
var pincel = tela.getContext('2d');

const tick = 20; // frame duration in miliseconds
var inputPlayer1 = [false, false, false, false, false]; // up, down, left, right, punch
var inputPlayer2 = [false, false, false, false, false];
var playing = true;
var targetScore = 100;
var won = -1;

var playerSpeedX = 4;
var playerSpeedY = 3;

var timer = 120;

// Variáveis dos efeitos visuais de impacto
var hitEffects = [];
var shakeTime = 0;
var shakeIntensity = 0;

function spawnHitEffect(x, y, isCritical) {
    hitEffects.push(new HitEffect(x, y, isCritical));
    shakeTime = isCritical ? 8 : 4;
    shakeIntensity = isCritical ? 7 : 3.5;
}

var hit1Sound = document.getElementById("hit1Audio");
var hit2Sound = document.getElementById("hit2Audio");
var gameOverSound = document.getElementById("gameOverAudio");
var ambientSound = document.getElementById("ambientAudio");
ambientSound.volume = 0.2;
ambientSound.loop = true;

var timerText = new Text(440, 64, "#143800", "32px 'Press Start 2P'");
var player1ScoreText = new Text(300, 64, "#d8d8d8", "32px 'Press Start 2P'");
var player2ScoreText = new Text(660, 64, "#000000", "32px 'Press Start 2P'");

var bg = new Object(0, 0, 960, 630, "img/Boxing Ring.png");
var ringL = new Object(0, 0, 210, 630, "");
var ringR = new Object(750, 0, 210, 630, "");
var ringT = new Object(0, 0, 960, 120, "");
var ringB = new Object(0, 520, 960, 100, "");
var rings = [ringL, ringR, ringT, ringB];
var p1X = 210;
var p1Y = 130;
var p1leftArm = new Object(p1X, p1Y, 180, 141, "img/p1/arm_l1.png");
var p1rightArm = new Object(p1X, p1Y, 180, 141, "img/p1/arm_r1.png");
var player1 = new Player(p1X, p1Y, 78, 141, "img/p1/head.png", 1, p1leftArm, p1rightArm);
var p2X = 670;
var p2Y = 370;
var p2leftArm = new Object(p2X, p2Y, 180, 141, "img/p2/arm_l1.png");
var p2rightArm = new Object(p2X, p2Y, 180, 141, "img/p2/arm_r1.png");
var player2 = new Player(p2X, p2Y, 78, 141, "img/p2/head.png", 2, p2leftArm, p2rightArm);

function main() {
    if(playing) {
        pincel.clearRect(0, 0, 960, 630);
        update();
        draw();
    }
}

setInterval(main, tick);
setInterval(()=>{timer--}, 1000); // diminui o timer a cada segundo

function update() {
    if(!inputPlayer1[4]) player1.move(player2, ...rings);
    if(!inputPlayer2[4]) player2.move(player1, ...rings);
    player1.flip(player2);
    player2.flip(player1);

    // Atualiza partículas, ondas de choque e textos de dano
    for (let i = hitEffects.length - 1; i >= 0; i--) {
        hitEffects[i].update();
        if (hitEffects[i].life <= 0) {
            hitEffects.splice(i, 1);
        }
    }

    // Reduz temporizador do tremor de tela
    if (shakeTime > 0) {
        shakeTime--;
    }

    gameOver();
}

function draw() {
    pincel.save();

    // Aplica deslocamento aleatório caso a tela esteja tremendo
    if (shakeTime > 0) {
        var dx = (Math.random() - 0.5) * 2 * shakeIntensity;
        var dy = (Math.random() - 0.5) * 2 * shakeIntensity;
        pincel.translate(dx, dy);
    }

    bg.draw();
    player1.draw();
    player2.draw();

    // Desenha os efeitos visuais por cima dos lutadores
    for (let i = 0; i < hitEffects.length; i++) {
        hitEffects[i].draw();
    }

    pincel.restore();

    // Placar e cronômetro ficam fixos (não tremem junto com o ringue)
    timerText.draw(Math.floor(timer/60) + ":" + (timer%60 < 10 ? "0" : "") + timer%60);
    player1ScoreText.draw(player1.score);
    player2ScoreText.draw(player2.score);
}

function gameOver() {
    if(timer <= 0) {
        playing = false;
        won = false;
        ambientSound.pause();
        gameOverSound.play();
    }

    if(player1.score >= targetScore || player2.score >= targetScore) {
        playing = false;
        won = true;
        ambientSound.pause();
        gameOverSound.play();
    }
}

// handle input
document.addEventListener("keydown", function(e) {
    e.preventDefault();

    // Player 1
    if(e.key === 'w') {
        inputPlayer1[0] = true;
        player1.dirY = -playerSpeedY;
    }

    if(e.key === 's') {
        inputPlayer1[1] = true;
        player1.dirY = playerSpeedY;
    }
    
    if(e.key === 'a') {
        inputPlayer1[2] = true;
        player1.dirX = -playerSpeedX;
    }

    if(e.key === 'd') {
        inputPlayer1[3] = true;
        player1.dirX = playerSpeedX;
    }

    if(e.key === ' ') {
        if (!inputPlayer1[4]) { // evita disparo contínuo ao segurar a tecla
            player1.punch(player2, hit2Sound);
        }
        inputPlayer1[4] = true;
    }

    // Player 2
    if(e.key === 'ArrowUp') {
        inputPlayer2[0] = true;
        player2.dirY = -playerSpeedY;
    }

    if(e.key === 'ArrowDown') {
        inputPlayer2[1] = true;
        player2.dirY = playerSpeedY;
    }

    if(e.key === 'ArrowLeft') {
        inputPlayer2[2] = true;
        player2.dirX = -playerSpeedX;
    }

    if(e.key === 'ArrowRight') {
        inputPlayer2[3] = true;
        player2.dirX = playerSpeedX;
    }

    if(e.key === 'Enter') {
        if (!inputPlayer2[4]) { // evita disparo contínuo ao segurar a tecla
            player2.punch(player1, hit1Sound);
        }
        inputPlayer2[4] = true;
    }
});

document.addEventListener("keyup", function(e) {
    e.preventDefault();

    // Player 1
    if(e.key === 'w') {
        inputPlayer1[0] = false;

        if(inputPlayer1[1]) player1.dirY = playerSpeedY;
        else player1.dirY = 0;
    }

    if(e.key === 's') {
        inputPlayer1[1] = false;

        if(inputPlayer1[0]) player1.dirY = -playerSpeedY;
        else player1.dirY = 0;
    }

    if(e.key === 'a') {
        inputPlayer1[2] = false;

        if(inputPlayer1[3]) player1.dirX = playerSpeedX;
        else player1.dirX = 0;
    }

    if(e.key === 'd') {
        inputPlayer1[3] = false;

        if(inputPlayer1[2]) player1.dirX = -playerSpeedX;
        else player1.dirX = 0;
    }

    if(e.key === ' ') {
        inputPlayer1[4] = false;
        player1.retract();
    }

    // Player 2
    if(e.key === 'ArrowUp') {
        inputPlayer2[0] = false;

        if(inputPlayer2[1]) player2.dirY = playerSpeedY;
        else player2.dirY = 0;
    }

    if(e.key === 'ArrowDown') {
        inputPlayer2[1] = false;

        if(inputPlayer2[0]) player2.dirY = -playerSpeedY;
        else player2.dirY = 0;
    }

    if(e.key === 'ArrowLeft') {
        inputPlayer2[2] = false;

        if(inputPlayer2[3]) player2.dirX = playerSpeedX;
        else player2.dirX = 0;
    }

    if(e.key === 'ArrowRight') {
        inputPlayer2[3] = false;

        if(inputPlayer2[2]) player2.dirX = -playerSpeedX;
        else player2.dirX = 0;
    }

    if(e.key === 'Enter') {
        inputPlayer2[4] = false;
        player2.retract();
    }
});