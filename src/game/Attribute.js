define('game/Attribute', [], function () {
    return function (owner, valueF, upgradeF, canUpgradeF, cost) {
        var attribute = valueF;
        attribute.Upgrade = function () {
            if (!attribute.CanUpgrade()) return;
            owner.Player.TryApplyCost(attribute.Cost);
            upgradeF();
            owner.NumberOfUpgrades++;
        };
        /** @return {boolean} **/
        attribute.CanUpgrade = function () {
            if (canUpgradeF !== null && !canUpgradeF()) return false;
            return owner.Player.TestApplyCost(attribute.Cost);
        };
        attribute.Cost = {};
        for (var c in cost) {
            if (cost.hasOwnProperty(c)) {
                attribute.Cost[c] = function () {
                    return Math.pow(cost[c](), 1 + owner.NumberOfUpgrades / 20);
                }
            }
        }
        return attribute;
    };
});