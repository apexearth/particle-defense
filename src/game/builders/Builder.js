module.exports = Builder;

function Builder() {

    this.name = 'Builder';
    this.speed = 1;
    this.progress = 0;
    this.queue = [];
    this.list = [];

    Object.defineProperties(this, {
        current: {
            get: function () {
                return this.queue[0] || null;
            }.bind(this)
        }
    });

    this.addBuildable = function (buildable) {
        if (this.list.indexOf(buildable) >= 0) {
            throw new Error('Buildable ' + buildable.name + ' already exists on ' + this.name);
        }
        if (typeof buildable.buildTime === 'undefined') {
            throw new Error('Invalid buildable ' + buildable.name + ', no buildTime exists.');
        }
        this.list.push(buildable);
    };

    this.build = function (buildable) {
        if (this.list.indexOf(buildable) === -1) {
            throw new Error(this.name + ' is not capable of building ' + buildable.name);
        }
        this.queue.push(buildable);
    };

    this.update = function (seconds) {
        if (this.current) {
            this.progress += seconds;
        }
    };
}