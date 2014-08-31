describe('Unit Tests', function () {
    var Levels, Unit, General;
    beforeEach(function () {
        runs(function () {
            require(["game/Levels", "game/Unit", "util/General"], function (levels, unit, general) {
                Levels = levels;
                Unit = unit;
                General = general;
            });
        });
        waitsFor(function () {
            return Levels;
        }, 300);
        waitsFor(function () {
            return Unit;
        }, 300);
        waitsFor(function () {
            return General;
        }, 300);
    });
    it('should move towards the target move location', function () {
        var level = Levels.LevelTest();
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
        var level = Levels.LevelTest();
        var unit = new Unit(level);
        unit.setDestination(level.Player.HomeBase);
        level.Units.push(unit);

        var initialHealth = unit.Health;
        unit.damage(1);
        expect(initialHealth).toBeGreaterThan(unit.Health);
    });
    it('should die when it runs out of health, and be removed from the level', function () {
        var level = Levels.LevelTest();
        var unit = new Unit(level);
        unit.setDestination(level.Player.HomeBase);
        level.Units.push(unit);
        unit.damage(unit.Health);
        level.update();
        expect(level.Units.indexOf(unit)).toBe(-1);
    });
    it('should die when it runs out of health, and be removed from the level', function () {
        var level = Levels.LevelTest();
        var unit = new Unit(level);
        unit.setDestination(level.Player.HomeBase);
        level.Units.push(unit);
        level.Buildings = [];
        level.Player.Buildings = [];
        expect(level.Player.Score).toBe(0);
        unit.damage(unit.Health);
        expect(level.Player.Score).toBeGreaterThan(0);
    });
    it('should have a helper function to deliver an array of units', function () {
        var units = Unit.Array(function () {
            return new Unit(Levels.LevelTest(), {X: 10, Y: 10});
        }, 10);
        expect(units.length).toBe(10);
        expect(units[0].constructor).toBe(Unit);
    });
    it('should have no velocity when it is not moving', function () {
        var level = Levels.LevelTest();
        level.Buildings = [];
        level.Player.Buildings = [];
        var unit = new Unit(level);
        unit.VelocityX = 10;
        unit.VelocityY = 10;
        unit.update();

        expect(unit.VelocityX).toBe(0);
        expect(unit.VelocityY).toBe(0);
    });
});
