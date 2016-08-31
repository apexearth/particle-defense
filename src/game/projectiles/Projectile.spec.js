var Level = require('../levels/Level');
var Player = require('../Player');
var Projectile = require('../projectiles/Projectile');
var Building = require('../buildings/Building');
var coverage = require('../../../tests/check-coverage');
var expect = require('chai').expect;

module.exports = {
    createProjectile
};

function createProjectile(level) {
    return new Projectile({
        level: level || new Level(),
        player: level ? level.player : new Player(),
        direction: 0,
        velocity: {x: 0, y: 0},
        position: {x: 0, y: 0},
        damage: 0
    });
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

    coverage(this, createProjectile());
});
