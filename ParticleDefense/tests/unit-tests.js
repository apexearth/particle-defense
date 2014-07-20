/// <reference path="~/js/jasmine.js" />
/// <reference path="~/Game/LevelBuilder.js"/>
/// <reference path="~/Game/Unit.js"/>
/// <reference path="~/Game/Level.js"/>
/// <reference path="~/Game/Map.js"/>
/// <reference path="~/util/Keyboard.js"/>
describe('Unit Tests', function () {
    it('should move towards the target move location', function () {
        var level = LevelBuilder.Create();
        var unit = new Unit(level);
        unit.setDestination(level.Player.HomeBase);
        level.Units.push(unit);

        var i = 5;
        while (i--) {
            var initialDistance = General.Distance(unit.X - unit.Destination.X, unit.Y - unit.Destination.Y);
            level.update();
            //jasmine.log(unit.Path[0].X + "," + unit.Path[0].Y + "\r\n");
            var distanceAfterUpdate = General.Distance(unit.X - unit.Destination.X, unit.Y - unit.Destination.Y);
            expect(initialDistance).toBeGreaterThan(distanceAfterUpdate);
        }
    });
    it('should be able to take damage', function () {
        var level = LevelBuilder.Create();
        var unit = new Unit(level);
        unit.setDestination(level.Player.HomeBase);
        level.Units.push(unit);

        var initialHealth = unit.Health;
        unit.damage(1);
        expect(initialHealth).toBeGreaterThan(unit.Health);
    });
    it('should die when it runs out of health, and be removed from the level', function () {
        var level = LevelBuilder.Create();
        var unit = new Unit(level);
        unit.setDestination(level.Player.HomeBase);
        level.Units.push(unit);
        unit.damage(unit.Health);
        level.update();
        expect(level.Units.indexOf(unit)).toBe(-1);
    });
});
