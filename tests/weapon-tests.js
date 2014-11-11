describe('Weapon Tests', function () {
    var Weapons, Buildings, Player;
    beforeEach(function () {
        runs(function () {
            require(["game/Weapons", "game/buildings!", "game/Player"], function (weapons, buildings, player) {
                Weapons = weapons;
                Buildings = buildings;
                Player = player;
            });
        });
        waitsFor(function () {
            return Weapons != null
                && Buildings != null
                && Player != null;
        }, 300);
    });

    function TestUpgrade(upgrade){
        var player = new Player(null);
        var building = new Buildings.TinyGun(null, player);
        var weapon = building.Weapons[0];
        expect(weapon.Upgrades).toBeDefined();

        var beforeValue = weapon[upgrade];

        expect(weapon.Upgrades[upgrade]).toBeDefined();
        expect(weapon.Upgrades[upgrade].Cost).toBeDefined();

        // Verify Failure when we have no resource
        expect(weapon.Upgrades[upgrade].CanUpgrade()).toBe(false);
        weapon.Upgrades[upgrade]();
        expect(weapon[upgrade]).toBe(beforeValue);

        // Works with resource
        player.Resources.Energy = weapon.Upgrades[upgrade].Cost.Energy();
        player.Resources.Metal = weapon.Upgrades[upgrade].Cost.Metal();
        expect(weapon.Upgrades[upgrade].CanUpgrade()).toBe(true);
        weapon.Upgrades[upgrade]();
        expect(weapon[upgrade]).not.toBe(beforeValue);
    }

    it('should have upgrades, which perform the action and have an associated cost', function() {
        TestUpgrade('Range');
        TestUpgrade('FireRate');
        TestUpgrade('ProjectileSpeed');
        TestUpgrade('Damage');
        TestUpgrade('Accuracy');
    });
});
