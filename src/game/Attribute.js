module.exports = Attribute;

function Attribute(options) {
    if (!options)
        throw new Error('The options parameter is required.');
    if (!options.parent)
        throw new Error('options.parent is required.');
    if (!options.key)
        throw new Error('options.key is required.');
    if (!options.parent[options.key])
        throw new Error('Key: ' + options.key + ' is not found.');

    options.upgrade = Object.assign({
        factor: 1.1,
        costMultiplier: 1.1,
        cost: {
            energy: 10,
            metal: 5
        }
    }, options.upgrade);

    var key = options.key;
    this.parent = options.parent;
    Object.defineProperty(this, 'value', {
        get: function () {
            return this.parent[key];
        }.bind(this)
    });
    var level = 1;
    Object.defineProperty(this, 'level', {
        get: function () {
            return level;
        }.bind(this)
    });

    this.canUpgrade = function (resources) {
        if (typeof resources !== 'object')
            throw new Error('The resources argument is required.');
        for (var resource in this.upgrade.cost) {
            if (this.upgrade.cost.hasOwnProperty(resource)
                && this.upgrade.cost[resource] > resources[resource]) {
                return false;
            }
        }
        return true;
    };
    this.upgrade = function () {
        level += 1;
        this.parent[key] *= this.upgrade.factor;
        for (var resource in this.upgrade.cost) {
            if (this.upgrade.cost.hasOwnProperty(resource)) {
                this.upgrade.cost[resource] *= this.upgrade.costMultiplier;
            }
        }
    };
    this.upgrade.factor = options.upgrade.factor;
    this.upgrade.costMultiplier = options.upgrade.costMultiplier;
    this.upgrade.cost = Object.assign({}, options.upgrade.cost);
}
