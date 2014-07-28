var basicEnemy;
var basicShooterEnemy;
var fastShooterEnemy;

var emitter;

function Enemies(game){
    this.game = game;
}

Enemies.prototype.create = function() {
    
    basicEnemy = new EnemyBasic(this.game);
    basicEnemy.create();
    
    basicShooterEnemy = new EnemyBasicShooter(this.game);
    basicShooterEnemy.create();
    
    fastShooterEnemy = new EnemyFastShooter(this.game);
    fastShooterEnemy.create();
    
    this.createEmitter();
}

Enemies.prototype.update = function() {
    
    basicEnemy.update();
    basicShooterEnemy.update();
    fastShooterEnemy.update();
}

Enemies.prototype.createEmitter = function() {
    //add particle effects for when enemies are destroyed
    emitter = this.game.add.emitter(0, 0, 200);
    emitter.makeParticles('explosion_particle');
    emitter.gravity = 0;
    emitter.setAlpha(0.3, 0.8);
    emitter.setScale(0.5, 1);
}

Enemies.prototype.enemyHit = function(bullet, enemy) {
    
    // 'splosion!
    emitter.x = enemy.x;
    emitter.y = enemy.y;
    emitter.start(true, 600, null, 15);

    // add to score
    main_state.addToScore(enemy.reward);

    bullet.kill();
    enemy.kill();
    
}

Enemies.prototype.getEnemyPool = function(type) {
 
    switch(type) {
        case 'shooter':
            return basicShooterEnemy.getEnemyPool();
        case 'fast':
            return fastShooterEnemy.getEnemyPool();
        default:
            return basicEnemy.getEnemyPool();
    } 
}

Enemies.prototype.getEnemyBullets = function(type) {
    switch(type) {
        case 'fast':
            return fastShooterEnemy.getBulletPool();
        default:
            return basicShooterEnemy.getBulletPool();
    }
}