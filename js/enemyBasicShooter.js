function EnemyBasicShooter(game){
    this.game = game;
}

EnemyBasicShooter.prototype.create = function() {
    
    this.enemyPool = this.game.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.createMultiple(3, 'enemyBasicShooter');
    this.enemyPool.setAll('outOfBoundsKill', true);
    this.enemyPool.setAll('checkWorldBounds', true);
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);
    this.enemyPool.setAll('reward', 15, false, false, 0, true);
    
    this.bulletPool = this.game.add.group();
    this.bulletPool.enableBody = true;
    this.bulletPool.createMultiple(10, 'enemyBullet');
    this.bulletPool.setAll('anchor.x', 0.5);
    this.bulletPool.setAll('anchor.y', 0.5);
    this.bulletPool.setAll('outOfBoundsKill', true);
    this.bulletPool.setAll('checkWorldBounds', true);
    
    this.nextEnemyAt = 0;
    this.enemyDelay = 3000;
    this.shotDelay = 2000;
    
}

EnemyBasicShooter.prototype.update = function() {
    if (this.nextEnemyAt < this.game.time.now && this.enemyPool.countDead() > 0) {
        this.nextEnemyAt = this.game.time.now + this.enemyDelay;
        var enemy = this.enemyPool.getFirstExists(false);
        enemy.reset(this.game.rnd.integerInRange(20, 300), 0);
        enemy.body.velocity.y = this.game.rnd.integerInRange(30, 60);
        enemy.nextShotAt = 0;
    }
    this.fireBullet();
}

EnemyBasicShooter.prototype.fireBullet = function() {
    
    this.enemyPool.forEachAlive(function (enemy) {
    // only shoot if enemy is above player
    if (enemy.y < main_state.getPlayer().y) {
        if (this.game.time.now > enemy.nextShotAt && this.bulletPool.countDead() > 0) {  
                var bullet = this.bulletPool.getFirstExists(false);
                bullet.reset(enemy.x, enemy.y);
                bullet.rotation = this.game.physics.arcade.moveToObject(bullet, main_state.getPlayer(), 150);
                enemy.nextShotAt = this.game.time.now + this.shotDelay;
            }
        }
    }, this);   
}

EnemyBasicShooter.prototype.getEnemyPool = function() {
    return this.enemyPool;   
}

EnemyBasicShooter.prototype.getBulletPool = function() {
    return this.bulletPool;
}