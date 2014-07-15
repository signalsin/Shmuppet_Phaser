var nextEnemyAt = 0;
var enemyDelay = 1000;
var emitter;

function Enemies(game){
    this.game = game;
}

Enemies.prototype.create = function() {
    this.enemyPool = this.game.add.group();
    this.enemyPool.enableBody = true;
    this.enemyPool.createMultiple(50, 'enemy');
    this.enemyPool.setAll('outOfBoundsKill', true);
    this.enemyPool.setAll('checkWorldBounds', true);
    this.enemyPool.setAll('anchor.x', 0.5);
    this.enemyPool.setAll('anchor.y', 0.5);
    this.enemyPool.setAll('reward', 10, false, false, 0, true);
    
    //add particle effects for when enemies are destroyed
    emitter = this.game.add.emitter(0, 0, 100);
    emitter.makeParticles('explosion_particle');
    emitter.gravity = 0;
    emitter.setAlpha(0.3, 0.8);
    emitter.setScale(0.5, 1);
}

Enemies.prototype.update = function() {
    
    if (nextEnemyAt < this.game.time.now && this.enemyPool.countDead() > 0) {
        nextEnemyAt = this.game.time.now + enemyDelay;
        var enemy = this.enemyPool.getFirstExists(false);
        // spawn at a random location top of the screen
        enemy.reset(this.game.rnd.integerInRange(20, 300), 0);
        // also randomize the speed
        enemy.body.velocity.y = this.game.rnd.integerInRange(30, 60);
    }
}
    
Enemies.prototype.enemyHit = function(bullet, enemy) {
    
    // 'splosion!
    emitter.x = enemy.x;
    emitter.y = enemy.y;
    emitter.start(true, 1000, null, 15);

    // add to score
    main_state.addToScore(enemy.reward);

    bullet.kill();
    enemy.kill();
    
}

Enemies.prototype.getEnemyPool = function() {
 return this.enemyPool;   
}