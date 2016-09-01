var Level = require('../levels/Level');
var Player = require('../Player');
var Projectile = require('../projectiles/Projectile');
var UnitSpec = require('../units/Unit.spec');
var coverage = require('../../../tests/check-coverage');
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
            'initialVelocity',
            'level',
            'lifespan',
            'onHit',
            'player',
            'radius',
            'unitHitCheck',
            'update',
            'velocity',
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
        expect(level.projectiles).to.include(projectile);
        projectile.die();
        expect(level.projectiles).to.not.include(projectile);
    });
    it('.onHit()', function () {
        var projectile = createProjectile();
        var level = projectile.level;
        expect(level.projectiles).to.include(projectile);
        projectile.onHit();
        expect(level.projectiles).to.not.include(projectile);
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
        expect(projectile.level.projectiles).to.not.include(projectile);
        expect(unit.health).to.equal(initialHealth - projectile.damage);
    });
    describe('.update()', function () {
        it('death from lifespan ', function () {
            var projectile = createProjectile();
            projectile.lifespan = -1;
            projectile.update();
            expect(projectile.dead).to.equal(true);
            expect(projectile.level.projectiles).to.not.include(projectile);
        });
        it('death outside level', function () {
            var projectile = createProjectile();
            projectile.position.x = projectile.level.position.x - 100;
            projectile.update();
            expect(projectile.dead).to.equal(true);
            expect(projectile.level.projectiles).to.not.include(projectile);
        });
        it('.unitHitCheck() is called', function () {
            var projectile = createProjectile();
            var unit = UnitSpec.addUnit(projectile.level);
            unit.position.x = projectile.position.x;
            unit.position.y = projectile.position.y;
            var initialHealth = unit.health;
            projectile.update();
            expect(projectile.level.projectiles).to.not.include(projectile);
            expect(unit.health).to.equal(initialHealth - projectile.damage);
        });
    });

    coverage(this, createProjectile());
});