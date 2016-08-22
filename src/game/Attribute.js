module.exports = function (owner, valueF, upgradeF, canUpgradeF, cost) {
    var attribute     = valueF;
    attribute.upgrade = function () {
        if (!attribute.canUpgrade()) return;
        owner.player.tryApplyCost(attribute.cost);
        upgradeF();
        owner.upgradeCount++;
    };
    /** @return {boolean} **/
    attribute.canUpgrade = function () {
        if (canUpgradeF !== null && !canUpgradeF()) return false;
        return owner.player.testApplyCost(attribute.cost);
    };
    attribute.cost = {};
    for (var c in cost) {
        if (cost.hasOwnProperty(c)) {
            attribute.cost[c] = (function (cost) {
                return function () {
                    return Math.pow(cost(), 1 + owner.upgradeCount / 20);
                };
            })(cost[c]);
        }
    }
    return attribute;
};
