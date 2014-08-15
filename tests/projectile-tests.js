require(["src/game/Levels", "src/game/Projectiles"], function (Levels, Projectiles) {
    describe('Projectile Tests', function () {
        it('should move', function () {
            var level = Levels.LevelTest();
            var projectile = new Projectiles.Bullet(level,
                0,
                0,
                General.AngleRad(0, 0, 50, 50),
                5,
                0);
            level.Projectiles.push(projectile);
            level.update();
            expect(projectile.X).toBeGreaterThan(0);
            expect(projectile.Y).toBeGreaterThan(0);
        });

        it('should die on impact, by default', function () {
            var level = Levels.LevelTest();
            var unit = new Unit(level, level.Player.HomeBase.X - 50, level.Player.HomeBase.Y);
            level.Units.push(unit);

            var projectile = new Projectiles.Bullet(level,
                    unit.X + 20,
                unit.Y,
                General.AngleRad(unit.X + 20, unit.Y, unit.X, unit.Y),
                1,
                0);
            level.Projectiles.push(projectile);

            var i = 30;
            while (i--) level.update();
            expect(level.Projectiles.length).toBe(0);
        });

        it('should die when outside of level', function () {
            var level = Levels.LevelEmpty();
            var projectile = new Projectiles.Bullet(level,
                25,
                25,
                180,
                5,
                0);
            level.Projectiles.push(projectile);

            expect(level.Projectiles.length).toBe(1);
            level.update();
            expect(level.Projectiles.length).toBe(1);

            var i = 20;
            while (i--) level.update();
            expect(level.Projectiles.length).toBe(0);
        });
    });
});
