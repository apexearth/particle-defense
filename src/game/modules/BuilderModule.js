const Module = require('./Module');

class BuilderModule extends Module {

    constructor(options) {
        super(options);

        this._current = null;
        this._progress = 0;
    }

    get current() {
        return this._current;
    }

    get progress() {
        return this.current ? this._progress / this.current.buildTime : 0;
    }

    update(seconds) {
        this._progress += seconds;
        if (this._progress >= this.current.buildTime) {
            this.complete();
        }
    }

    build(constructor) {
        this._current = constructor;
    }

    complete() {
        let unit = new this.current(this.parent);
        this.level.addUnit(unit);
        this._current = null;
    }
}


module.exports = BuilderModule;