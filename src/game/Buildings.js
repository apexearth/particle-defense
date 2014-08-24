define("game/Buildings", [
    "game/Buildings/Wall",
    "game/Buildings/AmmoFab",
    "game/Buildings/EnergyCollector",
    "game/Buildings/HomeBase",
    "game/Buildings/MetalFab",
    "game/Buildings/Gun",
    "game/Buildings/Autogun",
    "game/Buildings/Shotgun",
    "game/Buildings/Cannon"
], function (Wall, AmmoFab, EnergyCollector, HomeBase, MetalFab, Gun, Autogun, Shotgun, Cannon) {

    var list = {};
    list.Wall = Wall;
    list.AmmoFab = AmmoFab;
    list.EnergyCollector = EnergyCollector;
    list.HomeBase = HomeBase;
    list.MetalFab = MetalFab;
    list.Gun = Gun;
    list.Autogun = Autogun;
    list.Shotgun = Shotgun;
    list.Cannon = Cannon;
    return list;

});