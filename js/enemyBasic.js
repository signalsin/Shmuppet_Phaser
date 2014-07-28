function EnemyBasic(game){
    this.game = game;
}

EnemyBasic.prototype.create = function() {
    this.enemyPool = this.game.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.createMultiple(10, 'enemyBasic');
    this.enemyPool.setAll('outOfBoundsKill', true);
    this.enemyPool.setAll('checkWorldBounds', true);
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);
    this.enemyPool.setAll('reward', 10, false, false, 0, true);
    
    this.nextEnemyAt = 0;
    this.enemyDelay = 1500;
    
}

EnemyBasic.prototype.update = function() {
    if (this.nextEnemyAt < this.game.time.now && this.enemyPool.countDead() > 0) {
        this.nextEnemyAt = this.game.time.now + this.enemyDelay;
        var enemy = this.enemyPool.getFirstExists(false);
        // spawn at a random location top of the screen
        enemy.reset(this.game.rnd.integerInRange(20, 300), 0);
        // also randomize the speed
        enemy.body.velocity.y = this.game.rnd.integerInRange(30, 60);
    }
    
}

EnemyBasic.prototype.getEnemyPool = function() {
    return this.enemyPool;   
}