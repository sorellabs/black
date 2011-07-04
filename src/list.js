/******************************************************************************
 *                                   ~list~                                   *
 *                                 ‾‾‾‾‾‾‾‾‾‾                                 *
 * Utilities for handling sequence objects (Array and Arraylike)              *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/

/// Module list ////////////////////////////////////////////////////////////////
void function (root) { 

    var __old, list

    // Imports
    , type = typeof require != 'undefined'?  require('./type') : black.type

    // Aliases
    , listp          = Array.isArray
    , __slice        = Array.prototype.slice
    , __index        = Array.prototype.indexOf
    , __filter       = Array.prototype.filter
    , __map          = Array.prototype.map
    , __each         = Array.prototype.forEach
    , __reduce       = Array.prototype.reduce
    , __reduce_right = Array.prototype.reduceRight
    , __some         = Array.prototype.some
    , __every        = Array.prototype.every

    // Typechecking aliases
    , not_nilp       = type.not_nil
    , objp           = type.objp
    , callablep      = type.callablep



    //// -Making lists /////////////////////////////////////////////////////////

    ///// Function make_list ///////////////////////////////////////////////////
    //
    //   (size:Num[, default_value]) ⇒ List
    // 
    // Allocates a list with the given size, optionally filled with the
    // default value.
    // 
    // If a default value is not given, the list will be filled with
    // `undefined` values.
    //
    function make_list(size, default_value) { var result
        result = Array(size + 1).join('0').split('0')

        return default_value?  result.map(function(){ return default_value })
                            :  result
    }

    ///// Function range ///////////////////////////////////////////////////////
    //
    //   (start:Num, end:Num[, step:Num]) ⇒ List
    // 
    // Makes a list with numeric values ranging from `start` to `end`.
    // 
    // `end` is not included in the resulting list.
    //
    function range(start, end, step) { var i, result
        step   = step || 1
        result = []

        for (i = start; i < end; i += step)
            result.push(i)
            
        return result
    }

    ///// Function to_array ////////////////////////////////////////////////////
    //
    //   (obj:List) ⇒ Array
    // 
    // Returns an *actual* array from the list-like object.
    //
    function to_array(obj) { var result, i
        result = []
        for (i = size(obj); i--;)
            if (i in obj)  result[i] = obj[i]
                             
        return result
    }

    ///// Function copy ////////////////////////////////////////////////////////
    //
    //   (list:List) ⇒ List
    // 
    // Returns a shallow copy of the list.
    //
    function copy(list) {
        return list.concat()
    }



    //// -Misc information about a list and its elements ///////////////////////

    ///// Function size ////////////////////////////////////////////////////////
    //
    //   (list:List) ⇒ Num
    // 
    // Returns the size of a list.
    //
    function size(list) {
        return list?  list.length
                   :  0
    }

    ///// Function emptyp //////////////////////////////////////////////////////
    //
    //   (list:List) ⇒ Bool
    // 
    // Checks if a list is empty or not.
    //
    function emptyp(list) {
        return list?  !list.length
                   :  true
    }

    ///// Function hasp ////////////////////////////////////////////////////////
    //
    //   (list:List, value[, pred:Fn]) ⇒ Bool
    // 
    // Checks if a list contains the given value or not.
    // 
    // The comparison is done using the strict equality comparison
    // (`===`), unless a diferent predicate function is given.
    // 
    // The predicate function does not work with `null` values.
    //
    function hasp(list, value, pred) {
        return !list?  false
             : pred?   find_first(list, value, pred) !== null
             :         !!~__index.call(list, value)
    }

    ///// Function count ///////////////////////////////////////////////////////
    //
    //   (list:List, value[, pred:Fn]) ⇒ Num
    // 
    // Returns the number of occurrences of `value' in the given list,
    // optionally filtered by a predicate.
    //
    function count(list, value, pred) { var result, i
        result = 0
        for (i = size(list); i--;)
            if (pred(value))  result++

        return result
    }



    //// -Acessing individual members //////////////////////////////////////////
    
    ///// Function first ///////////////////////////////////////////////////////
    //
    //   (list:List) ⇒ *mixed*
    // 
    // Returns the first element of the list.
    //
    function first(list) {
        return list?  list[0]
                   :  null
    }

    ///// Function last ////////////////////////////////////////////////////////
    //
    //   (list:List) ⇒ *mixed*
    // 
    // Returns the last element of the list.
    //
    function last(list) {
        return list?  list[list.length - 1]
                   :  null
    }

    ///// Function nth /////////////////////////////////////////////////////////
    //
    //   (list:List, index:Num) ⇒ *mixed*
    // 
    // Returns the element at the given index in the list.
    //
    function nth(list, index) {
        return list?  list[index]
                   :  null
    }

    ///// Function find_first //////////////////////////////////////////////////
    //
    //   (list:List[, pred:Fn][, ctx:Object]) ⇒ *mixed*
    // 
    // Returns the first element of the list to pass the predicate function.
    // 
    // If the predicate is not given, the function will return the first
    // non-null element from the list.
    // 
    // A context may be given as the last argument; if so, the predicate
    // function will be called with the given object as the `[[this]]`.
    //
    function find_first(list, pred, ctx) { var i
        pred = pred || not_nilp
        
        for (i = 0; i < size(list); ++i)
            if (i in list && pred.call(ctx, list[i], i, list))
                return list[i]

        return null
    }

    ///// Function find_last ///////////////////////////////////////////////////
    //
    //   (list:List[, pred:Fn][, ctx:Object]) ⇒ *mixed*
    // 
    // Returns the last element of the list to pass the predicate function.
    // 
    // If the predicate is not given, the function will return the first
    // non-null element from the list.
    // 
    // A context may be given as the last argument; if so, the predicate
    // function will be called with the given object as the `[[this]]`.
    //
    function find_last(list, pred, ctx) { var i
        pred = pred || not_nilp

        for (i = size(list); i--;)
            if (i in list && pred.call(ctx, list[i], i, list))
                return list[i]

        return null
    }


    
    //// -Extracting sections of a list ////////////////////////////////////////

    ///// Function slice ///////////////////////////////////////////////////////
    //
    //   (list:List[, start:Num][, end:Num]) ⇒ List
    // 
    // Extracts a subsection of the list that goes from `start` to `end`.
    // 
    // When `start` is not given, the algorithm assumes the beginning of
    // the list. When `end` is not given, the algorithm assumes the last
    // item of the list.
    // 
    // At any rate, `start` and `end` are included in the resulting
    // sublist.
    // 
    // If negative indexes are passed as either `start` or `end`,
    // they're taken as a the difference from the length of the
    // list. That is, a -1 index means the last element, -2 the one
    // before the last, and so on.
    //
    function slice(list, start, end) {
        return __slice.call(list, start, end)
    }

    ///// Function rest ////////////////////////////////////////////////////////
    //
    //   (list:List) ⇒ List
    // 
    // Returns a new list without the first element.
    //
    function rest(list) {
        return slice(list, 1)
    }

    ///// Function but_last ////////////////////////////////////////////////////
    //
    //   (list:List) ⇒ List
    // 
    // Returns a new list without the last element.
    //
    function but_last(list) {
        return slice(list, 0, -1)
    }

    ///// Function drop ////////////////////////////////////////////////////////
    //
    //   (list:List, num:Num) ⇒ List
    // 
    // Returns a list without the first `num` elements.
    //
    function drop(list, num) {
        return slice(list, num + 1)
    }

    ///// Function keep ////////////////////////////////////////////////////////
    //
    //   (list:List, num:Num) ⇒ List
    // 
    // Returns a list with just the first `num` elements.
    //
    function keep(list, num) {
        return slice(list, 0, num -1)
    }

    ///// Function remove //////////////////////////////////////////////////////
    //
    //   (list:List, index:Num) ⇒ List
    // 
    // Returns a list without the item at `index`.
    //
    function remove(list, index) { var result
        result = copy(list)
        result.splice(index, 1)
        return result
    }

    ///// Function without /////////////////////////////////////////////////////
    //
    //   (list:List, value[, pred:Fn]) ⇒ List
    // 
    // Returns a list without elements that match `value`, with the
    // comparison optionally defined by a predicate function.
    // 
    // If a predicate function is not given, the strict equality
    // comparison (`===`) will be used.
    //
    function without(list, value, pred) {
        return filter(list, function(item, index) {
            return pred?  pred(item, index, list)
                       :  item === value })
    }



    //// -Extending lists //////////////////////////////////////////////////////

    ///// Function insert //////////////////////////////////////////////////////
    //
    //   (list:List, index:Num[, values...]) ⇒ List
    // 
    // Returns a list with the given elements inserted at the given
    // index.
    //
    function insert(list, index) { var values, result
        values = slice(arguments, 2)
        result = copy(list)
        result.splice.apply(result, [index, 0].concat(values))

        return result
    }

    ///// Function cat /////////////////////////////////////////////////////////
    //
    //   (list[, lists...]) ⇒ List
    // 
    // Returns a list with the given lists concatened.
    //
    function cat() {
        return reduce(arguments, function(result, list) {
            if (!listp(result))  result = slice(result)
            return result.concat(list) })
    }


    //// -Structure handling ///////////////////////////////////////////////////

    ///// Function replace /////////////////////////////////////////////////////
    //
    //   (list:List, value, sub[, pred:Fn]) ⇒ List
    // 
    // Returns a list with the elements tha match `value` replaced by
    // `sub`.
    // 
    // If a predicate function is not given, the strict equality
    // comparison (`===`) will be used.
    //
    function replace(list, value, sub, pred) {
        if (!callablep(pred))  pred = function(x) { return value === x }

        return map(list, function(item, index) {
            return pred(item, index, list)?  sub
                                          :  item })
    }

    ///// Function replace_at //////////////////////////////////////////////////
    //
    //   (list:List, index:Num, sub) ⇒ List
    // 
    // Replaces the item at index by `sub`.
    //
    function replace_at(list, index, sub) { var result
        result = copy(list)
        result.splice(index, 1, sub)
        return result
    }

    ///// Function sorted //////////////////////////////////////////////////////
    //
    //   (list:List[, comparison:Fn]) ⇒ List
    // 
    // Returns a sorted list according to the comparison function.
    // 
    // If a comparison function is not given, the items will be sorted
    // lexographically.
    //
    function sorted(list, comparison) {
        return copy(list).sort(comparison)
    }

    ///// Function reversed ////////////////////////////////////////////////////
    //
    //   (list:List) ⇒ List
    // 
    // Returns the a reversed representation of the list.
    // 
    // That is, last items first, first items last.
    //
    function reversed(list) {
        return copy(list).reverse()
    }



    //// -Iteration through a list /////////////////////////////////////////////
    
    ///// Function map /////////////////////////////////////////////////////////
    //
    //   (list:List, pred:Fn[, ctx:Obj]) ⇒ List
    // 
    // Returns a list with its elements transformed by the predicate
    // function.
    //
    function map(list, pred, ctx) {
        return objp(list)?  __map.call(list, pred, ctx)
                         :  []
    }

    ///// Function each ////////////////////////////////////////////////////////
    //
    //   (list:List, pred:Fn[, ctx:Obj]) ⇒
    // 
    // Executes the predicate function for every item in the list.
    //
    function each(list, pred, ctx) {
        return objp(list)?  __each.call(list, pred, ctx)
                         :  void 0
    }

    ///// Function filter //////////////////////////////////////////////////////
    //
    //   (list:List, pred:Fn[, ctx:Obj]) ⇒ List
    // 
    // Returns a list without the elements that don't pass the predicate
    // test.
    //
    function filter(list, pred, ctx) {
        return objp(list)?  __filter.call(list, pred, ctx)
                         :  []
    }

    ///// Function reduce //////////////////////////////////////////////////////
    //
    //   (list:List, pred:Fn[, initial][, ctx:Obj]) ⇒ *mixed*
    // 
    // Apply the predicate against each pair in the array (left to
    // right) so to return a single accumulated value.
    // 
    // An starting value can be given, in which case the array will work
    // as if that item was inserted as the first element.
    //
    function reduce(list, pred, initial, ctx) {
        if (objp(ctx))  pred = pred.bind(ctx)

        return objp(list)?  __reduce.call(list, pred, initial)
                         :  []
    }
    
    ///// Function reduce_right ////////////////////////////////////////////////
    //
    //   (list:List, pred:Fn[, initial][, ctx:Obj]) ⇒ *mixed*
    // 
    // Apply the predicate against each pair in the array (right to
    // left) so to return a single accumulated value.
    // 
    // An starting value can be given, in which case the array will work
    // as if that item was inserted as the last element.
    //
    function reduce_right(list, pred, initial, ctx) {
        if (objp(ctx))  pred = pred.bind(ctx)

        return objp(list)?  __reduce_right.call(list, pred, initial)
                         :  []
    }

    ///// Function some ////////////////////////////////////////////////////////
    //
    //   (list:List, pred:Fn[, ctx:Obj]) ⇒ *mixed*
    // 
    // Checks whether some element in the array passes the predicate
    // function's test.
    //
    function some(list, pred, ctx) {
        return objp(list)?  __some.call(list, pred, ctx)
                         :  false
    }

    ///// Function every ///////////////////////////////////////////////////////
    //
    //   (list:List, pred:Fn[, ctx:Obj]) ⇒ *mixed*
    // 
    // Checks whether all of the elements in the array passes the
    // predicate function's test.
    //
    function every(list, pred, ctx) {
        return objp(list)?  __every.call(list, pred, ctx)
                         :  false
    }



    //// -Special mapping functions ////////////////////////////////////////////

    ///// Function pluck ///////////////////////////////////////////////////////
    //
    //   (list:List, attr:String) ⇒ List
    // 
    // Returns a list with all elements replaced by their attribute
    // `attr`.
    // 
    // Non-object items are mapped to `undefined`.
    //
    function pluck(list, attr) {
        return map(list, function(value) {
            return value?  value[attr]
                        :  void 0 })
    }

    ///// Function invoke //////////////////////////////////////////////////////
    //
    //   (list:List, method:String[, args...]) ⇒ List
    // 
    // Returns a list with the result of invoking the given method name
    // for all objects.
    // 
    // Items that have no such method are mapped to `undefined`.
    //
    function invoke(list, method) { var args
        args = slice(arguments, 2)

        return map(list, function(value) {
            return !value?                    void 0
                 : callablep(value[method])?  value[method].apply(this, args)
                 :                            void 0 })
    }



    ///// Exports //////////////////////////////////////////////////////////////
    list = typeof exports == 'undefined'?  root.black.list = { }
                                        :  exports


    list.make_list    = make_list
    list.range        = range
    list.to_array     = to_array
    list.copy         = copy
    list.size         = size
    list.emptyp       = emptyp
    list.hasp         = hasp
    list.count        = count
    list.first        = first
    list.last         = last
    list.nth          = nth
    list.find_first   = find_first
    list.find_last    = find_last
    list.slice        = slice
    list.rest         = rest
    list.but_last     = but_last
    list.drop         = drop
    list.keep         = keep
    list.remove       = remove
    list.without      = without
    list.insert       = insert
    list.cat          = cat
    list.replace      = replace
    list.replace_at   = replace_at
    list.sorted       = sorted
    list.reversed     = reversed
    list.map          = map
    list.each         = each
    list.filter       = filter
    list.reduce       = reduce
    list.reduce_right = reduce_right
    list.some         = some
    list.every        = every
    list.pluck        = pluck
    list.invoke       = invoke


    list.$black_box   = Array
    list.$black_proto = Array.prototype

}(this)