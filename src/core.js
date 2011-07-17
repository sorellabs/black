/******************************************************************************
 *                                ~black.core~                                *
 *                              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                              *
 * Provides common functionality to all black modules.                        *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
void function (root) {

    var __old, black

    , slice = Array.prototype.slice
    , keys  = Object.keys
    , top   = typeof global == 'undefined'?  window : global

    // Arbitrary checks
    function genericp(kind) { return ~kind.indexOf('generic') }
    function ownp(kind)     { return ~kind.indexOf('own')     }
    function utilsp(kind)   { return ~kind.indexOf('utils')   }
    function specialp(key)  { return /^\$/.test(key)          }
    function fnp(obj)       { return typeof obj == 'function' }

    // Unpacks a black module so it's used in a sane way
    function unpack(kind, root, target, proto, source){
        if (ownp(kind))      do_unpack(proto, source, methodize)
        if (genericp(kind))  do_unpack(target, source)
        if (utilsp(kind))    do_unpack(root, source.$black_utils)
    }
    function do_unpack(target, source, mapper) {
        if (source == null || target == null)  return

        mapper = mapper || function(x){ return x }
        keys(source).forEach(function(key) {
            if (!specialp(key))
                target[key] = mapper(source[key]) })

        return target
    }

    // Unpacks all modules in black. Utils go in `target` or the global obj
    function unpack_all(kind, global) {
        keys(this).forEach(function(module) {
            module = this[module]
            if (!fnp(module))  unpack( kind
                                     , global || top
                                     , module.$black_box
                                     , module.$black_proto
                                     , module) }, this)
    }

    // Transforms a generic method into a SLOOOOOOOOOOOW instance method.
    function methodize(fn) {
        return function() { var args
            args = slice.call(arguments)
            return fn.apply(this, [this].concat(args)) }
    }


    ///// Exports //////////////////////////////////////////////////////////////
    if (typeof exports == 'undefined') {
        __old = root.black
        black = root.black = { }

        ///// Method black.make_local //////////////////////////////////////////
        black.make_local = function() {
            root.black = __old
            return black }}
    else
        black = exports

    ///// -Properties under black //////////////////////////////////////////////
    black.unpack     = unpack
    black.unpack_all = unpack_all

}(this)
