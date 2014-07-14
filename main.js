var game = new Phaser.Game(320, 480, Phaser.AUTO, '');
/*
var player;
var maxVelocity = 150;
var acceleration = 10;
var cursors;
var speed = 1;

var map;
var layer;
var bullets;
var bulletTime = 0;

var enemyPool;
var nextEnemyAt;
var enemyDelay;
var emitter;

var score;
*/


var main_state = {

    preload: function () {
        this.load.image('imgPlayer', 'assets/player.png');
        this.load.image('bullets', 'assets/bullet.png');
        this.load.image('bgTile', 'assets/Backgrounds/darkPurple.png');
        this.load.image('enemy', 'assets/enemies/enemyBlack2.png');
        this.load.image('explosion_particle', 'assets/enemies/explosion_particle.png');
    },

    create: function () {

        //enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //enable keyboard cursors
        this.cursors = this.input.keyboard.createCursorKeys();

        //create the background
        this.bgTile = this.add.tileSprite(0, 0, this.stage.bounds.width, this.stage.bounds.height, 'bgTile');
        
        this.createPlayer();
        this.createEnemies();
        this.createScoreText();
    },


    update: function (){
        this.bgTile.tilePosition.y += 1;

        this.physics.arcade.overlap(this.bullets, this.enemyPool, this.enemyHit, null, this );

        this.updatePlayer();
        this.updateEnemies();

    },

    createPlayer: function (){
        this.player = this.add.sprite((this.world.width / 2), (this.world.height * 0.8), 'imgPlayer');
        this.physics.enable(this.player);
        this.player.body.collideWorldBounds = true;
        this.player.fixedToCamera = false;
        this.player.body.gravity.y = 0.1;
        this.player.anchor.setTo(0.5, 0.5);

        this.createBullets();
    },

    createBullets: function (){
        this.bullets = this.add.group();
        this.bullets.enableBody = true;
        this.bullets.createMultiple(30, 'bullets');
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 2);
        
        this.bulletTime = 0;
    },

    createEnemies: function (){
        this.enemyPool = game.add.group();
        this.enemyPool.enableBody = true;
        this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemyPool.createMultiple(50, 'enemy');
        this.enemyPool.setAll('anchor.x', 0.5);
        this.enemyPool.setAll('anchor.y', 0.5);
        this.enemyPool.setAll('outOfBoundsKill', true);
        this.enemyPool.setAll('checkWorldBounds', true);
        this.enemyPool.setAll('reward', 10, false, false, 0, true);

        this.nextEnemyAt = 0;
        this.enemyDelay = 1000;

        //add particle effects for when enemies are destroyed
        this.emitter = this.add.emitter(0, 0, 100);
        this.emitter.makeParticles('explosion_particle');
        this.emitter.gravity = 0;
        this.emitter.setAlpha(0.3, 0.8);
        this.emitter.setScale(0.5, 1);

    },

    createScoreText: function (){
        this.score = 0;
        this.scoreText = this.add.text(50, 15, '' + this.score, { font: '20px monospace', fill: 'red', align: 'center' });
        this.scoreText.anchor.setTo(0.5, 0.5);

    },

    updatePlayer: function (){
        this.playerMovement();
        this.fireBullet();
    },

    updateEnemies: function (){
        if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
            this.nextEnemyAt = this.time.now + this.enemyDelay;
            var enemy = this.enemyPool.getFirstExists(false);
            // spawn at a random location top of the screen
            enemy.reset(this.rnd.integerInRange(20, 1004), 0);
            // also randomize the speed
            enemy.body.velocity.y = this.rnd.integerInRange(30, 60);
        }
    },

    playerMovement: function (){
        var maxVelocity = 150;
        var acceleration = 10;
        this.playerKeyboardMovement(maxVelocity, acceleration);
        this.playerMouseMovement(maxVelocity);

    },

    playerKeyboardMovement: function (maxVelocity, acceleration){
        
        //horizontal movement
        if ((this.cursors.left.isDown) && (this.player.body.velocity.x > -maxVelocity)) {
            this.player.body.velocity.x -= acceleration;
        }
        else if ((this.cursors.right.isDown) && (this.player.body.velocity.x < maxVelocity)){
            this.player.body.velocity.x += acceleration;
        }
        else {
            //return to 0
            if (this.player.body.velocity.x > 0) {
                this.player.body.velocity.x -= acceleration;
            }
            else if (this.player.body.velocity.x < 0) {
                this.player.body.velocity.x += acceleration;
            }
        }

        //vertical movement
        if ((this.cursors.up.isDown) && (this.player.body.velocity.y > -maxVelocity)){
            this.player.body.velocity.y -= acceleration;
        }
        else if ((this.cursors.down.isDown) && (this.player.body.velocity.y < maxVelocity)) {
                this.player.body.velocity.y += acceleration;
        }
        else {
            if (this.player.body.velocity.y > 0) {
                this.player.body.velocity.y -= acceleration;
            }
            if (this.player.body.velocity.y < 0) {
                this.player.body.velocity.y += acceleration;
            }
        }
    },

    playerMouseMovement: function (maxVelocity){

        if ((this.input.mousePointer.isDown) &&
            (this.physics.arcade.distanceToPointer(this.player) > 15)){
                this.physics.arcade.moveToPointer(this.player, maxVelocity);

        }
    },

    fireBullet: function () {

        //  To avoid them being allowed to fire too fast we set a time limit
        if (this.game.time.now > this.bulletTime)
        {
            //  Grab the first bullet we can from the pool
            this.bullet = this.bullets.getFirstExists(false);

            if (this.bullet)
            {
                //  And fire it
                this.bullet.reset(this.player.x, this.player.y + 8);
                this.bullet.body.velocity.y = -400;
                this.bulletTime = this.time.now + 700;
            }
        }

    },

    enemyHit: function (bullet, enemy){

        // 'splosion!
        this.emitter.x = enemy.x;
        this.emitter.y = enemy.y;
        this.emitter.start(true, 1000, null, 15);

        // add to score
        this.addToScore(enemy.reward);

        bullet.kill();
        enemy.kill();

    },

    addToScore: function (reward){
        this.score += reward;
        this.scoreText.text = this.score;
    }
};


// Start the 'main' state
// this will be moved when we add different states
game.state.add('main', main_state);  
game.state.start('main');  