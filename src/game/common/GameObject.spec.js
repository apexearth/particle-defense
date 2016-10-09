describe('GameObject', function () {
    var GameObject = require('./GameObject');
    var coverage = require('../../../test/check-coverage');
    var expect = require('chai').expect;

    function createObject() {
        return new GameObject({level: {}});
    }

    it('.order()', function () {
        var object = createObject();
        var order = {
            type: 'orderType',
            value: 'orderValue'
        };
        object.order(order);
        expect(object.currentOrder).to.equal(order);
        expect(object.orders.length).to.equal(1);
    });

    it('.clearOrder()', function () {
        var object = createObject();
        var order = {
            type: 'orderType',
            value: 'orderValue'
        };
        object.order(order);
        expect(object.currentOrder).to.equal(order);
        var order2 = {
            type: 'orderType',
            value: 'orderValue'
        };
        object.order(order2);
        expect(object.currentOrder).to.equal(order);

        object.clearOrder();
        expect(object.currentOrder).to.equal(order2);
        expect(object.orders.length).to.equal(1);
        object.clearOrder();
        expect(object.currentOrder).to.equal(undefined);
        expect(object.orders.length).to.equal(0);
    });

    it('.clearOrders()', function () {
        var object = createObject();
        var order = {
            type: 'orderType',
            value: 'orderValue'
        };
        object.order(order);
        expect(object.currentOrder).to.equal(order);
        var order2 = {
            type: 'orderType',
            value: 'orderValue'
        };
        object.order(order2);
        expect(object.currentOrder).to.equal(order);

        object.clearOrders();
        expect(object.currentOrder).to.equal(undefined);
        expect(object.orders.length).to.equal(0);
    });


    coverage(this, function (done) {
        done(new GameObject({level: {}}));
    });
});
