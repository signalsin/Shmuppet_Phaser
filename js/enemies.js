var nextBasicEnemyAt = 0;
var BasicEnemyDelay = 1500;

var nextBasicShooterEnemyAt = 0;
var BasicShooterEnemyDelay = 3000;
var BasicShooterShotDelay = 2000;

var emitter;

function Enemies(game){
    this.game = game;
}

Enemies.prototype.create = function() {

    this.createBasicEnemy();
    this.createBasicShooterEnemy();
    this.createEmitter();
}

Enemies.prototype.update = function() {
    
    this.updateBasicEnemy();
    this.updateBasicShootingEnemy();
}
    
Enemies.prototype.createBasicEnemy = function() {
    this.basicEnemyPool = this.game.add.group();
    this.basicEnemyPool.enableBody = true;
    this.basicEnemyPool.createMultiple(5000, 'enemyBasic');
    this.basicEnemyPool.setAll('outOfBoundsKill', true);
    this.basicEnemyPool.setAll('checkWorldBounds', true);
    this.basicEnemyPool.setAll('anchor.x', 0.5);
    this.basicEnemyPool.setAll('anchor.y', 0.5);
    this.basicEnemyPool.setAll('reward', 10, false, false, 0, true);
}

Enemies.prototype.createBasicShooterEnemy = function() {
    this.basicShooterEnemyPool = this.game.add.group();
    this.basicShooterEnemyPool.enableBody = true;
    this.basicShooterEnemyPool.createMultiple(3, 'enemyBasicShooter');
    this.basicShooterEnemyPool.setAll('outOfBoundsKill', true);
    this.basicShooterEnemyPool.setAll('checkWorldBounds', true);
    this.basicShooterEnemyPool.setAll('anchor.x', 0.5);
    this.basicShooterEnemyPool.setAll('anchor.y', 0.5);
    this.basicShooterEnemyPool.setAll('reward', 15, false, false, 0, true);
    
    this.enemyBulletPool = this.game.add.group();
    this.enemyBulletPool.enableBody = true;
    this.enemyBulletPool.createMultiple(10, 'enemyBullet');
    this.enemyBulletPool.setAll('anchor.x', 0.5);
    this.enemyBulletPool.setAll('anchor.y', 0.5);
    this.enemyBulletPool.setAll('outOfBoundsKill', true);
    this.enemyBulletPool.setAll('checkWorldBounds', true);

}

Enemies.prototype.createEmitter = function() {
    //add particle effects for when enemies are destroyed
    emitter = this.game.add.emitter(0, 0, 200);
    emitter.makeParticles('explosion_particle');
    emitter.gravity = 0;
    emitter.setAlpha(0.3, 0.8);
    emitter.setScale(0.5, 1);
}

Enemies.prototype.updateBasicEnemy = function() {
    
    if (nextBasicEnemyAt < this.game.time.now && this.basicEnemyPool.countDead() > 0) {
        nextBasicEnemyAt = this.game.time.now + BasicEnemyDelay;
        var basicEnemy = this.basicEnemyPool.getFirstExists(false);
        // spawn at a random location top of the screen
        basicEnemy.reset(this.game.rnd.integerInRange(20, 300), 0);
        // also randomize the speed
        basicEnemy.body.velocity.y = this.game.rnd.integerInRange(30, 60);
    }
}

Enemies.prototype.updateBasicShootingEnemy = function() {
     if (nextBasicShooterEnemyAt < this.game.time.now && this.basicShooterEnemyPool.countDead() > 0) {
        nextBasicShooterEnemyAt = this.game.time.now + BasicShooterEnemyDelay;
        var basicShooterEnemy = this.basicShooterEnemyPool.getFirstExists(false);
        basicShooterEnemy.reset(this.game.rnd.integerInRange(20, 300), 0);
        basicShooterEnemy.body.velocity.y = this.game.rnd.integerInRange(30, 60);
        basicShooterEnemy.nextShotAt = 0;
    }
    this.fireBasicShooterBullet();
}

Enemies.prototype.fireBasicShooterBullet = function() {
    
    this.basicShooterEnemyPool.forEachAlive(function (enemy) {
        // only shoot if enemy is above player
        if (enemy.y < main_state.getPlayer().y) {
            if (this.game.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0) {  
                var bullet = this.enemyBulletPool.getFirstExists(false);
                bullet.reset(enemy.x, enemy.y);
                bullet.rotation = this.game.physics.arcade.moveToObject(bullet, main_state.getPlayer(), 150);
                enemy.nextShotAt = this.game.time.now + BasicShooterShotDelay;
            }
        }
    }, this);
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
            return this.basicShooterEnemyPool;
        default:
            return this.basicEnemyPool;
    } 
}

Enemies.prototype.getEnemyBullets = function() {
    return this.enemyBulletPool;
}