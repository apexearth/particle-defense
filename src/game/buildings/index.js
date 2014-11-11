define([
        "./building.ammo-fab",
        "./building.beam",
        "./building.behemoth",
        "./building.cannon",
        "./building.cross-eyes",
        "./building.energy-fab",
        "./building.fast-gun",
        "./building.grenade",
        "./building.gun",
        "./building.home-base",
        "./building.laser",
        "./building.lethargic-cannon",
        "./building.machine-gun",
        "./building.metal-fab",
        "./building.missile",
        "./building.sharp-shooter",
        "./building.shocker",
        "./building.wall"
    ],
    function (ammoFab,
              beam,
              behemoth,
              cannon,
              crossEyes,
              energyFab,
              fastGun,
              grenade,
              gun,
              homeBase,
              laser,
              lethargicCannon,
              machineGun,
              metalFab,
              missile,
              sharpShooter,
              shocker,
              wall) {

        var list = {};
        Add(ammoFab);
        Add(beam);
        Add(behemoth);
        Add(cannon);
        Add(crossEyes);
        Add(energyFab);
        Add(fastGun);
        Add(grenade);
        Add(gun);
        Add(homeBase);
        Add(laser);
        Add(lethargicCannon);
        Add(machineGun);
        Add(metalFab);
        Add(missile);
        Add(sharpShooter);
        Add(shocker);
        Add(wall);
        return list;

        function Add(func) {
            list[func.Name] = func;
        }

    }
);