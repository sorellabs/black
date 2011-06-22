/******************************************************************************
 *                                ~black.obj~                                 *
 *                              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                               *
 * Extensions to work with objects.                                           *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
void function (root) { var __old, obj

    , keys  = Object.keys


    // Checks if an object has a key set in itself
    function has(obj, key) {
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
            if (has(obj, key)) return false

        return true
    }



    ///// Exports //////////////////////////////////////////////////////////////
    if (typeof exports == 'undefined') {
        if (!root.black) root.black = { }

        __old = root.obj.obj
        obj = root.obj.obj = { }

        ///// Method obj.make_local ////////////////////////////////////////////
        obj.make_local = function() {
            root.obj = __old
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

}(this)
