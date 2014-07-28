var maxVelocity = 150;
var acceleration = 10;
var cursors;
var lives;
var livesText;
var emitterDeath;
var deadUntil;
var ghostUntil;

function Player(game){
    this.game = game;
    this.sprite = null;
}

Player.prototype.create = function (inputType) {
    this.player = this.game.add.sprite((this.game.world.width / 2), (this.game.world.height * 0.8), 'imgPlayer');
    game.physics.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.body.gravity.y = 0.1;
    this.player.anchor.setTo(0.5, 0.5);
    this.player.body.setSize(20,20);
    
    this.player.animations.add('player', [0]);
    this.player.animations.add('ghostPlayer', [0, 1], 8, true);
    
    lives = 3;
    
    this.createLivesCounter();
    this.createBullets();
    this.createEmitterDeath();
    
    if (this.inputType == 'touch') {
        game.input.addPointer();   
    }
    else if (this.inputType == 'keyboard'){
        cursors = this.game.input.keyboard.createCursorKeys();   
    }
}

Player.prototype.update = function(inputType) {
    
    if (ghostUntil && ghostUntil < this.game.time.now){
        this.player.play('player');
        ghostUntil = null;
        
    }
    else if (this.player.alive) {
        this.playerMovement(inputType);
        if (!ghostUntil){
            this.fireBullet();
        }
    }
}

Player.prototype.playerMovement = function(inputType){
    
    if (inputType == 'keyboard') {
        this.playerKeyboardMovement();
    }
    else if (inputType == 'mouse') {
        this.playerMouseMovement();
    }
    else if (inputType == 'touch') {
        this.playerTouchMovement();   
    }
}

Player.prototype.playerKeyboardMovement = function() {

    //horizontal movement
    if ((cursors.left.isDown) && (this.player.body.velocity.x > -maxVelocity)) {
        this.player.body.velocity.x -= acceleration;
    }
    else if ((cursors.right.isDown) && (this.player.body.velocity.x < maxVelocity)){
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
    if ((cursors.up.isDown) && (this.player.body.velocity.y > -maxVelocity)){
        this.player.body.velocity.y -= acceleration;
    }
    else if ((cursors.down.isDown) && (this.player.body.velocity.y < maxVelocity)) {
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
}

Player.prototype.playerTouchMovement = function() {
    if ((this.game.input.activePointer.isDown) &&
        (this.game.physics.arcade.distanceToPointer(this.player, this.game.input.activePointer) > 20)){
            this.game.physics.arcade.moveToPointer(this.player, maxVelocity);
    }
    else {
        if (this.player.body.velocity.y > 0) {
            this.player.body.velocity.y -= acceleration;
        }
        if (this.player.body.velocity.y < 0) {
            this.player.body.velocity.y += acceleration;
        }
        if (this.player.body.velocity.x > 0) {
            this.player.body.velocity.x -= acceleration;
        }
        else if (this.player.body.velocity.x < 0) {
            this.player.body.velocity.x += acceleration;
        }
    }
}

Player.prototype.createLivesCounter = function() {
    
    this.livesImage = this.game.add.sprite((this.game.world.width * 0.84), (this.game.world.height * 0.012), 'playerLife');   
    livesText = this.game.add.text((this.game.world.width * 0.9), (this.game.world.height * 0.01), 
                                        'x' + lives, { font: '18px monospace', fill: 'white', align: 'center' });
}

Player.prototype.createBullets = function () {
    
    this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.createMultiple(30, 'bullets');
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 2);
    this.bulletTime = 0;
}

Player.prototype.createEmitterDeath = function() {
    emitter = this.game.add.emitter(0, 0, 100);
    emitter.makeParticles('explosion_particle');
    emitter.gravity = 0;
    emitter.setAlpha(0.3, 0.8);
    emitter.setScale(0.5, 1);
    
}

Player.prototype.fireBullet = function() {
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
            this.bulletTime = this.game.time.now + 700;
        }
    }
}

Player.prototype.playerHit = function(player, bullet) {
    
    // check first if ghostUntil is not not undefined or null 
    if (ghostUntil && ghostUntil > this.game.time.now) {
      return;
    }
    
    //determines between bullet and enemy ship
    if(bullet.rotation) {
        bullet.kill();   
    }
    if (lives > 0) {
        lives -= 1;
        livesText.text = 'x' + lives;
        
        emitter.x = player.x;
        emitter.y = player.y;
        emitter.start(true, 200, null, 10);
        ghostUntil = this.time.now + 3000;
        player.play('ghostPlayer');
    }
    else if (lives == 0) {
        emitter.x = player.x;
        emitter.y = player.y;
        emitter.start(true, 1000, null, 40);
        player.kill();
    }
}

Player.prototype.getPlayer = function() {
    return this.player;
}

Player.prototype.getBullets = function() {
    return this.bullets;   
}

Player.prototype.getAlive = function() { 
    if (this.player.alive && this.player.visible && !ghostUntil){
        return true;
    }
    else {
        return false;
    }
}