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
    this.BlockX = blockX;
    this.BlockY = blockY;
    this.Block = this.Level.Map.Grid.getBlock(this.X, this.Y);

}
Building.Cost = {
    Energy: 1000,
    Metal: 500
};

Building.prototype.update = function () {
    if (this.Health <= 0) {
        this.Level.Buildings.splice(this.Level.Buildings.indexOf(this), 1);
        this.Player.Buildings.splice(this.Player.Buildings.indexOf(this), 1);
    }
};

