/******************************************************************************
 *                                   ~list~                                   *
 *                                 ‾‾‾‾‾‾‾‾‾‾                                 *
 * Utilities for handling sequence objects (Array and Arraylike)              *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/

/// Module list ////////////////////////////////////////////////////////////////
void function (root) {

    var list, undefined

    // Imports
    , type = typeof require == 'function'?  require('./type') : black.type

    // Aliases
    , arrayp         = Array.isArray
    , __slice        = Array.prototype.slice
    , __index        = Array.prototype.indexOf
    , __filter       = Array.prototype.filter
    , __map          = Array.prototype.map
    , __each         = Array.prototype.forEach
    , __reduce       = Array.prototype.reduce
    , __reduce_right = Array.prototype.reduceRight
    , __some         = Array.prototype.some
    , __every        = Array.prototype.every
    , __max          = Math.max

    // Typechecking aliases
    , nilp           = type.nilp
    , not_nilp       = type.not_nilp
    , objp           = type.objp
    , sequencep      = type.sequencep
    , callablep      = type.callablep



    //// -Making lists /////////////////////////////////////////////////////////

    ///// Function make_array //////////////////////////////////////////////////
    //
    //   (size:Num[, default_value]) ↦ Array
    //
    // Allocates an array with the given size, optionally filled with the
    // default value.
    //
    // If a default value is not given, the array will be filled with
    // empty strings.
    //
    function make_array(size, default_value) { var result, has_defaultp
        size         = (__max(size, 0)) >>> 0
        has_defaultp = arguments.length > 1
        if (size <= 0)  return []

        result = Array(size).join('0').split('0')
        return has_defaultp?  result.map(function(){ return default_value })
        :                result
    }

    ///// Function range ///////////////////////////////////////////////////////
    //
    //   (start:Num, end:Num[, step:Num]) ↦ Array
    //
    // Makes an array with numeric values ranging from `start` to `end`.
    //
    // `end` is not included in the resulting array.
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
    //   (obj:Sequence) ↦ Array
    //
    // Returns an *actual* array from any sequence object.
    //
    function to_array(obj) { var result, i
        result = []
        obj    = Object(obj)
        for (i = size(obj); i--;)
            if (i in obj)  result[i] = obj[i]

        return result
    }

    ///// Function copy ////////////////////////////////////////////////////////
    //
    //   (seq:Sequenece) ↦ Array
    //
    // Returns a shallow copy of the sequence, as an Array.
    //
    // :alias: slice
    //
    var copy = slice



    //// -Misc information about a list and its elements ///////////////////////

    ///// Function size ////////////////////////////////////////////////////////
    //
    //   (seq:Sequence) ↦ Num
    //
    // Returns the size of a sequence.
    //
    function size(seq) {
        return sequencep(seq)?  seq.length || 0
        :                  0
    }

    ///// Function emptyp //////////////////////////////////////////////////////
    //
    //   (seq:Sequence) ↦ Bool
    //
    // Checks if a sequence is empty or not.
    //
    function emptyp(seq) {
        return sequencep(seq)?  !seq.length
        :                  true
    }

    ///// Function hasp ////////////////////////////////////////////////////////
    //
    //   (seq:Sequence, value[, pred:Fn]) ↦ Bool
    //
    // Checks if a sequqnce contains the given value or not.
    //
    // The comparison is done using the strict equality comparison
    // (`===`), unless a diferent predicate function is given.
    //
    // The predicate function does not work with `null` values.
    //
    function hasp(seq, value, pred) {
        pred = pred && pred.bind(this, value)

        return !sequencep(seq)?  false
        : pred?             find_first(seq, pred) !== null
        :                   !!~__index.call(seq, value)
    }

    ///// Function count ///////////////////////////////////////////////////////
    //
    //   (seq:Sequence, value[, pred:Fn]) ↦ Num
    //
    // Returns the number of occurrences of `value' in the given
    // sequence, optionally filtered by a predicate.
    //
    // If a predicate is not given, it'll consider a strict equality
    // comparison.
    //
    function count(seq, value, pred) { var result, i
        result = 0
        seq    = Object(seq)
        for (i = size(seq); i--;)
            if (i in seq)
                if (pred)  pred(value, seq[i]) && result++
                else       (value === seq[i])  && result++

        return result
    }



    //// -Acessing individual members //////////////////////////////////////////

    ///// Function first ///////////////////////////////////////////////////////
    //
    //   (seq:Sequence) ↦ *mixed*
    //
    // Returns the first element of the sequence.
    //
    function first(seq) {
        return sequencep(seq)?  seq[0]
        :                  undefined
    }

    ///// Function last ////////////////////////////////////////////////////////
    //
    //   (seq:Sequence) ↦ *mixed*
    //
    // Returns the last element of the sequence.
    //
    function last(seq) {
        return sequencep(seq)?  seq[seq.length - 1]
        :                  undefined
    }

    ///// Function nth /////////////////////////////////////////////////////////
    //
    //   (seq:Sequence, index:Num) ↦ *mixed*
    //
    // Returns the element at the given index in the sequence.
    //
    function nth(seq, index) {
        return sequencep(seq)?  seq[index]
        :                  undefined
    }

    ///// Function find_first //////////////////////////////////////////////////
    //
    //   (seq:Sequence[, pred:Fn][, ctx:Object]) ↦ *mixed*
    //
    // Returns the first element of the sequence to pass the predicate
    // function.
    //
    // If the predicate is not given, the function will return the first
    // non-null element from the sequence.
    //
    // A context may be given as the last argument; if so, the predicate
    // function will be called with the given object as the `[[this]]`.
    //
    function find_first(seq, pred, ctx) { var i
        pred = pred || not_nilp
        seq  = Object(seq)

        for (i = 0; i < size(seq); ++i)
            if (i in seq && pred.call(ctx, seq[i], i, seq))
                return seq[i]

        return undefined
    }

    ///// Function find_last ///////////////////////////////////////////////////
    //
    //   (seq:Sequence[, pred:Fn][, ctx:Object]) ↦ *mixed*
    //
    // Returns the last element of the sequence to pass the predicate
    // function.
    //
    // If the predicate is not given, the function will return the last
    // non-null element from the sequence.
    //
    // A context may be given as the last argument; if so, the predicate
    // function will be called with the given object as the `[[this]]`.
    //
    function find_last(seq, pred, ctx) { var i
        pred = pred || not_nilp
        seq  = Object(seq)

        for (i = size(seq); i--;)
            if (i in seq && pred.call(ctx, seq[i], i, seq))
                return seq[i]

        return undefined
    }



    //// -Extracting sections of a list ////////////////////////////////////////

    ///// Function slice ///////////////////////////////////////////////////////
    //
    //   (seq:Sequence[, start:Num][, end:Num]) ↦ Array
    //
    // Extracts a subsection of the sequence that goes from `start` to
    // `end`.
    //
    // When `start` is not given, the algorithm assumes the beginning of
    // the sequence. When `end` is not given, the algorithm assumes the last
    // item of the sequence.
    //
    // At any rate, `start` and `end` are included in the resulting
    // sublist.
    //
    // If negative indexes are passed as either `start` or `end`,
    // they're taken as a the difference from the length of the
    // sequence. That is, a -1 index means the last element, -2 the one
    // before the last, and so on.
    //
    function slice(seq, start, end) {
        return __slice.call(seq, start, end)
    }

    ///// Function rest ////////////////////////////////////////////////////////
    //
    //   (seq:Sequence) ↦ Array
    //
    // Returns a new array without the first element.
    //
    function rest(seq) {
        return slice(seq, 1)
    }

    ///// Function but_last ////////////////////////////////////////////////////
    //
    //   (seq:Sequence) ↦ Array
    //
    // Returns a new array without the last element.
    //
    function but_last(seq) {
        return slice(seq, 0, -1)
    }

    ///// Function drop ////////////////////////////////////////////////////////
    //
    //   (seq:Sequence, num:Num) ↦ Array
    //
    // Returns a array without the first `num` elements.
    //
    function drop(seq, num) {
        return slice(seq, __max(num, 0))
    }

    ///// Function keep ////////////////////////////////////////////////////////
    //
    //   (seq:Sequence, num:Num) ↦ Array
    //
    // Returns a array with just the first `num` elements.
    //
    function keep(seq, num) {
        return slice(seq, 0, num < 0? undefined : num)
    }


    //// -Extending lists //////////////////////////////////////////////////////

    ///// Function insert //////////////////////////////////////////////////////
    //
    //   (seq:Sequence, index:Num[, values...]) ↦ Array
    //
    // Returns a array with the given elements inserted at the given
    // index.
    //
    function insert(seq, index) { var values, result
        values = slice(arguments, 2)
        result = copy(seq)
        result.splice.apply(result, [index, 0].concat(values))

        return result
    }

    ///// Function cat /////////////////////////////////////////////////////////
    //
    //   (seq[, seqs...]) ↦ Array
    //
    // Returns an array with the given sequencess concatened.
    //
    function cat() {
        return reduce(arguments, function(result, seq) {
            if (!arrayp(result))                result = slice(result)
            if (!arrayp(seq) && sequencep(seq))  seq    = slice(seq)

            return result.concat(seq) })
    }


    //// -Structure handling ///////////////////////////////////////////////////

    ///// Function remove //////////////////////////////////////////////////////
    //
    //   (seq:Sequence, index:Num) ↦ Array
    //
    // Returns a array without the item at `index`.
    //
    function remove(seq, index) { var result
        result = copy(seq)
        result.splice(index, 1)
        return result
    }

    ///// Function without /////////////////////////////////////////////////////
    //
    //   (seq:Sequence, value[, pred:Fn]) ↦ Array
    //
    // Returns a array without elements that match `value`, with the
    // comparison optionally defined by a predicate function.
    //
    // If a predicate function is not given, the strict equality
    // comparison (`===`) will be used.
    //
    function without(seq, value, pred) {
        return filter(seq, function(item, index) {
            return pred?  !pred(value, item, index, seq)
            :        item !== value })
    }

    ///// Function compact /////////////////////////////////////////////////////
    //
    //   (seq:Sequence) ↦ Array
    //
    // Returns a array without null and undefined values in it.
    //
    function compact(seq) {
        return filter(seq, not_nilp)
    }

    ///// Function replace /////////////////////////////////////////////////////
    //
    //   (seq:Sequence, value, sub[, pred:Fn]) ↦ Array
    //
    // Returns an array with the elements tha match `value` replaced by
    // `sub`.
    //
    // If a predicate function is not given, the strict equality
    // comparison (`===`) will be used.
    //
    function replace(seq, value, sub, pred) {
        if (!callablep(pred))  pred = function(value, x) { return value === x }

        return map(seq, function(item, index) {
            return pred(value, item, index, seq)?  sub
            :                                 item })
    }

    ///// Function replace_at //////////////////////////////////////////////////
    //
    //   (seq:Sequence, index:Num, sub) ↦ Array
    //
    // Replaces the item at index by `sub`.
    //
    function replace_at(seq, index, sub) { var result
        result = copy(seq)
        result[index] = sub
        return result
    }

    ///// Function sorted //////////////////////////////////////////////////////
    //
    //   (seq:Sequence[, comparison:Fn]) ↦ Array
    //
    // Returns a sorted array according to the comparison function.
    //
    // If a comparison function is not given, the items will be sorted
    // lexographically.
    //
    function sorted(seq, comparison) {
        return copy(seq).sort(comparison)
    }

    ///// Function reversed ////////////////////////////////////////////////////
    //
    //   (seq:Sequence) ↦ Array
    //
    // Returns the a reversed representation of the sequence.
    //
    // That is, last items first, first items last.
    //
    function reversed(seq) {
        return copy(seq).reverse()
    }

    ///// Function flatten /////////////////////////////////////////////////////
    //
    //   (seq:Sequence) ↦ Array
    //
    // Returns an one dimensional array, by inlineing all sublists.
    //
    function flatten(seq) { var pending, result, item
        result  = []
        pending = slice(seq)
        while (item || pending.length) {
            if (!pending.length) break

            item = pending.shift()
            if (arrayp(item))
                pending.unshift.apply(pending, item)
            else if (sequencep(item))
                pending.unshift.apply(pending, to_array(item))
            else
                result.push(item) }

        return result
    }

    ///// Function zip /////////////////////////////////////////////////////////
    //
    //   (seq:Sequence...) ↦ Array
    //
    // Merges all sequences into one, such that any given index of the
    // resulting sequence is a sequence of the values at that index in
    // all the given sequences.
    //
    // :FIXME:
    //    come up with a description that does not suck monkey
    //    balls.
    //
    function zip() { var i, j, len, result, seqs, nseqs
        seqs   = compact(arguments)
        len    = size(first(seqs))
        nseqs  = size(seqs)
        result = []

        for (i = 0; i < len; ++i) {
            result[i] = []
            for (j = 0; j < nseqs; ++j)  result[i].push(seqs[j][i]) }

        return result
    }



    //// -Iteration through a list /////////////////////////////////////////////

    ///// Function map /////////////////////////////////////////////////////////
    //
    //   (seq:Sequence, pred:Fn[, ctx:Obj]) ↦ Array
    //
    // Returns a sequence with its elements transformed by the predicate
    // function.
    //
    function map(seq, pred, ctx) {
        return sequencep(seq)?  __map.call(seq, pred, ctx)
        :                  []
    }

    ///// Function each ////////////////////////////////////////////////////////
    //
    //   (seq:Sequence, pred:Fn[, ctx:Obj]) ↦
    //
    // Executes the predicate function for every item in the sequence.
    //
    function each(seq, pred, ctx) {
        return sequencep(seq)?  __each.call(seq, pred, ctx)
        :                  undefined
    }

    ///// Function filter //////////////////////////////////////////////////////
    //
    //   (seq:Sequence, pred:Fn[, ctx:Obj]) ↦ Array
    //
    // Returns a sequence without the elements that don't pass the predicate
    // test.
    //
    function filter(seq, pred, ctx) {
        return sequencep(seq)?  __filter.call(seq, pred, ctx)
        :                  []
    }

    ///// Function reduce //////////////////////////////////////////////////////
    //
    //   (seq:Sequence, pred:Fn[, initial][, ctx:Obj]) ↦ *mixed*
    //
    // Apply the predicate against each pair in the array (left to
    // right) so to return a single accumulated value.
    //
    // An starting value can be given, in which case the array will work
    // as if that item was inserted as the first element.
    //
    function reduce(seq, pred, initial, ctx) {
        if (objp(ctx))  pred = pred.bind(ctx)

        return sequencep(seq)?  __reduce.call(seq, pred, initial)
        :                  []
    }

    ///// Function reduce_right ////////////////////////////////////////////////
    //
    //   (seq:Sequence, pred:Fn[, initial][, ctx:Obj]) ↦ *mixed*
    //
    // Apply the predicate against each pair in the array (right to
    // left) so to return a single accumulated value.
    //
    // An starting value can be given, in which case the array will work
    // as if that item was inserted as the last element.
    //
    function reduce_right(seq, pred, initial, ctx) {
        if (objp(ctx))  pred = pred.bind(ctx)

        return sequencep(seq)?  __reduce_right.call(seq, pred, initial)
        :                  []
    }

    ///// Function some ////////////////////////////////////////////////////////
    //
    //   (seq:Sequence, pred:Fn[, ctx:Obj]) ↦ Boolean
    //
    // Checks whether some element in the array passes the predicate
    // function's test.
    //
    function some(seq, pred, ctx) {
        return sequencep(seq)?  __some.call(seq, pred, ctx)
        :                  false
    }

    ///// Function every ///////////////////////////////////////////////////////
    //
    //   (seq:Sequence, pred:Fn[, ctx:Obj]) ↦ Boolean
    //
    // Checks whether all of the elements in the array passes the
    // predicate function's test.
    //
    function every(seq, pred, ctx) {
        return sequencep(seq)?  __every.call(seq, pred, ctx)
        :                  false
    }



    //// -Special mapping functions ////////////////////////////////////////////

    ///// Function pluck ///////////////////////////////////////////////////////
    //
    //   (seq:Sequence, attr:String) ↦ Array
    //
    // Returns a sequence with all elements replaced by their attribute
    // `attr`.
    //
    // Non-object items are mapped to `undefined`.
    //
    function pluck(seq, attr) {
        return map(seq, function(value) {
            return objp(value)?  value[attr]
            :               undefined })
    }

    ///// Function invoke //////////////////////////////////////////////////////
    //
    //   (seq:Sequence, method:String[, args...]) ↦ Array
    //
    // Returns a sequence with the result of invoking the given method name
    // for all objects.
    //
    // Items that have no such method are mapped to `undefined`.
    //
    function invoke(seq, method) { var args
        args = slice(arguments, 2)

        return map(seq, function(value) {
            return nilp(value)?               undefined
            : callablep(value[method])?  value[method].apply(value, args)
            :                            undefined })
    }



    ///// Exports //////////////////////////////////////////////////////////////
    list = typeof exports == 'undefined'?  root.black.list = { }
         :                                 exports


    list.make_array   = make_array
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
    list.compact      = compact
    list.insert       = insert
    list.cat          = cat
    list.replace      = replace
    list.replace_at   = replace_at
    list.sorted       = sorted
    list.reversed     = reversed
    list.flatten      = flatten
    list.zip          = zip
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
    list.$black_utils = { make_array   : make_array
                        , range        : range
                        , to_array     : to_array
                        , first        : first
                        , last         : last
                        , nth          : nth
                        , but_last     : but_last
                        , drop         : drop
                        , keep         : keep
                        , sorted       : sorted
                        , reversed     : reversed
                        , flatten      : flatten
                        , zip          : zip
                        , map          : map
                        , each         : each
                        , filter       : filter
                        , reduce       : reduce
                        , reduce_right : reduce_right
                        , some         : some
                        , every        : every
                        , pluck        : pluck
                        , invoke       : invoke }
}(this)
