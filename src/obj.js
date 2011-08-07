/******************************************************************************
 *                                ~black.obj~                                 *
 *                              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                               *
 * Extensions to work with objects.                                           *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
void function (root) {

    var obj

    // Aliases
    , keys      = Object.keys
    , own_props = Object.getOwnPropertyNames
    , proto     = Object.getPrototypeOf

    , __slice   = Array.prototype.slice



    ///// Function hasp ////////////////////////////////////////////////////////
    //
    //   (obj:Obj, key:Str) ↦ Bool
    //
    // Checks if the given key exists in the object.
    //
    function hasp(obj, key) {
        return obj.hasOwnProperty(key)
    }

    ///// Function emptyp //////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if an object has any own properties.
    //
    function emptyp(obj) { var key
        for (key in obj)
            if (hasp(obj, key)) return false

        return true
    }

    ///// Function size ////////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Num
    //
    // Returns the number of own enumerable properties in the object.
    //
    function size(obj) {
        return keys(obj).length
    }

    ///// Function proto ///////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Obj
    //
    // Return the [[Prototype]] of an object.
    //
    // :alias: Object.getPrototypeOf
    //



    ///// Function keys ////////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Array
    //
    // Returns a list of all **own** enumerable properties in an object.
    //
    // :alias: Object.keys
    //


    ///// Function own_props ///////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Array
    //
    // Returns a list of all **own** properties in an Object, enumerable
    // or not.
    //
    // :alias: Object.getOwnPropertyNames
    //


    ///// Function values //////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Array
    //
    // Returns a list of the values for all **own** enumerable
    // properties of an object.
    //
    function values(obj) {
        return keys(obj).map(function(key) {
            return obj[key] })
    }

    ///// Function items ///////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Array
    //
    // Returns a list of tupes (key, value) for all **own** enumerable
    // properties of an object.
    //
    function items(obj) {
        return keys(obj).map(function(key) {
            return [key, obj[key]] })
    }



    ///// Function get /////////////////////////////////////////////////////////
    //
    //   (obj:Obj, key:Str[, default_value][pred:Fn]) ↦ *mixed*
    //
    // Returns the given property in the object, or default if the
    // property can't be found.
    //
    function get(obj, key, default_value, pred) {
        return pred?    pred(obj[key], key, obj) && obj[key]
                                            || default_value
        : key in obj?  obj[key]
        :              default_value
    }

    ///// Function pop /////////////////////////////////////////////////////////
    //
    //   (obj:Obj, key:Str[, default_value][pred:Fn]) ↦ *mixed*
    //
    // Removes the property from the object, then return it or the
    // default value.
    //
    function pop(obj, key, default_value, pred) { var result
        result = get(obj, key, default_value, pred)
        delete obj[key]
        return result
    }

    ///// Function set_default /////////////////////////////////////////////////
    //
    //   (obj:Obj, key:Str, value[, pred:Fn]) ↦ *mixed*
    //
    // Sets the property if it does not exist in the object, or does not
    // pass the predicate test.
    //
    function set_default(obj, key, value, pred) {
        function valid_keyp(){
            return pred?  pred(obj[key], key, obj)
            :        hasp(obj, key) }

        if (!valid_keyp())  obj[key] = value
        return obj[key]
    }



    ///// Function nextend /////////////////////////////////////////////////////
    //
    //   (target:Obj, sources...:Obj) ↦ Obj
    //
    // Extends an object with properties from multiple sources.
    //
    function nextend(target) { var sources
        sources = __slice.call(arguments, 1)
        sources.forEach(function(source) {
            keys(source).forEach(function(key) {
                target[key] = source[key] })})

        return target
    }

    ///// Function extend //////////////////////////////////////////////////////
    //
    //   (target:Obj, sources...:Obj) ↦ Obj
    //
    // Extends an object with properties from multiple sources.
    //
    function extend() { var args
        args = [{}]
        args.push.apply(args, arguments)
        return nextend.apply(null, args)
    }

    ///// Function copy ////////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Obj
    //
    // Makes a shallow copy of an object.
    //
    // TODO: support deep copies.
    //
    function copy(obj) {
        return extend(obj)
    }



    ///// Exports //////////////////////////////////////////////////////////////
    obj = typeof exports == 'undefined'?  root.black.obj = { }
        :                                 exports

    obj.hasp        = hasp
    obj.emptyp      = emptyp
    obj.size        = size
    obj.keys        = keys
    obj.own_props   = own_props
    obj.values      = values
    obj.items       = items
    obj.get         = get
    obj.pop         = pop
    obj.set_default = set_default
    obj.extend      = extend
    obj.nextend     = nextend
    obj.copy        = copy
    obj.proto       = proto

    obj.$black_box   = Object
    obj.$black_proto = Object.prototype

    obj.$black_utils = { extend      : extend
                       , keys        : keys
                       , own_props   : own_props
                       , values      : values
                       , items       : items
                       , proto       : proto
                       , get         : get
                       , set_default : set_default }

}(this)
