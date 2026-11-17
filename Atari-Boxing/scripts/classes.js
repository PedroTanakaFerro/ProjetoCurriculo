class Object {
    frame = 1;
    timer = 0;

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        var img = new Image();
        img.src = this.color;
        pincel.drawImage(img, this.x, this.y, this.width, this.height);
    }

    animation(name) {
        this.timer += 1;

        if(this.timer > 10) {
            this.timer = 0;
            this.frame++;
        }

        if(this.frame > 4) {
            this.frame = 1;
        }

        this.color = "img/" + name + this.frame + ".png";
    }

    collide(obj) {
        var tolerance = 5; // tolerance for collision detection

        var col = 0;
        
        if(this.x < obj.x + obj.width/2 && this.x + this.width > obj.x && this.y < obj.y + obj.height - tolerance && this.y + this.height > obj.y + tolerance) { // hit the left side of the object
            col = 1;
        } else if(this.x > obj.x + obj.width/2 && this.x < obj.x + obj.width && this.y < obj.y + obj.height - tolerance && this.y + this.height > obj.y + tolerance) { // hit the right side of the object
            col = 2;
        } else if(this.y < obj.y + obj.height/2 && this.y + this.height > obj.y && this.x < obj.x + obj.width && this.x + this.width > obj.x) { // hit the top side of the object
            col = 3;
        } else if(this.y > obj.y + obj.height/2 && this.y < obj.y + obj.height && this.x < obj.x + obj.width && this.x + this.width > obj.x) { // hit the bottom side of the object
            col = 4;
        }

        return col;
    }
}

class Text {
    constructor(x, y, color, font) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.font = font;
    }
    
    draw(texto) {
        pincel.font = this.font;
        pincel.fillStyle = this.color;
        pincel.fillText(texto, this.x, this.y);
    }
}

// Classe para efeitos visuais de impacto (partículas, onda de choque e texto)
class HitEffect {
    constructor(x, y, isCritical) {
        this.x = x;
        this.y = y;
        this.isCritical = isCritical;
        this.life = 22; // duração em frames (~440ms)
        this.maxLife = 22;
        this.radius = 8;
        this.textY = y - 15;
        this.particles = [];

        const count = isCritical ? 18 : 10;
        const palette = isCritical 
            ? ['#ff3344', '#ffbe0b', '#ffffff', '#ff7700'] 
            : ['#ffffff', '#00f0ff', '#ffbe0b'];

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.4 - 0.2);
            const speed = (isCritical ? 4.5 : 3) + Math.random() * 3.5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: isCritical ? (Math.random() * 4 + 4) : (Math.random() * 3 + 3),
                color: palette[Math.floor(Math.random() * palette.length)]
            });
        }
    }

    update() {
        this.life--;
        this.radius += this.isCritical ? 4.5 : 3;
        this.textY -= 1.4;

        for (let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.90; // atrito
            p.vy *= 0.90;
        }
    }

    draw() {
        const alpha = Math.max(0, this.life / this.maxLife);
        pincel.save();
        pincel.globalAlpha = alpha;

        // 1. Onda de choque circular
        pincel.beginPath();
        pincel.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        pincel.strokeStyle = this.isCritical ? '#ffbe0b' : '#ffffff';
        pincel.lineWidth = this.isCritical ? 4 : 2.5;
        pincel.stroke();

        // 2. Flash central nos primeiros frames
        if (this.life > this.maxLife - 5) {
            pincel.fillStyle = '#ffffff';
            pincel.beginPath();
            pincel.arc(this.x, this.y, this.isCritical ? 22 : 14, 0, Math.PI * 2);
            pincel.fill();
        }

        // 3. Partículas pixeladas (estilo Atari)
        for (let p of this.particles) {
            pincel.fillStyle = p.color;
            pincel.fillRect(Math.round(p.x), Math.round(p.y), Math.round(p.size), Math.round(p.size));
        }

        // 4. Texto flutuante (+1 ou +2!)
        pincel.font = this.isCritical ? "18px 'Press Start 2P'" : "14px 'Press Start 2P'";
        pincel.textAlign = "center";
        
        pincel.fillStyle = "#000000";
        pincel.fillText(this.isCritical ? "+2!" : "+1", this.x + 2, this.textY + 2);
        
        pincel.fillStyle = this.isCritical ? "#ffbe0b" : "#ffffff";
        pincel.fillText(this.isCritical ? "+2!" : "+1", this.x, this.textY);

        pincel.restore();
    }
}

class Player extends Object {
    score = 0;
    dirX = 0;
    dirY = 0;
    isHit = false;
    
    constructor(x, y, width, height, color, id, armL, armR) {
        super(x, y, width, height, color);
        this.id = id;
        this.armL = armL;
        this.armR = armR;
    }

    draw() {
        this.armL.draw();
        this.armR.draw();
        super.draw();
    }

    move(...collisions) {
        this.x += this.dirX;
        this.y += this.dirY;
        this.armL.x += this.dirX;
        this.armL.y += this.dirY;
        this.armR.x += this.dirX;
        this.armR.y += this.dirY;

        for(var i = 0; i < collisions.length; i++) {
            var col = this.collide(collisions[i]);
            
            switch(col) {
                case 1:
                    this.armL.x = collisions[i].x - this.armL.width;
                    this.armR.x = collisions[i].x - this.armR.width;
                    this.x = collisions[i].x - this.width;
                    break;
                case 2:
                    this.armL.x = collisions[i].x + collisions[i].width;
                    this.armR.x = collisions[i].x + collisions[i].width;
                    this.x = collisions[i].x + collisions[i].width;
                    break;
                case 3:
                    this.armL.y = collisions[i].y - this.armL.height;
                    this.armR.y = collisions[i].y - this.armR.height;
                    this.y = collisions[i].y - this.height;
                    break;
                case 4:
                    this.armL.y = collisions[i].y + collisions[i].height;
                    this.armR.y = collisions[i].y + collisions[i].height;
                    this.y = collisions[i].y + collisions[i].height;
                    break;
            }
        }
    }

    punch(player, hitSound) {
        var criticalDistance = 85; // distância para golpe crítico (+2 pontos)
        var distanceX = this.x - player.x;
        var distanceY = this.y - player.y;
        var absDistY = Math.abs(distanceY);
        var arm;

        if((distanceX < 0) ^ (distanceY < 0)) { // punch with the arm closer to the other player's head
            arm = this.armL;
        } else {
            arm = this.armR;
        }
        arm.frame = 3;

        // Cria uma hitbox expandida da cabeça do oponente para aumentar a tolerância do soco
        var reachMargin = 14; // margem extra de alcance horizontal (px)
        var headHitbox = {
            x: player.x - reachMargin,
            y: player.y - 10,
            width: player.width + (reachMargin * 2),
            height: player.height + 20
        };

        // Tolerância vertical ampliada (antes era de 0.33 a 0.66; agora vai de 0.15 a 0.85 da altura)
        var verticalHit = absDistY > player.height * 0.15 && absDistY < player.height * 0.85;

        // Verifica se o soco acertou
        if(arm.collide(headHitbox) && verticalHit) {
            
            var isCritical = Math.abs(distanceX) < criticalDistance;

            if(isCritical) {
                this.score += 2;
            } else {
                this.score += 1;
            }

            // Calcula o ponto exato do impacto no rosto do oponente
            var impactX = player.x + (this.x < player.x ? 15 : player.width - 15);
            var impactY = player.y + player.height / 2;

            // Dispara o efeito visual e o tremor de tela
            if (typeof spawnHitEffect === "function") {
                spawnHitEffect(impactX, impactY, isCritical);
            }

            // Knockback aumentado (empurrão mais forte até o limite das cordas)
            var pushForce = isCritical ? 28 : 15;
            var pushDir = this.x < player.x ? 1 : -1;
            var minRingX = 210; // limite da corda esquerda
            var maxRingX = 750 - player.width; // limite da corda direita

            player.x = Math.max(minRingX, Math.min(maxRingX, player.x + (pushDir * pushForce)));

            player.color = `img/p${player.id}/head_hit.png`;
            player.isHit = true;

            hitSound.currentTime = 0;
            hitSound.play();

            setTimeout(() => {
                player.color = `img/p${player.id}/head.png`;
                player.isHit = false;
            }, 200);
        }
    }

    retract() {
        this.armR.frame = 1;
        this.armL.frame = 1;
    }

    flip(player) {
        if(this.x < player.x) {
            this.color = `img/p${this.id}/flipped/head${this.isHit?"_hit":""}.png`;
            this.armL.color = `img/p${this.id}/flipped/arm_l${this.armL.frame}.png`;
            this.armL.x = this.x;
            this.armR.color = `img/p${this.id}/flipped/arm_r${this.armR.frame}.png`;
            this.armR.x = this.x;
        } else {
            this.color = `img/p${this.id}/head${this.isHit?"_hit":""}.png`;
            this.armL.color = `img/p${this.id}/arm_l${this.armL.frame}.png`;
            this.armL.x = this.x + this.width - this.armL.width;
            this.armR.color = `img/p${this.id}/arm_r${this.armR.frame}.png`;
            this.armR.x = this.x + this.width - this.armR.width;
        }
    }
}