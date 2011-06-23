/******************************************************************************
 *                                   ~list~                                   *
 *                                 ‾‾‾‾‾‾‾‾‾‾                                 *
 * Utilities for array manipulation.                                          *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
void function (root) { var __old, list

    , slice = Array.prototype.slice



    function car(list) {
        return list[0]
    }

    function cdr(list) {
        return list.slice(1)
    }

    function tail(list) {
        return list[list.length - 1]
    }

    function emptyp(list) {
        return !list.length
    }

    function listp(list) {
        return Array.isArray(list)
    }

    function clone(list) {
        return list.concat()
    }

    function remove(list, idx) {
        return nremove(clone(list), idx)
    }

    function nremove(list, idx) {
        list.splice(idx, 1)
        return list
    }

    function min(list) {
        return Math.min.apply(this, list)
    }

    function max(list) {
        return Math.max.apply(this, list)
    }

    function make_list(size, value) { var result
        result = Array(size + 1).join('.').split('.')
        if (value !== void 0)
            result = result.map(function(){ return value })

        return result
    }

    function to_list(obj) {
        return slice.call(obj)
    }



    ///// Exports //////////////////////////////////////////////////////////////
    if (typeof exports == 'undefined') {
        if (!root.black) root.black = { }

        __old = root.black.list
        list  = root.black.list = { }

        ///// Method list.make_local ///////////////////////////////////////////
        list.make_local = function() {
            root.list = __old
            return list }}
    else
        list = exports

    ///// -Properties under list ///////////////////////////////////////////////
    list.car       = car
    list.cdr       = cdr
    list.tail      = tail
    list.emptyp    = emptyp
    list.listp     = listp
    list.clone     = clone
    list.remove    = remove
    list.nremove   = nremove
    list.min       = min
    list.max       = max
    list.make_list = make_list
    list.to_list   = to_list

}(this)
