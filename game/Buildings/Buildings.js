define("game/Buildings/Buildings", [
    "game/Buildings/AmmoFab",
    "game/Buildings/EnergyCollector",
    "game/Buildings/HomeBase",
    "game/Buildings/MetalFab",
    "game/Buildings/Turret_Gun"
], function (
    AmmoFab,
    EnergyCollector,
    HomeBase,
    MetalFab,
    Turret_Gun) {

    return {
        AmmoFab: AmmoFab,
        EnergyCollector: EnergyCollector,
        HomeBase: HomeBase,
        MetalFab: MetalFab,
        Turret_Gun: Turret_Gun
    };

});