var maxVelocity = 150;
var acceleration = 10;

function Player(game){
    this.game = game;
    this.sprite = null;
}

Player.prototype.create = function () {
    this.player = this.game.add.sprite((this.game.world.width / 2), (this.game.world.height * 0.8), 'imgPlayer');
    game.physics.enable(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.fixedToCamera = false;
    this.player.body.gravity.y = 0.1;
    this.player.anchor.setTo(0.5, 0.5);
    
    this.createBullets();
}

Player.prototype.update = function(cursors, inputType) {
    this.playerMovement(cursors, inputType);
    this.fireBullet();
}

Player.prototype.checkCollisions = function(enemies) {
    this.game.physics.arcade.overlap(this.bullets, enemies, main_state.enemyHit, null, this);
}

Player.prototype.playerMovement = function(cursors, inputType){
    
    if (inputType == 'keyboard') {
        this.playerKeyboardMovement(cursors);
    }
    else if (inputType == 'mouse') {
        this.playerMouseMovement();
    }
}

Player.prototype.playerKeyboardMovement = function(cursors) {

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

Player.prototype.playerMouseMovement = function() {
    if ((this.game.input.mousePointer.isDown) &&
        (this.game.physics.arcade.distanceToPointer(this.player) > 15)){
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

Player.prototype.getPlayer = function() {
    return this.player;
}