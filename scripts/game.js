class Game extends Phaser.Scene {
    constructor() {
        super({key: "Game"});
    }

    preload() {
        //images
        this.load.image('player', 'visuals/char-horn-girl.png');
        this.load.image('enemy', 'visuals/enemy-bug.png');
        this.load.image('bluePowerUp', 'visuals/GemBlue.png');
        this.load.image('greenPowerUp', 'visuals/GemGreen.png');
        this.load.image('orangePowerUp', 'visuals/GemOrange.png');
        this.load.image('life', 'visuals/Heart.png');
        this.load.image('Bullet', 'visuals/Key.png');
        this.load.image('asteroid', 'visuals/Rock.png');
        this.load.image('Star', 'visuals/Star.png');

        //audio
        this.load.audio('laser', ['audio/Laser_Shoot6.wav']);
    }

    create() {
        this.text = this.add.text(180, 10, "Welcome to Final Frontier!", {font: "40px Impact"});
        
        const tween = this.tweens.add({
            targets: this.text,
            x: 200,
            y: 200,
            duration: 2000,
            ease: "Elastic",
            easeParams: [1.5, 0.5],
            delay: 1000,
            onComplete: (src, tgt) => {
                tgt[0].x = 180;
                tgt[0].y = 10;
                tgt[0].setColor("Orange");
            }
        });
        
        this.image = this.add.image(400, 300, 'player');

        /* key inputs via event driven callbacks
        this.input.keyboard.on('keydown_D', event => {
            this.image.x += 10;
        });

        this.input.keyboard.on('keydown_A', event => {
            this.image.x--;
        });

        this.input.keyboard.on('keydown_S', event => {
            this.image.y += 10;
        });

        this.input.keyboard.on('keydown_W', event => {
            this.image.y -= 10;
        });
        */
        //key inputs tracked via polling
        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.input.on('pointerdown', event => {
            this.image.x = event.x;
            this.image.y = event.y;
        });

        this.input.keyboard.on('keydown_SPACE', event => {
            const physicsImage = this.physics.add.image(this.image.x, this.image.y, "Bullet");
            physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-100, 100), -300);
            this.laser = this.sound.add("laser");
            this.laser.play();
            // this.laser.rate = 0.5;
        });


        /* Alternate things to do with Audio
        this.input.keyboard.on('keydown_P', event => {
            this.laser = this.sound.add("laser");
            this.laser.play();
            this.laser.rate = 0.5;
            this.laser.loop = !this.laser.loop;
            if (this.laser.loop) {
                this.laser.play();
            }

            if (this.laser.isPlaying) {
                this.laser.pause();
            } else {
                this.laser.resume();
            }
        });*/

        this.input.keyboard.on('keydown', event => {
            if (event.key === "2") {
                this.scene.start("Example2");
            }
        });
    }

    update(delta) {
        if (this.key_W.isDown) {
            this.image.y -= 7;
        }

        if (this.key_S.isDown) {
            this.image.y += 7;
        }

        if (this.key_A.isDown) {
            this.image.x -= 7;
        }

        if (this.key_D.isDown) {
            this.image.x += 7;
        }
    }
}




var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 50}
        }
    },
    scene: [Game]
};


var game = new Phaser.Game(config);