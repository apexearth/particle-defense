var Level = require('../levels/Level');
var Player = require('../player');
var Projectile = require('../projectiles/Projectile');
var UnitSpec = require('../units/Unit.spec');
var coverage = require('../../../test/check-coverage');
var expect = require('chai').expect;

module.exports = {
    createProjectile
};

function createProjectile(level) {
    level = level || new Level();
    if (!level.player) level.addPlayer(new Player());
    var projectile = level.addProjectile(new Projectile({
        level: level,
        player: level.player,
        direction: 0,
        velocity: {x: 0, y: 0},
        position: {x: 0, y: 0},
        damage: 1
    }));
    expect(projectile.level.projectiles).to.include(projectile);
    return projectile;
}

describe('Projectile', function () {
    it('new', function () {
        var projectile = createProjectile();
        expect(projectile).to.have.keys([
            'container',
            'damage',
            'dead',
            'die',
            'direction',
            'effectiveDamage',
            'hitTest',
            'level',
            'lifespan',
            'lifespanCount',
            'onHit',
            'player',
            'radius',
            'unitHitCheck',
            'update',
            'width'
        ]);
    });
    it('.effectiveDamage()', function () {
        var projectile = createProjectile();
        expect(projectile.effectiveDamage({})).to.equal(1);
        expect(projectile.effectiveDamage.bind(this)).to.throw();
    });
    it('.die()', function () {
        var projectile = createProjectile();
        var level = projectile.level;
        expect(level.projectiles.indexOf(projectile) >= 0).to.equal(true);
        projectile.die();
        expect(level.projectiles.indexOf(projectile) >= 0).to.equal(false);
    });
    it('.onHit()', function () {
        var projectile = createProjectile();
        var level = projectile.level;
        expect(level.projectiles.indexOf(projectile) >= 0).to.equal(true);
        projectile.onHit();
        expect(level.projectiles.indexOf(projectile) >= 0).to.equal(false);
    });
    it('.hitTest()', function () {
        var projectile = createProjectile();
        var unit = UnitSpec.addUnit(projectile.level);
        unit.position.x = projectile.position.x;
        unit.position.y = projectile.position.y;
        expect(projectile.hitTest(unit)).to.equal(true);
    });
    it('.unitHitCheck()', function () {
        var projectile = createProjectile();
        var unit = UnitSpec.addUnit(projectile.level);
        unit.position.x = projectile.position.x;
        unit.position.y = projectile.position.y;
        var initialHealth = unit.health;
        projectile.unitHitCheck(unit);
        expect(projectile.level.projectiles.indexOf(projectile) >= 0).to.equal(false);
        expect(unit.health).to.equal(initialHealth - projectile.damage);
    });
    describe('.update()', function () {
        it('death from lifespan ', function () {
            var projectile = createProjectile();
            projectile.lifespan = -1;
            projectile.update(1);
            expect(projectile.dead).to.equal(true);
            expect(projectile.level.projectiles.indexOf(projectile) >= 0).to.equal(false);
        });
        it('death outside level', function () {
            var projectile = createProjectile();
            projectile.position.x = projectile.level.position.x - 100;
            projectile.update(1);
            expect(projectile.dead).to.equal(true);
            expect(projectile.level.projectiles.indexOf(projectile) >= 0).to.equal(false);
        });
        it('.unitHitCheck() is called', function () {
            var projectile = createProjectile();
            var unit = UnitSpec.addUnit(projectile.level);
            unit.position.x = projectile.position.x;
            unit.position.y = projectile.position.y;
            var initialHealth = unit.health;
            projectile.update(1);
            expect(projectile.level.projectiles.indexOf(projectile) >= 0).to.equal(false);
            expect(unit.health).to.equal(initialHealth - projectile.damage);
        });
    });
    describe('other', function () {
        var Unit = require('../units/Unit');
        var Levels = require('../levels');
        var Projectiles = require('../projectiles');
        var math = require('../../util/math');
        it('should move', function () {
            var level = Levels.list.Test();
            var projectile = new Projectiles.Bullet({
                level: level,
                player: level.players[0],

                damage: 1,
                velocity: 10,
                position: {x: 100, y: 100},
                direction: math.angle(0, 0, 50, 50)
            });

            level.addProjectile(projectile);
            level.update(1);
            expect(projectile.position.x).to.be.above(100);
            expect(projectile.position.y).to.be.above(100);
        });
        it('should die on impact, by default', function () {
            var level = Levels.list.Test();
            var unit = new Unit({
                level: level,
                player: level.players[0],
                position: {
                    x: 100,
                    y: 100
                }
            });
            level.addUnit(unit);

            var projectile = new Projectiles.Bullet({
                level: level,
                player: level.players[0],
                direction: math.angle(110, 100, unit.position.x, unit.position.y),
                position: {
                    x: 110,
                    y: 100
                },
                damage: 1,
                velocity: 10
            });
            level.addProjectile(projectile);

            level.update(1);
            expect(level.projectiles.length).to.equal(0);
        });
        it('should die when outside of level', function () {
            var level = new Level();
            var player = new Player();
            level.addPlayer(player);
            var projectile = new Projectiles.Bullet({
                level: level,
                player: player,
                direction: Math.PI,
                position: {x: 1, y: 1},
                damage: 1,
                velocity: 3
            });
            level.addProjectile(projectile);

            expect(level.projectiles.length).to.equal(1);
            level.update(1);
            expect(level.projectiles.length).to.equal(0);
        });
    });
    coverage(this, createProjectile());
});
