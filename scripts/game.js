/*//  When the player sprite his the health packs, call this function ...
this.physics.add.overlap(sprite, healthGroup, spriteHitHealth);

function spriteHitHealth (sprite, health)
{
    //  Hide the sprite
    healthGroup.killAndHide(health);

    //  And disable the body
    health.body.enable = false;

    //  Add 10 health, it'll never go over maxHealth
    currentHealth = Phaser.Math.MaxAdd(currentHealth, 10, maxHealth);
}*/

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
        this.load.image('particleBlue', 'visuals/particleBlue.png');
        this.load.image('splashBG', 'visuals/blue_space_scape_by_heatstroke99-d331bty.png');

        //audio
        this.load.audio('laser', ['audio/Laser_Shoot6.wav']);
    }

    

    create() {
        const BG = this.add.image(400,300, 'splashBG');
        const particles = this.add.particles('particleBlue');

        const emitter = particles.createEmitter({
            speed: 20,
            scale: { start: 0.5, end: 0},
            blendMode: 'ADD'
        });

        this.player = this.physics.add.image(400, 300, 'player');
        // this.player = this.matter.add.image(400, 300, 'player').setIgnoreGravity(true);

        emitter.startFollow(this.player);
        this.player.setBounce(0.2); //player bounces when landing on ground
        this.player.setCollideWorldBounds(true);
        
        // this.matter.world.setBounds(); //defaults values
        // this.matter.world.setBounds(0, 0, 800, 600, 32, true, true, true, true);

        var asteroids = this.physics.add.group({
            key: 'asteroid',
            repeat: 4,
            setXY: {x: 25, y: 80, stepX: 150},
            immovable: false
        });

        asteroids.children.iterate(function (child) {
            child.setCollideWorldBounds(true);
            child.setGravityY(200); 
        });


        /* Generates asteriods for matterjs physics
        for (var i = 0; i < 5; i++) {
            var asteroid = this.matter.add.image(Phaser.Math.Between(100, 700), Phaser.Math.Between(600, 0), 'asteroid');
            asteroid.setCircle();
            asteroid.setFriction(0.005);
            asteroid.setBounce(1);
        }*/

        const collision = this.physics.add.collider(this.player, asteroids);
        
        //key inputs tracked via polling
        this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.key_SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.on('pointerdown', event => {
            this.player.x = event.x;
            this.player.y = event.y;
        });

        this.input.keyboard.on('keydown', event => {
            if (event.key === "2") {
                this.scene.start("Example2");
            }
        });


        this.input.on('pointerdown', function () {
            // this.cameras.main.shake(25);
            // this.cameras.main.flash();
        }, this);
    }

    update(delta) {
        if (this.key_W.isDown) {
            this.player.y -= 7;
        }

        if (this.key_S.isDown) {
            this.player.y += 7;
        }

        if (this.key_A.isDown) {
            this.player.x -= 7;
        }

        if (this.key_D.isDown) {
            this.player.x += 7;
        }

        if (this.key_SPACE.isDown) {
            var physicsImage = this.physics.add.image(this.player.x, this.player.y, "Bullet");
            
            physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-100, 100), -300);
            this.laser = this.sound.add("laser");
            this.laser.play();
        }
    }
}


function hitAsteroid() {
    player.setTint(0xff0000);
    gameOver = true;
}

class Splash extends Phaser.Scene {
    constructor() {
        super({key: "Splash"});
    }

    preload() {
        //images
        this.load.image('splashBG', 'visuals/blue_space_scape_by_heatstroke99-d331bty.png');

        //audio
        this.load.audio('splash', ['audio/Edit_erh_pulsar.wav']);
    }

    create() {
        this.BG = this.add.tileSprite(0, 0, 1600, 1200, 'splashBG');

        this.text = this.add.text(280, 30, "Final Frontier", {font: "40px Impact"});

        const tween = this.tweens.add({
            targets: this.text,
            x: 280,
            y: 200,
            duration: 2000,
            ease: "Elastic",
            easeParams: [1.5, 0.5],
            delay: 1000,
            onComplete: (src, tgt) => {
                // tgt[0].x = 280;
                // tgt[0].y = 30;
                tgt[0].setColor("OrangeRed");
            }
        });

        this.splash = this.sound.add("splash", {loop: "true"});
        this.splash.play();

        this.text = this.add.text(300, 350, "Press Enter to Begin", {font: "20px Impact"});
        
        this.input.keyboard.on('keydown', event => {
            if (event.key === "Enter") {
                this.splash.pause();
                this.scene.start("Game");
            }
        });
    }

    update(delta) {
        // this.BG.tilePosition.y += 0.2;
        // this.BG.scrollY += 0.2 ;
    }
}



var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade', //matter
        arcade: {
            gravity: {y: 0}
        }
    },
    scene: [Splash, Game]
};


var game = new Phaser.Game(config);





/*
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 400},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

let score = 0;
let scoreText;

function preload () {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
}

function create () {
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');


    //player object added to screen
    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.4); //player bounces when landing on ground
    player.setCollideWorldBounds(true); //sets the bounds of game screen to the screen itself
    
    //add in animations of sprite sheet
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{key: 'dude', end: 4}],
        frameRate: 20,
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: {x: 12, y: 0, stepX: 70}
    });

    stars.children.iterate(function (child) {
        child.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
    });


    scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
    
    bombs = this.physics.add.group();

    // player.body.setGravityY(300); 
    //set the collision of two objects or groups of objects
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

let jump = 0;
function update () {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    
    // 
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-380);
        jump++;
        console.log(jump);
    }

    setTimeout( function jumpDelay() {
        if (jump <= 2) {
            jump = 0;
        }
    }, 2000);
}

function collectStar(player, star) {
    star.disableBody(true, true);
    
    score += 10;
    scoreText.setText(`Score: ${score}`);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        let x =(player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        const bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function hitBomb() {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}*/





/* key inputs via event driven callbacks
        this.input.keyboard.on('keydown_D', event => {
            this.player.x += 10;
        });

        this.input.keyboard.on('keydown_A', event => {
            this.player.x--;
        });

        this.input.keyboard.on('keydown_S', event => {
            this.player.y += 10;
        });

        this.input.keyboard.on('keydown_W', event => {
            this.player.y -= 10;
        });
        */



       /*  this is an event driven laser shot does not allow simultaneous movement and shooting
        this.input.keyboard.on('keydown_SPACE', event => {
            const physicsImage = this.physics.add.image(this.player.x, this.player.y, "Bullet");
            physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-100, 100), -300);
            this.laser = this.sound.add("laser");
            this.laser.play();
            // this.laser.rate = 0.5;
        });*/


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