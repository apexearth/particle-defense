const Attribute = require('./Attribute');

const coverage = require('../../test/check-coverage');
const expect = require('chai').expect;

describe('Attribute', function () {
    function createInvalidAttribute() {
        var parent = {
            value: 1
        };
        expect(function () { // Should throw when given no parent.
            new Attribute();
        }).to.throw();
        expect(function () { // Should throw when given no key.
            new Attribute({parent: parent});
        }).to.throw();
        expect(function () { // Should throw when given an invalid key name.
            new Attribute({parent: parent, key: 'value2'});
        }).to.throw();
        expect(function () { // Should throw when given an invalid key name.
            new Attribute({parent: parent, key: 'value'});
        }).to.not.throw();
    }

    function createAttribute() {
        var parent = {
            value: 1
        };
        var attribute = new Attribute({
            parent: parent,
            key: 'value',
            upgrade: {
                factor: 1.1,
                costMultiplier: 1.25,
                cost: {
                    energy: 10,
                    metal: 5
                }
            }
        });
        expect(attribute.parent).to.equal(parent);
        expect(attribute.value).to.equal(parent.value);
        expect(attribute.level).to.equal(1);
        expect(attribute.upgrade.factor).to.equal(1.1);
        expect(attribute.upgrade.costMultiplier).to.equal(1.25);
        expect(attribute.upgrade.cost.energy).to.equal(10);
        expect(attribute.upgrade.cost.metal).to.equal(5);
        return attribute;
    }

    it('new', function () {
        createInvalidAttribute();
        createAttribute();
    });
    it('.upgrade()', function () {
        var attribute = createAttribute();
        attribute.upgrade();
        expect(attribute.level).to.equal(2);
        expect(attribute.value).to.equal(1.1);
        expect(attribute.upgrade.cost.energy).to.equal(12.5);
        expect(attribute.upgrade.cost.metal).to.equal(6.25);
    });
    it('.canUpgrade()', function () {
        var attribute = createAttribute();
        expect(attribute.canUpgrade.bind(attribute)).to.throw();
        expect(attribute.canUpgrade({
            energy: 9,
            metal: 100
        })).to.equal(false);
        expect(attribute.canUpgrade({
            energy: 10,
            metal: 5
        })).to.equal(true);
    });


    coverage(this, createAttribute());
});
