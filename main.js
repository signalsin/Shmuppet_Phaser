var game = new Phaser.Game(320, 480, Phaser.CANVAS, '');

var player = new Player(game);
var enemies = new Enemies(game);
var cursors;
var inputType;

var main_state = {

    preload: function () {
        this.load.image('imgPlayer', 'assets/player.png');
        this.load.image('bullets', 'assets/bullet.png');
        this.load.image('bgTile', 'assets/Backgrounds/darkPurple.png');
        this.load.image('enemyBasic', 'assets/enemies/enemyBasic.png');
        this.load.image('enemyBasicShooter', 'assets/enemies/enemyBasicShooter.png');
        this.load.image('enemyBullet', 'assets/enemies/laser.png');
        this.load.image('explosion_particle', 'assets/enemies/explosion_particle.png');
    },

    create: function () {
        
        //enable the Arcade Physics system
        this.physics.startSystem(Phaser.Physics.ARCADE);

        //create the background
        this.bgTile = this.add.tileSprite(0, 0, this.stage.bounds.width, this.stage.bounds.height, 'bgTile');
        
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        //determine if input is keyboard or mouse
        //this.inputType = 'keyboard'
        this.inputType = 'mouse'
        
        player.create();
        enemies.create();
        
        this.createScoreText();
    },

    update: function (){
        this.bgTile.tilePosition.y += 1;
        
        enemies.update();
        
        player.checkCollisions(enemies.getEnemyPool('basic'));
        player.checkCollisions(enemies.getEnemyPool('shooter'));
        
        player.update(this.cursors, this.inputType);
    },

    createScoreText: function (){
        this.score = 0;
        this.scoreText = this.add.text(50, 15, '' + this.score, { font: '20px monospace', fill: 'red', align: 'center' });
        this.scoreText.anchor.setTo(0.5, 0.5);

    },
    
    enemyHit: function (bullet, enemy){
        enemies.enemyHit(bullet, enemy);

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