var nextBasicEnemyAt = 0;
var BasicEnemyDelay = 1500;

var nextBasicShooterEnemyAt = 0;
var BasicShooterEnemyDelay = 3000;
var BasicShooterShotDelay = 2000;

var nextfastShooterEnemyAt = 0;
var fastShooterEnemyDelay = 4500;
var fastShooterShotDelay = 1500;

var emitter;

function Enemies(game){
    this.game = game;
}

Enemies.prototype.create = function() {

    this.createBasicEnemy();
    this.createBasicShooterEnemy();
    this.createFastShooterEnemy();
    this.createEmitter();
}

Enemies.prototype.update = function() {
    
    this.updateBasicEnemy();
    this.updateBasicShootingEnemy();
    this.updateFastShootingEnemy();
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

Enemies.prototype.createFastShooterEnemy = function(){
    
    this.fastShooterEnemyPool = this.game.add.group();
    this.fastShooterEnemyPool.enableBody = true;
    this.fastShooterEnemyPool.createMultiple(2, 'enemyFastShooter');
    this.fastShooterEnemyPool.setAll('outOfBoundsKill', true);
    this.fastShooterEnemyPool.setAll('checkWorldBounds', true);
    this.fastShooterEnemyPool.setAll('anchor.x', 0.5);
    this.fastShooterEnemyPool.setAll('anchor.y', 0.5);
    this.fastShooterEnemyPool.setAll('reward', 25, false, false, 0, true);
    
    this.fastEnemyBulletPool = this.game.add.group();
    this.fastEnemyBulletPool.enableBody = true;
    this.fastEnemyBulletPool.createMultiple(10, 'enemyBullet');
    this.fastEnemyBulletPool.setAll('anchor.x', 0.5);
    this.fastEnemyBulletPool.setAll('anchor.y', 0.5);
    this.fastEnemyBulletPool.setAll('outOfBoundsKill', true);
    this.fastEnemyBulletPool.setAll('checkWorldBounds', true);

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

Enemies.prototype.updateFastShootingEnemy = function() {
    if (nextfastShooterEnemyAt < this.game.time.now && this.fastShooterEnemyPool.countDead() > 0) {
        nextfastShooterEnemyAt = this.game.time.now + fastShooterEnemyDelay;
        var fastShooterEnemy = this.fastShooterEnemyPool.getFirstExists(false);
        
        //determine if moving left or right
        fastShooterEnemy.direction = this.game.rnd.integerInRange(0,1);
        
        if (fastShooterEnemy.direction == 0){
            //moving from left to right
            fastShooterEnemy.reset(0, 0);
            fastShooterEnemy.body.velocity.y = this.game.rnd.integerInRange(50, 90);
            fastShooterEnemy.body.velocity.x = this.game.rnd.integerInRange(20,40);
            fastShooterEnemy.nextShotAt = 0;
        }
        else {
            fastShooterEnemy.reset(300, 0);
            fastShooterEnemy.body.velocity.y = this.game.rnd.integerInRange(50, 90);
            fastShooterEnemy.body.velocity.x = this.game.rnd.integerInRange(-40, -20);
            fastShooterEnemy.nextShotAt = 0;
        }

    }
    this.fireFastShooterBullet();
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

Enemies.prototype.fireFastShooterBullet = function() {
    
    this.fastShooterEnemyPool.forEachAlive(function (enemy) {
        if (enemy.y < main_state.getPlayer().y) {
            if (this.game.time.now > enemy.nextShotAt && this.fastEnemyBulletPool.countDead() > 0) {  
                var bullet = this.fastEnemyBulletPool.getFirstExists(false);
                bullet.reset(enemy.x, enemy.y);
                bullet.rotation = this.game.physics.arcade.moveToObject(bullet, main_state.getPlayer(), 150);
                enemy.nextShotAt = this.game.time.now + fastShooterShotDelay;
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
        case 'fast':
            return this.fastShooterEnemyPool;
        default:
            return this.basicEnemyPool;
    } 
}

Enemies.prototype.getEnemyBullets = function(type) {
    switch(type) {
        case 'fast':
            return this.fastEnemyBulletPool;
        default:
            return this.enemyBulletPool;
    }
}