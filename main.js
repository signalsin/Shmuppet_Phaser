var game = new Phaser.Game(320, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update});

var player;
var maxVelocity = 150;
var acceleration = 10;
var cursors;
var speed = -1;

var map;
var layer;


function preload() {
    game.load.image('imgPlayer', 'assets/star.png');
    game.load.tilemap('worldMap', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('sprites', 'assets/sprites.png');
    game.load.image('vertBounds', 'assets/vertBounds.png');

}

function create() {
    
    //enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //enable keyboard cursors
    cursors = game.input.keyboard.createCursorKeys();
    
    //create the tilemap
    map = game.add.tilemap('worldMap');
    map.addTilesetImage('sprites', 'sprites');
    layer = map.createLayer('world');
    
    layer.resizeWorld();
    
    createPlayer();
    
    game.camera.y = game.world.height;
    
    //set the vertical boundaries
    topBounds = game.add.sprite(0, -4, 'vertBounds');
    topBounds.fixedToCamera = true;
    game.physics.enable(topBounds);
    topBounds.body.immovable = true;
    
    bottomBounds = game.add.sprite(0, 480, 'vertBounds');
    bottomBounds.fixedToCamera = true;
    game.physics.enable(bottomBounds);
    bottomBounds.body.immovable = true;
    
}

function update(){
    game.physics.arcade.collide(player, bottomBounds);
    game.physics.arcade.collide(player, topBounds);

    updatePlayer();
    
    game.camera.y += speed;
    
}

function createPlayer(){
    player = game.add.sprite((game.world.width / 2), (game.world.height * 0.8), 'imgPlayer');
    game.physics.enable(player);
    player.body.collideWorldBounds = true;
    player.fixedToCamera = false;
    player.body.gravity.y = 0.1;
    
}

function updatePlayer(){
    playerMovement();
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
    if (game.input.mousePointer.isDown)  {
        game.physics.arcade.moveToPointer(player, maxVelocity);
    }
}

