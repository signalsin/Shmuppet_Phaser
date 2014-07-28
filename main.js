var game = new Phaser.Game(320, 480, Phaser.AUTO, '');

var player = new Player(game);
var enemies = new Enemies(game);
var inputType;

var main_state = {

    preload: function () {
        this.load.spritesheet('imgPlayer', 'assets/playerGhost.png', 38, 29);
        this.load.image('playerLife', 'assets/playerLife.png');
        this.load.image('bullets', 'assets/playerBullet.png');
        this.load.image('bgTile', 'assets/bgDarkPurple.png');
        this.load.image('enemyBasic', 'assets/enemyBasic.png');
        this.load.image('enemyBasicShooter', 'assets/enemyBasicShooter.png');
        this.load.image('enemyFastShooter', 'assets/enemyFastShooter.png');
        this.load.image('enemyBullet', 'assets/laser.png');
        this.load.image('explosion_particle', 'assets/explosion_particle.png');  
    },

    create: function () {
        
        //enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //create the background
        this.bgTile = this.add.tileSprite(0, 0, this.stage.bounds.width, this.stage.bounds.height, 'bgTile');
        
        //select input type
        //this.inputType = 'keyboard';
        this.inputType = 'touch';
        
        //automatically choose touch if touchscreen is present
        if (this.game.device.touch == true) {
         this.inputType = 'touch';
        }
        
        player.create(this.inputType);
        enemies.create();
        
        this.createScoreText();
    },

    update: function (){
        this.bgTile.tilePosition.y += 1;
        player.update(this.inputType);
        enemies.update();

        if (player.getAlive()){
            this.checkCollisions();
        }
    },
    
    checkCollisions: function(){
        //player bullets and enemies
        this.physics.arcade.overlap(player.getBullets(), enemies.getEnemyPool('basic'), enemies.enemyHit, null, this);
        this.physics.arcade.overlap(player.getBullets(), enemies.getEnemyPool('shooter'), enemies.enemyHit, null, this);
        this.physics.arcade.overlap(player.getBullets(), enemies.getEnemyPool('fast'), enemies.enemyHit, null, this);
        
        //player and enemies
        this.physics.arcade.overlap(player.getPlayer(), enemies.getEnemyPool('basic'), player.playerHit, null, this);
        this.physics.arcade.overlap(player.getPlayer(), enemies.getEnemyPool('shooter'), player.playerHit, null, this);
        this.physics.arcade.overlap(player.getPlayer(), enemies.getEnemyPool('fast'), player.playerHit, null, this);
        
        //player and bullets
        this.physics.arcade.overlap(player.getPlayer(), enemies.getEnemyBullets('shooter'), player.playerHit, null, this);
        this.physics.arcade.overlap(player.getPlayer(), enemies.getEnemyBullets('fast'), player.playerHit, null, this);
    },

    createScoreText: function (){
        this.score = 0;
        this.scoreText = this.add.text(50, 15, '' + this.score, { font: '20px monospace', fill: 'white', align: 'center' });
        this.scoreText.anchor.setTo(0.5, 0.5);

    },
        
    addToScore: function (reward){
        this.score += reward;
        this.scoreText.text = this.score;
    },
    
    getPlayer: function(){
        return player.getPlayer();
    },

};


// Start the 'main' state
// this will be moved when we add different states
game.state.add('main', main_state);  
game.state.start('main');  