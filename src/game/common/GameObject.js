const DisplayObject = require('./DisplayObject');
module.exports = GameObject;

function GameObject(options) {
    DisplayObject.call(this, options);
    var orders = [];

    Object.defineProperties(this, {
        orders: {
            get: function () {
                return orders;
            }
        },
        currentOrder: {
            get: function () {
                return orders[0];
            }
        }
    });
}
GameObject.prototype = Object.create(DisplayObject.prototype);
GameObject.prototype.constructor = GameObject;

GameObject.prototype.order = function (order) {
    this.orders.push(order);
};

GameObject.prototype.clearOrder = function () {
    if (this.orders.length === 0) throw new Error('There is no order to complete.');
    this.orders.shift();
};

GameObject.prototype.clearOrders = function () {
    var length = this.orders.length;
    if (length === 0) return;
    while (length--) this.orders.pop();
};
