var game = new Phaser.Game(320, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update});

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

function preload() {
    game.load.image('imgPlayer', 'assets/player.png');
    game.load.image('bullets', 'assets/bullet.png');
    game.load.image('bgTile', 'assets/Backgrounds/darkPurple.png');
    game.load.image('enemy', 'assets/enemies/enemyBlack2.png');
}

function create() {
    
    //enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //enable keyboard cursors
    cursors = game.input.keyboard.createCursorKeys();
    
    //create the background
    bgTile = game.add.tileSprite(0, 0, game.stage.bounds.width, game.stage.bounds.height, 'bgTile');
    
    createPlayer();
    createEnemies();
    
}

function update(){
    bgTile.tilePosition.y += speed;
    
    game.physics.arcade.overlap(bullets, enemyPool, enemyHit, null, this );

    
    updatePlayer();
    updateEnemies();

}

function createPlayer(){
    player = game.add.sprite((game.world.width / 2), (game.world.height * 0.8), 'imgPlayer');
    game.physics.enable(player);
    player.body.collideWorldBounds = true;
    player.fixedToCamera = false;
    player.body.gravity.y = 0.1;
    player.anchor.setTo(0.5, 0.5);
    
    createBullets();
}

function createBullets(){
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.createMultiple(30, 'bullets');
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 2);
}

function createEnemies(){
    enemyPool = game.add.group();
    enemyPool.enableBody = true;
    enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
    enemyPool.createMultiple(50, 'enemy');
    enemyPool.setAll('anchor.x', 0.5);
    enemyPool.setAll('anchor.y', 0.5);
    enemyPool.setAll('outOfBoundsKill', true);
    enemyPool.setAll('checkWorldBounds', true);
    
    nextEnemyAt = 0;
    enemyDelay = 1000;
}

function updatePlayer(){
    playerMovement();
    fireBullet();
}

function updateEnemies(){
    if (nextEnemyAt < game.time.now && enemyPool.countDead() > 0) {
        nextEnemyAt = game.time.now + enemyDelay;
        enemy = enemyPool.getFirstExists(false);
        // spawn at a random location top of the screen
        enemy.reset(game.rnd.integerInRange(20, 1004), 0);
        // also randomize the speed
        enemy.body.velocity.y = game.rnd.integerInRange(30, 60);
    }

}

function playerMovement(){
        
   playerKeyboardMovement();
   playerMouseMovement();
    
}

function playerKeyboardMovement(){
    //horizontal movement
    if ((cursors.left.isDown) && (player.body.velocity.x > -maxVelocity)) {
        player.body.velocity.x -= acceleration;
    }
    else if ((cursors.right.isDown) && (player.body.velocity.x < maxVelocity)){
        player.body.velocity.x += acceleration;
    }
    else {
        //return to 0
        if (player.body.velocity.x > 0) {
            player.body.velocity.x -= acceleration;
        }
        else if (player.body.velocity.x < 0) {
            player.body.velocity.x += acceleration;
        }
    }
    
    //vertical movement
    if ((cursors.up.isDown) && (player.body.velocity.y > -maxVelocity)){
        player.body.velocity.y -= acceleration;
    }
    else if ((cursors.down.isDown) && (player.body.velocity.y < maxVelocity)) {
            player.body.velocity.y += acceleration;
    }
    else {
        if (player.body.velocity.y > 0) {
            player.body.velocity.y -= acceleration;
        }
        if (player.body.velocity.y < 0) {
            player.body.velocity.y += acceleration;
        }
    }
}

function playerMouseMovement(){
    
    if ((game.input.mousePointer.isDown) &&
        (game.physics.arcade.distanceToPointer(player) > 15)){
            game.physics.arcade.moveToPointer(player, maxVelocity);
        
    }
}

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);
        
        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 700;
        }
    }

}

function enemyHit(bullet, enemy){
    bullet.kill();
    enemy.kill();
}

