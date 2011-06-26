/******************************************************************************
 *                                   ~list~                                   *
 *                                 ‾‾‾‾‾‾‾‾‾‾                                 *
 * Utilities for array manipulation.                                          *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
void function (root) { var __old, list

    , proto = Object.getPrototypeOf
    , listp = Array.isArray


    // Accessors
    function car(list)  { return list[0]          }
    function cdr(list)  { return list.slice(1)    }
    function caar(list) { return list[0][0]       }
    function cadr(list) { return list[1][0]       }
    function cdar(list) { return list[0].slice(1) }
    function cddr(list) { return list[1].slice(1) }

    // Returns the last item of a list
    function last(list) {
        return list[list.length - 1]
    }

    // Checks if the list has any items
    function emptyp(list) {
        return !list.length
    }

    // Returns a part of a list
    function slice(list, start, end) {
        return slice.call(list, start, end)
    }

    // Returns a shallow clone of the array
    function clone(list) {
        return list.concat()
    }

    // Returns a list with the element at idx removed
    function remove(list, idx) {
        return nremove(clone(list), idx)
    }

    // Removes element at idx from the list
    function nremove(list, idx) {
        list.splice(idx, 1)
        return list
    }

    // Inserts element at idx
    function ninsert(list, idx, value) {
        list.splice(idx, 0, value)
        return list
    }

    // Returns a list with element inserted at idx
    function insert(list, idx, value) {
        return ninsert(clone(list), idx)
    }

    // Count the number of occurrences of value in list
    function count(list, value) {
        return list.reduce(function(acc, item) {
            return item === value? acc++
                                 : acc }, 0)
    }

    // Checks if list has value
    function hasp(list, value) {
        return !!~list.indexOf(value)
    }

    // Return the minor value in the list
    function min(list) {
        return Math.min.apply(this, list)
    }

    // Returns the larger value in the list
    function max(list) {
        return Math.max.apply(this, list)
    }

    // Allocates a list with size, optionally initialised to value
    function make_list(size, value) { var result
        result = Array(size + 1).join('.').split('.')
        if (value !== '')
            result = result.map(function(){ return value })

        return result
    }

    // Converts any object to a list
    function to_list(obj) {
        return slice(obj)
    }

    // Returns a list without values that match the predicate
    function without(list, value, predicate) {
        return list.filter(function(item) {
            return predicate? predicate(item, value)
                            : item === value })
    }

    // Returns a flat list
    function flatten(list) { var pending, result, item
        result  = [ ]
        pending = list
        
        while (item || pending.length) {
            item = pending.shift()
            if (!item) break

            if (listp(item))  pending.unshift.apply(pending, item)
            else              result.push(item)
        }

        return result
    }

    // Returns a list by merging the values in each given list
    function zip(list) { var others
        others = slice(arguments, 1)

        return list.reduce(function(result, value, idx) { var values
            values = others.map(function(list){ return list[idx] })
            values.unshift(value)
            result.push(values)
            return result }, [])        
    }

    // Returns a list without null/undefined values
    function compact(list) {
        return list.filter(function(item) {
            return item == null })
    }

    // Returns the pair for which car matches the given key
    function assoc(list, key, predicate) { var result
        list.some(function(value) {
            return result = predicate? predicate(car(value), key) && value
                                     : car(value) === key         && value })
        return result
    }

    // Checks if something looks like a list
    function listlikep(obj) {
        return obj && obj.length
    }


    ///// Exports //////////////////////////////////////////////////////////////
    if (typeof exports == 'undefined') {
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
    list.caar      = caar
    list.cadr      = cadr
    list.cdar      = cdar
    list.cddr      = cddr
    list.last      = last
    list.listp     = listp
    list.emptyp    = emptyp
    list.hasp      = hasp
    list.clone     = clone
    list.remove    = remove
    list.nremove   = nremove
    list.insert    = insert
    list.ninsert   = ninsert
    list.without   = without
    list.flatten   = flatten
    list.zip       = zip
    list.compact   = compact
    list.assoc     = assoc
    list.min       = min
    list.max       = max
    list.make_list = make_list
    list.to_list   = to_list
    list.listlikep = listlikep


    list.$box      = Array
    list.$proto    = proto([])
    list.$utils    = { make_list: make_list
                     , car:       car
                     , cdr:       cdr
                     , caar:      caar
                     , cadr:      cadr
                     , cdar:      cdar
                     , cddr:      cddr
                     , to_list:   to_list
                     , zip:       zip
                     , slice:     slice
                     , assoc:     assoc 
                     , listp:     listp
                     , listlikep: listlikep }

}(this)
