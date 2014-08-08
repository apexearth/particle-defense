function Building(level, player, blockX, blockY) {
    this.TopLeft = { X: 0, Y: 0 };
    this.Health = 1000;
    this.Width = Level.Settings.BlockSize;
    this.Height = Level.Settings.BlockSize;

    this.Level = level;
    this.Player = player;

    this.X = blockX * Level.Settings.BlockSize + Level.Settings.BlockSize / 2;
    this.Y = blockY * Level.Settings.BlockSize + Level.Settings.BlockSize / 2;
    this.TopLeft = {
        X: blockX * Level.Settings.BlockSize,
        Y: blockY * Level.Settings.BlockSize
    };
    this.Block = this.Level.Map.Grid.getBlock(blockX, blockY);
    this.Block.IsBlocked = true;
    this.BlockX = this.Block.X;
    this.BlockY = this.Block.Y;

    this.ResourceStorage = {
        Energy: 0,
        Metal: 0,
        Ammo: 0
    }

    this.draw = function () { };
}
Building.List = {};

Building.prototype.update = function () {
    if (this.Health <= 0) {
        this.Level.Buildings.splice(this.Level.Buildings.indexOf(this), 1);
        this.Player.Buildings.splice(this.Player.Buildings.indexOf(this), 1);

    }
};
Building.prototype.addStorageToPlayer = function () {
    for (var key in this.ResourceStorage) {
        if (this.ResourceStorage.hasOwnProperty(key)) {
            this.Player.ResourceStorage[key] += this.ResourceStorage[key];
        }
    }
};
Building.prototype.removeStorageToPlayer = function () {
    for (var key in this.ResourceStorage) {
        if (this.ResourceStorage.hasOwnProperty(key)) {
            this.Player.ResourceStorage[key] -= this.ResourceStorage[key];
        }
    }
};

