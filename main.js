var game = new Phaser.Game(320, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update});

var player;
var maxVelocity;
var cursors;

var map;
var layer;

function preload() {
    game.load.image('imgPlayer', 'assets/star.png');
    game.load.tilemap('worldMap', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('sprites', 'assets/sprites.png');

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
    
    createPlayer();
}

function update(){
    
    updatePlayer();

}

function createPlayer(){
    player = game.add.sprite((game.world.width / 2), game.world.height, 'imgPlayer');
    game.physics.enable(player);
    player.body.collideWorldBounds = true;
    maxVelocity = 150;
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
        player.body.velocity.x -= 10;
    }
    else if ((cursors.right.isDown) && (player.body.velocity.x < maxVelocity)){
        player.body.velocity.x += 10;
    }
    else {
        //return to 0
        if (player.body.velocity.x > 0) {
            player.body.velocity.x -= 10;
        }
        else if (player.body.velocity.x < 0) {
            player.body.velocity.x += 10;
        }
    }
    
    //vertical movement
    if ((cursors.up.isDown) && (player.body.velocity.y > -maxVelocity)){
        player.body.velocity.y -= 10;
    }
    else if ((cursors.down.isDown) && (player.body.velocity.y < maxVelocity)) {
            player.body.velocity.y += 10;
    }
    else {
        if (player.body.velocity.y > 0) {
            player.body.velocity.y -= 10;
        }
        if (player.body.velocity.y < 0) {
            player.body.velocity.y += 10;
        }
    }
    
}

function playerMouseMovement(){
    if (game.input.mousePointer.isDown)  {
        game.physics.arcade.moveToPointer(player, 150);
    }
}

