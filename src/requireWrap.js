// To be loaded after require
(function (exports) {
    var op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty;

    function require(name, deps, callback) {
        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        var i = deps.length;
        while (i-- > 0) {
            var dep = deps[i];
            if (dep.substring(dep.length - 1, 1) === "!")
                deps[i] = dep.substring(0, dep.length - 1) + "/index";
        }

        if (typeof name === 'string') return require.original(name, deps, callback);
        if (typeof name !== 'string') return require.original(deps, callback);
    }

    require.original = exports.require;
    mixin(require, require.original);
    exports.require = require;


    function define(name, deps, callback) {
        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        } else {
            var i = deps.length;
            while (i-- > 0) {
                var dep = deps[i];
                if (dep.substring(dep.length - 1) === "!")
                    deps[i] = dep.substring(0, dep.length - 1) + "/index";
            }
        }

        if (!isArray(deps) && typeof name !== 'string') return define.original(callback);
        if (!isArray(deps) && typeof name == 'string') return define.original(name, callback);
        if (typeof name !== 'string') return define.original(deps, callback);
        if (typeof name === 'string') return define.original(name, deps, callback);
    }

    define.original = exports.define;
    mixin(require, define.original);
    exports.define = define;


    /* Code taken from require.js */

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value === 'object' && value && !isArray(value) && !isFunction(value) && !(value instanceof RegExp)) {

                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

}(this));