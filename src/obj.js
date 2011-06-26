/******************************************************************************
 *                                ~black.obj~                                 *
 *                              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                               *
 * Extensions to work with objects.                                           *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
void function (root, black) { var __old, obj

    , keys  = Object.keys
    , slice = Array.prototype.slice
    , proto = Object.getPrototypeOf

    // Checks if an object has a key set in itself
    function hasp(obj, key) {
        return obj.hasOwnProperty(key)
    }

    // Returns a list of values in the object
    function values(obj) {
        return keys(obj).map(function(key) {
            return obj[key] })
    }

    // Returns a list of tuples (key, value) in the object
    function items(obj) {
        return keys(obj).map(function(key) {
            return [key, obj[key]] })
    }

    // Returns a property in the object, or default
    function attr(obj, key, def) {
        return obj[key] != null? obj[key]
                               : def
    }

    // Sets the property only if it hasn't been set yet
    function set_default(obj, key, value) {
        if (obj[key] == null) obj[key] = value
        return obj[key]
    }

    // Removes a property from the object, returns it or default
    function pop(obj, key, def) { var result
        result = attr(obj, key, def)

        delete obj[key]
        return result
    }

    // Checks if the object is empty
    function emptyp(obj) { var key
        for (key in obj)
            if (hasp(obj, key)) return false

        return true
    }

    // Returns the number of own properties (enumerables)
    function size(obj) {
        return keys(obj).length
    }
    
    // Extends an object with properties from multiple sources
    function extend(target) {
        slice.call(arguments, 1).forEach(function(source) {
            keys(source).reduce(function(acc, key) {
                target[key] = source[key]
                return target }, target )})

        return target
    }

    // Makes a shallow copy of an object
    function copy(obj) {
        return extend({ }, obj)
    }



    ///// Exports //////////////////////////////////////////////////////////////
    if (typeof exports == 'undefined') {
        __old = root.black.obj
        obj   = root.black.obj = { }

        ///// Method obj.make_local ////////////////////////////////////////////
        obj.make_local = function() {
            root.black.obj = __old
            return obj }}
    else
        obj = exports


    ///// -Properties under obj ////////////////////////////////////////////////
    obj.keys        = keys
    obj.values      = values
    obj.items       = items
    obj.attr        = attr
    obj.set_default = set_default
    obj.pop         = pop
    obj.extend      = extend
    obj.copy        = copy
    obj.size        = size
    obj.hasp        = hasp
    obj.emptyp      = emptyp

    obj.$box   = Object
    obj.$proto = proto({ })
    obj.$utils = { keys:   keys
                 , values: values
                 , items:  items
                 , extend: extend
                 , copy:   copy }

}(this, this.black || {})
