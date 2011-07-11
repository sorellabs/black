///////////////////////////////////////////////////////////////////////////////
// Unit tests for black.list module
//

list   = require('../src/list')

require('claire')
test = claire.test

/// CONSTS
MAX_INT = Math.pow(2, 32)
seq     = {0: 1, 1: 2, 2: 3, 3: 4, length: 4}


//// Making lists //////////////////////////////////////////////////////////////
test('list:: Making lists : make_array -> Array', function() {
    var make_array = list.make_array

    // Unsupported sizes should always return an empty list
    assert(make_array(0)             <eq> [])
    assert(make_array(-1)            <eq> [])
    assert(make_array(MAX_INT)       <eq> [])

    // Whenever a default value isn't given, it should map to empty string
    assert(make_array(1)             <eq> [''])
    assert(make_array(3)             <eq> ['', '', ''])

    // If a default value is given, it should map elms to that value
    assert(make_array(1, 0)          <eq> [0])
    assert(make_array(3, null)       <eq> [null, null, null])
    assert(make_array(1, undefined)  <eq> [undefined])
    assert(make_array(1, make_array) <eq> [make_array])
})

test('list:: Making lists : range -> Array', function() {
    var range = list.range

    // Empty sequence
    assert(range(0, 0)     <eq> [])
    assert(range(3, 1)     <eq> [])

    // sequences with only start:end defined
    assert(range(0, 2)     <eq> [0, 1])
    assert(range(5, 9)     <eq> [5, 6, 7, 8])
    assert(0 in range(0, 2))
    assert(1 in range(0, 2))

    // sequences with step
    assert(range(0, 10, 2) <eq> [0, 2, 4, 6, 8])
    assert(range(0, 3, 5)  <eq> [0])
})

test('list:: Making lists : to_array -> Array', function() {
    var to_array = list.to_array

    // Empty sequences
    assert(to_array()                  <eq> [])
    assert(to_array(null)              <eq> [])
    assert(to_array(false)             <eq> [])
    assert(to_array(true)              <eq> [])
    assert(to_array(42)                <eq> [])
    assert(to_array(/foo/)             <eq> [])
    assert(to_array(to_array)          <eq> [])

    // Objects to sequence
    assert(to_array(seq)               <eq> [1, 2, 3, 4])
    assert(to_array(new String('foo')) <eq> ['f', 'o', 'o'])
})

test('list:: Making lists : copy -> Array', function() {
    var copy   = list.copy
    var nested = [1, [2, [3, [4]]]]
    var sparse = [1,,2,,3,,4]
    var sparse_seq = {0:1, 2:2, 4:3, 6:4, length:7}


    // Empty lists
    assert(copy()      <eq> [])
    assert(copy(null)  <eq> [])
    assert(copy(42)    <eq> [])
    assert(copy(/foo/) <eq> [])

    // Object -> Array
    assert(copy('foo') <eq> ['f', 'o', 'o'])
    assert(copy(seq)   <eq> [1, 2, 3, 4])
    assert(copy([1,2]) <eq> [1, 2])

    // Shallow copies
    var other = copy(nested)
    assert(other       <eq> [1, [2, [3, [4]]]])
    other[1][0] = 5
    assert(other       <eq> [1, [5, [3, [4]]]])

    // sparse sequences should be preserved
    assert(copy(sparse) <eq> sparse)
    assert(copy(sparse_seq) <eq> sparse)
})


// Extracting informations about a list
test('list:: List information : size -> Num', function() {
    var size = list.size

    // Empty lists
    assert(size([])     <eq> 0)
    assert(size({})     <eq> 0)
    assert(size()       <eq> 0)
    assert(size(1)      <eq> 0)
    assert(size(null)   <eq> 0)
    assert(size(true)   <eq> 0)
    assert(size(false)  <eq> 0)
    assert(size(/foo/)  <eq> 0)    	   

    // Objects as lists
    assert(size(seq)    <eq> 4)
    assert(size(size)   <eq> 1)
    assert(size('foo')  <eq> 3)

    // Actual arrays
    assert(size([1])    <eq> 1)
    assert(size([1, 2]) <eq> 2)
})

test('list:: List information : empty? -> Bool', function() {
    var emptyp = list.emptyp

    // Empty lists
    assert(emptyp([]))
    assert(emptyp({}))
    assert(emptyp())
    assert(emptyp(null))
    assert(emptyp(true))
    assert(emptyp(false))
    assert(emptyp(/foo/))

    // Non-empty lists
    refute(emptyp(seq))
    refute(emptyp(emptyp))
    refute(emptyp('foo'))
    refute(emptyp([1]))
    refute(emptyp([1, 2]))
})

test('list:: List information : has? -> Bool', function() {
    var hasp = list.hasp
    var even = list.range(0, 10, 2)
    function weak_equalp(value, elm) { return elm == value }


    // empty lists should always return false
    refute(hasp(0, 1))
    refute(hasp(null, 1))
    refute(hasp(/foo/, 2))
    refute(hasp(null, 1, function() { return true }))

    // Functions without predicate should rely on indexOf (===)
    assert(hasp(seq, 1))
    assert(hasp([1, 2], 2))
    assert(hasp('foo', 'f'))
    refute(hasp(seq, '1')) // different types

    // Functions with predicates
    assert(hasp(seq, '1', weak_equalp))
    assert(hasp(even, 2, function(x, y){ return x === y }))
})
    
test('list:: List information : count -> Num', function() {
    var count = list.count
    var ints  = list.range(0, 10)
    var lisp  = ['clojure', 'scheme', 'common lisp', 'PLT Scheme', 'arc', 'racket']
    var seq   = { 0: 'foo', 2: 'bar', 3: undefined, 4: 'baz', length: 5 }

    // Empty and non-sequences should always return 0
    assert(count(null, 0)                         <eq> 0)
    assert(count(0, 0)                            <eq> 0)
    assert(count(/foo/, 0)                        <eq> 0)
    assert(count(0, 0, function(){ return true }) <eq> 0)

    // Functions without a predicate should rely on ===
    assert(count(ints, 2)                         <eq> 1)
    assert(count(ints, '2')                       <eq> 0)
    assert(count(lisp, 'scheme')                  <eq> 1)
    assert(count('foo', 'o')                      <eq> 2)

    // Functions with predicates should be called only for set keys
    assert(count(seq, 'bar')                      <eq> 1)
    assert(count(seq, undefined)                  <eq> 1)
})


//// Acessing individual members
test('list:: List access : first -> *mixed*', function() {
    var first = list.first
    var nested= [1, [2, [3, [4]]]]

    // Empty or non-sequences should always return null
    assert(first(null)              <eq> null)
    assert(first(0)                 <eq> null)
    assert(first(undefined)         <eq> null)
    assert(first(false)             <eq> null)
    assert(first(true)              <eq> null)
    assert(first(/foo/)             <eq> null)

    // Objects
    assert(first(arguments)         <eq> undefined)
    assert(first('foo')             <eq> 'f')
    assert(first(new String('foo')) <eq> 'f')
    assert(first(seq)               <eq> 1)

    // Actual arrays
    assert(first(nested)            <eq> 1)
    assert(first(nested[1])         <eq> 2)
    assert(first([,1,2,3])          <eq> undefined)
    assert(first([1,2,,])           <eq> 1)
})

test('list:: List access : last -> *mixed*', function() {
    var last = list.last
    var nested= [1, [2, [3, [4]]]]

    // Empty or non-sequences should always return null
    assert(last(null)              <eq> null)
    assert(last(0)                 <eq> null)
    assert(last(undefined)         <eq> null)
    assert(last(false)             <eq> null)
    assert(last(true)              <eq> null)
    assert(last(/foo/)             <eq> null)

    // Objects
    assert(last(arguments)         <eq> undefined)
    assert(last('bar')             <eq> 'r')
    assert(last(new String('bar')) <eq> 'r')
    assert(last(seq)               <eq> 4)

    // Actual arrays
    assert(last(nested)            <eq> [2, [3, [4]]])
    assert(last(nested[1])         <eq> [3, [4]])
    assert(last([,1,2,3])          <eq> 3)
    assert(last([1,2,,])           <eq> undefined)
})

test('list:: List access : nth -> *mixed*', function() {
    var nth = list.nth
    var nested= [1, [2, [3, [4]]]]

    // Empty or non-sequences should always return null
    assert(nth(null, 0)              <eq> null)
    assert(nth(0, 0)                 <eq> null)
    assert(nth(undefined, 0)         <eq> null)
    assert(nth(false, 0)             <eq> null)
    assert(nth(true, 0)              <eq> null)
    assert(nth(/foo/, 0)             <eq> null)

    // Objects
    assert(nth(arguments, 0)         <eq> undefined)
    assert(nth('bar', 1)             <eq> 'a')
    assert(nth(new String('bar'), 1) <eq> 'a')
    assert(nth(seq, 1)               <eq> 2)

    // Actual arrays
    assert(nth(nested, 1)            <eq> [2, [3, [4]]])
    assert(nth(nth(nested, 1), 1)    <eq> [3, [4]])
    assert(nth([,1,2,3], 1)          <eq> 1)
    assert(nth([1,2,,], 2)           <eq> undefined)
})

test('list:: List access : find_first -> *mixed*', function() {
    function always()  { return true       }
    function even(x)   { return x % 2 == 0 }
    function arrayp(x) { return Array.isArray(x) }
    function upper(x)  { return x == x.toUpperCase()  }
    var find_first = list.find_first


    // empty or non-sequences should always return null
    assert(find_first(null)                             <eq> null)
    assert(find_first(0)                                <eq> null)
    assert(find_first(undefined)                        <eq> null)
    assert(find_first(false)                            <eq> null)
    assert(find_first(true)                             <eq> null)
    assert(find_first(/foo/)                            <eq> null)

    assert(find_first(null, always)                     <eq> null)
    assert(find_first(0, always)                        <eq> null)
    assert(find_first(undefined, always)                <eq> null)
    assert(find_first(false, always)                    <eq> null)
    assert(find_first(true, always)                     <eq> null)
    assert(find_first(/foo/, always)                    <eq> null)

    // Objects
    assert(find_first(seq)                              <eq> 1)
    assert(find_first(seq, even)                        <eq> 2)
    assert(find_first('bAR')                            <eq> 'b')
    assert(find_first('bAR', upper)                     <eq> 'A')
    assert(find_first(new String('bAR'))                <eq> 'b')
    assert(find_first(new String('bAR'), upper)         <eq> 'A')
    
    // Actual arrays
    assert(find_first([,,,,1,2,3])                      <eq> 1)
    assert(find_first([,,,,1,2,3], even)                <eq> 2)
    assert(find_first([,,1,2,[3,[4]], [5,[6]]], arrayp) <eq> [3, [4]])
})

test('list:: List access : find_last -> *mixed*', function() {
    function always()  { return true       }
    function even(x)   { return x % 2 == 0 }
    function arrayp(x) { return Array.isArray(x) }
    function upper(x)  { return x == x.toUpperCase()  }
    var find_last = list.find_last


    // empty or non-sequences should always return null
    assert(find_last(null)                           <eq> null)
    assert(find_last(0)                              <eq> null)
    assert(find_last(undefined)                      <eq> null)
    assert(find_last(false)                          <eq> null)
    assert(find_last(true)                           <eq> null)
    assert(find_last(/foo/)                          <eq> null)

    assert(find_last(null, always)                   <eq> null)
    assert(find_last(0, always)                      <eq> null)
    assert(find_last(undefined, always)              <eq> null)
    assert(find_last(false, always)                  <eq> null)
    assert(find_last(true, always)                   <eq> null)
    assert(find_last(/foo/, always)                  <eq> null)

    // Objects
    assert(find_last(seq)                            <eq> 4)
    assert(find_last(seq, even)                      <eq> 4)
    assert(find_last('BAr')                          <eq> 'r')
    assert(find_last('BAr', upper)                   <eq> 'A')
    assert(find_last(new String('BAr'))              <eq> 'r')
    assert(find_last(new String('BAr'), upper)       <eq> 'A')
    
    // Actual arrays
    assert(find_last([1,2,3,,,,])                    <eq> 3)
    assert(find_last([1,2,3,,,,], even)              <eq> 2)
    assert(find_last([1,2,[3,[4]], [5,[6]]], arrayp) <eq> [5, [6]])
})


// Extracting sections of a list
test('list:: List subsections : slice -> Array', function() {
    var slice = list.slice
    var array = [1, 2, 3, 4]

    // Non sequence should always return []
    assert(slice(null) <eq> [])
    assert(slice(0) <eq> [])
    assert(slice(undefined) <eq> [])
    assert(slice(false) <eq> [])
    assert(slice(true) <eq> [])
    assert(slice(/foo/) <eq> [])

    // Non valid ranges should always return []
    assert(slice(seq, 0, 0) <eq> [])
    assert(slice(seq, 3, 1) <eq> [])
    assert(slice(seq, 1, 1) <eq> [])

    // Objects should return an array nevertheless
    assert(slice(seq) <eq> [1, 2, 3, 4])
    assert(slice(seq, 1) <eq> [2, 3, 4])
    assert(slice(seq, 1, 3) <eq> [2, 3])
    assert(slice('foo') <eq> ['f', 'o', 'o'])
    assert(slice('foo', 1) <eq> ['o', 'o'])
    assert(slice('foo', 1, 2) <eq> ['o'])

    // Negative indexes should count from the end of the sequence
    assert(slice(seq, -1) <eq> [4])
    assert(slice(seq, 1, -1) <eq> [2, 3])
    assert(slice(seq, -3, -1) <eq> [2, 3])

    // Actual arrays should behave the same as objects
    assert(slice(array) <eq> [1, 2, 3, 4])
    assert(slice(array, 1) <eq> [2, 3, 4])
    assert(slice(array, 1, 3) <eq> [2, 3])
    assert(slice(array, -1) <eq> [4])
    assert(slice(array, 1, -1) <eq> [2, 3])
    assert(slice(array, -3, -1) <eq> [2, 3])

    // It should always return a new object
    assert(slice(array) !==  array)
})

test('list:: List subsections : rest -> Array', function() {
    var rest = list.rest
    var array = [1, 2, 3, 4]

    // Non-sequences should always return []
    assert(rest(null) <eq> [])
    assert(rest(0) <eq> [])
    assert(rest(undefined) <eq> [])
    assert(rest(false) <eq> [])
    assert(rest(true) <eq> [])
    assert(rest(/foo/) <eq> [])

    // Sequences should always return an actual array
    assert(rest(seq) <eq> [2, 3, 4])
    assert(rest('foo') <eq> ['o', 'o'])
    assert(rest(array) <eq> [2, 3, 4])

    // It should always return a new object
    assert(rest(array) !== array)
})

test('list:: List subsections : but_last -> Array', function() {
    var but_last = list.but_last
    var array = [1, 2, 3, 4]

    // Non-sequences should always return []
    assert(but_last(null) <eq> [])
    assert(but_last(0) <eq> [])
    assert(but_last(undefined) <eq> [])
    assert(but_last(false) <eq> [])
    assert(but_last(true) <eq> [])
    assert(but_last(/foo/) <eq> [])

    // Sequences should always return an actual array
    assert(but_last(seq) <eq> [1, 2, 3])
    assert(but_last('foo') <eq> ['f', 'o'])
    assert(but_last(array) <eq> [1, 2, 3])

    // It should always return a new object
    assert(but_last(array) !== array)
})

test('list:: List subsections : drop -> Array', function() {
    var drop = list.drop
    var array = [1, 2, 3, 4]

    // Non-sequences should always return []
    assert(drop(null, 1) <eq> [])
    assert(drop(0, 1) <eq> [])
    assert(drop(undefined, 1) <eq> [])
    assert(drop(false, 1) <eq> [])
    assert(drop(true, 1) <eq> [])
    assert(drop(/foo/, 1) <eq> [])

    // <= 0 should return the whole sequence
    assert(drop(seq, -1) <eq> [1, 2, 3, 4])
    assert(drop('foo', -1) <eq> ['f', 'o', 'o'])
    assert(drop(array, -1) <eq> [1, 2, 3, 4])
    assert(drop(seq, 0) <eq> [1, 2, 3, 4])
    assert(drop('foo', 0) <eq> ['f', 'o', 'o'])
    assert(drop(array, 0) <eq> [1, 2, 3, 4])

    // Items should be removed from the beginning
    assert(drop(seq, 1) <eq> [2, 3, 4])
    assert(drop('foo', 1) <eq> ['o', 'o'])
    assert(drop(array, 1) <eq> [2, 3, 4])


    // It should always return a new object
    assert(drop(array, 0) !== array)
})

test('list:: List subsections : keep -> Array', function() {
    var keep = list.keep
    var array = [1, 2, 3, 4]

    // Non-sequences should always return []
    assert(keep(null, 1) <eq> [])
    assert(keep(0, 1) <eq> [])
    assert(keep(undefined, 1) <eq> [])
    assert(keep(false, 1) <eq> [])
    assert(keep(true, 1) <eq> [])
    assert(keep(/foo/, 1) <eq> [])

    // <= 0 should return the whole sequence
    assert(keep(seq, -1) <eq> [1, 2, 3, 4])
    assert(keep('foo', -1) <eq> ['f', 'o', 'o'])
    assert(keep(array, -1) <eq> [1, 2, 3, 4])
    assert(keep(seq, 0) <eq> [])
    assert(keep('foo', 0) <eq> [])
    assert(keep(array, 0) <eq> [])

    // Items should be removed from the ending
    assert(keep(seq, 2) <eq> [1, 2])
    assert(keep('foo', 2) <eq> ['f', 'o'])
    assert(keep(array, 2) <eq> [1, 2])


    // It should always return a new object
    assert(keep(array, 0) !== array)
})

test('list:: List subsections : remove -> Array', function() {
    var remove = list.remove
    var array = [1, 2, 3, 4]

    // Non-sequences should always return []
    assert(remove(null, 1) <eq> [])
    assert(remove(0, 1) <eq> [])
    assert(remove(undefined, 1) <eq> [])
    assert(remove(false, 1) <eq> [])
    assert(remove(true, 1) <eq> [])
    assert(remove(/foo/, 1) <eq> [])

    // returns a new array without the item at index
    assert(remove(seq, 1) <eq> [1, 3, 4])
    assert(remove('foo', 1) <eq> ['f', 'o'])
    assert(remove(array, 1) <eq> [1, 3, 4])

    // should always return a new array
    assert(remove(array, 1) !== array)
})

test('list:: List subsections : without -> Array', function() {
    function close(x, y) { return Math.abs(x - y) <= 1 }
    function case_insensitive(x, y) { return x.toLowerCase() == y.toLowerCase() }
    var without = list.without
    var array = [1, 2, 3, 4, 3, 1]
    var lisp  = ['clojure', 'scheme', 'common lisp', 'PLT Scheme', 'arc', 'racket']

    // Non-sequences should always return []
    assert(without(null, 1) <eq> [])
    assert(without(0, 1) <eq> [])
    assert(without(undefined, 1) <eq> [])
    assert(without(false, 1) <eq> [])
    assert(without(true, 1) <eq> [])
    assert(without(/foo/, 1) <eq> [])

    // Should remove all the items that match
    assert(without(seq, 1) <eq> [2, 3, 4])
    assert(without('foo', 'o') <eq> ['f'])
    assert(without(array, 3) <eq> [1, 2, 4, 1])
    assert(without(seq, 2, close) <eq> [4])
    assert(without('FoO', 'o', case_insensitive) <eq> ['F'])

    // should always return a new array
    assert(without(array, 1) !== array)
})

test('list:: List subsections : compact -> Array', function() { 
    var compact = list.compact
    var array = [1,,2,,,3,,,,4]
    var seq = {0:1, 1:undefined, 2:2, 3:null, 6:3, length:7}

    // Non-sequences should always return []
    assert(compact(null) <eq> [])
    assert(compact(0) <eq> [])
    assert(compact(undefined) <eq> [])
    assert(compact(false) <eq> [])
    assert(compact(true) <eq> [])
    assert(compact(/foo/) <eq> [])

    // All undefined/null values should be removed
    assert(compact(seq) <eq> [1, 2, 3])
    assert(compact(array) <eq> [1, 2, 3, 4])
})

// Extending lists
test('list:: Extending lists : insert -> Array', function() {
    var insert = list.insert
    var array = [1,,2,,3,,4]
    var seq = {0:1, 2:2, 4: 3, length:5}

    // Non sequences should always return the inserted value
    assert(insert(null, 1, 1, 2)  <eq> [1, 2])
    assert(insert(0, 1, 1, 2) <eq> [1, 2])
    assert(insert(undefined, 1, 1, 2) <eq> [1, 2])
    assert(insert(false, 1, 1, 2) <eq> [1, 2])
    assert(insert(true, 1, 1, 2) <eq> [1, 2])
    assert(insert(/foo/, 1, 1, 2) <eq> [1, 2])

    // sequences should behave the same way as arrays
    assert(insert(array, 1, 1.5) <eq> [1, 1.5,, 2,, 3,, 4])
    assert(insert(seq, 1, 1.5) <eq> [1, 1.5,, 2,, 3])
})

test('list:: Extending lists : cat -> Array', function() {
    var cat = list.cat
    var array = [1, 2, 3]
    var seq = {0:1, 1: 2, 2: 3, length: 4}
    var primitives = [null, 0, undefined, false, true, /foo/]

    // non sequences should always return []
    assert(cat(null, 0, undefined, false, true, /foo/) <eq> primitives)

    // Sequences should concatenate just like arrays
    assert(cat(seq, seq) <eq> [1, 2, 3,, 1, 2, 3,,])
    assert(cat(seq, array) <eq> [1, 2, 3,, 1, 2, 3])
    assert(cat(array, array) <eq> [1, 2, 3, 1, 2, 3])
})

// Structure handling
test('list:: Structure handling : replace -> Array', function() {
    function numberp(y, x) {
        return {}.toString.call(x) == '[object Number]' && x === y }
    var replace = list.replace
    var array = [1, 2, 3, '2', 4]

    // non-sequences should always return []
    assert(replace(null, 1, 2) <eq> [])
    assert(replace(0, 1, 2) <eq> [])
    assert(replace(undefined, 1, 2) <eq> [])
    assert(replace(false, 1, 2) <eq> [])
    assert(replace(true, 1, 2) <eq> [])
    assert(replace(/foo/, 1, 2) <eq> [])

    // without a predicate, strict equality is assumed
    assert(replace(array, '2', 3.5) <eq> [1, 2, 3, 3.5, 4])
    assert(replace(seq, '1', 0) <eq> [1, 2, 3, 4])

    // with a predicate -> true the value should be replaced
    assert(replace(array, 2, null, numberp) <eq> [1, null, 3, '2', 4])
})

test('list:: Structure handling : replace_at -> Array', function() {
    var replace_at = list.replace_at
    var array = [1, 2, 3, 4]

    // non-sequences should always return [value]
    assert(replace_at(null, 1, 1) <eq> [,1])
    assert(replace_at(0, 1, 1) <eq> [,1])
    assert(replace_at(undefined, 1, 1) <eq> [,1])
    assert(replace_at(false, 1, 1) <eq> [,1])
    assert(replace_at(true, 1, 1) <eq> [,1])
    assert(replace_at(/foo/, 1, 1) <eq> [,1])

    // sequences should replace the item at index
    assert(replace_at(array, 1, null) <eq> [1, null, 3, 4])
    assert(replace_at(seq, 1, null) <eq> [1, null, 3, 4])
})

test('list:: Structure handling : sort -> Array', function() {
    function numsort(a, b) { return a - b }
    var sorted = list.sorted
    var array = [10,9,8,7,6,5,4,3,2,1]
    var seq = {0:2, 1:4, 2:8, 3:10, length:4}

    // non-sequences should always return []
    assert(sorted(null) <eq> [])
    assert(sorted(0) <eq> [])
    assert(sorted(undefined) <eq> [])
    assert(sorted(false) <eq> [])
    assert(sorted(true) <eq> [])
    assert(sorted(/foo/) <eq> [])
    
    // if a comparison function is not given, items should be sorted
    // lexographically.
    assert(sorted(seq) <eq> [10, 2, 4, 8])
    assert(sorted(array) <eq> [1, 10, 2, 3, 4, 5, 6, 7, 8, 9])

    // Things shouldn't be done in-place
    assert(sorted(array) !== array)

    // With a comparison function, -1 to sort before, other to sort
    // after
    assert(sorted(array, numsort) <eq> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    assert(sorted(seq, numsort) <eq> [2, 4, 8, 10])
})

test('list:: Structure handling : reversed -> Array', function() {
    var reversed = list.reversed
    var array = [1,2,3,4]
    var seq = {0:1,1:2,2:3,3:4,length:4}

    // non-sequences should always return []
    assert(reversed(null) <eq> [])
    assert(reversed(0) <eq> [])
    assert(reversed(undefined) <eq> [])
    assert(reversed(false) <eq> [])
    assert(reversed(true) <eq> [])
    assert(reversed(/foo/) <eq> [])

    // sequences should have their last item first, first item last.
    assert(reversed(array) <eq> [4, 3, 2, 1])
    assert(reversed(seq) <eq> [4, 3, 2, 1])

    // Things should never be done in-place
    assert(reversed(array) !== array)
})

test('list:: Structure handling : flatten -> Array', function() {
    var flatten = list.flatten
    var nested = [1, [2, [3, [4]]]]
    var nested_seq = {0:1, 1:{0:2, 1:{0:3, 1:{0:4,length:1}, length:2},
                              length:2}, length:2}

    // non-sequences should always return []
    assert(flatten(null) <eq> [])
    assert(flatten(0) <eq> [])
    assert(flatten(undefined) <eq> [])
    assert(flatten(false) <eq> [])
    assert(flatten(true) <eq> [])
    assert(flatten(/foo/) <eq> [])

    // nested sequences should be properly flattened
    assert(flatten(nested) <eq> [1, 2, 3, 4])
    assert(flatten(nested_seq) <eq> [1, 2, 3, 4])

    // nothing should be done in-place
    assert(flatten(nested) !== nested)
})

test('list:: Structure handling : zip -> Array', function() {
    var zip = list.zip
    var a1 = ['a', 'b', 'c']
    var a2 = [1, 2, 3, 4, 5, 6, 7, 8]
    var a3 = [0, 1]
    var zip3 = [['a', 1, 0], ['b', 2, 1], ['c', 3, undefined]]

    // Non-sequences should always be skipped
    assert(zip(null, 0, undefined, false, true, /foo/) <eq> [])
    assert(zip(a1, null) <eq> [['a'], ['b'], ['c']])

    // resulting array length is always 1st argument
    assert(zip(a3, a1) <eq> [[0, 'a'], [1, 'b']])
    assert(zip(a1, a2) <eq> [['a', 1], ['b', 2], ['c', 3]])
    assert(zip(a1, seq, a3) <eq> zip3)

    // nothing should be done in-place
    assert(zip(a1, a2, a3) !== a1)
    assert(zip(a1, a2, a3) !== a2)
    assert(zip(a1, a2, a3) !== a3)
})

// TODO: tests for array iteration functions

// Special mapping
test('list:: Special mapping : pluck -> Array', function() {
    var pluck = list.pluck
    var a1 = [{x:1}, {x:2}, {x:3}]

    // non-sequences should always return []
    assert(pluck(null, 'foo') <eq> [])
    assert(pluck(0, 'foo') <eq> [])
    assert(pluck(undefined, 'foo') <eq> [])
    assert(pluck(false, 'foo') <eq> [])
    assert(pluck(true, 'foo') <eq> [])
    assert(pluck(/foo/, 'foo') <eq> [])

    // otherwise should map to the property of each element in the list
    assert(pluck(a1, 'x') <eq> [1, 2, 3])
    assert(pluck(a1, 'foo') <eq> [undefined, undefined, undefined])

    // nothing should be in-place
    assert(pluck(a1, 'x') !== a1)
})

test('list:: Special mapping : invoke -> Array', function() {
    function foo(x){ return index + (x||0) }
    var invoke = list.invoke
    var index = 1
    var array = [{x:foo}, 2, {x:foo}, 3, {x:foo}]

    // non-sequences should always return []
    assert(invoke(null, 'x') <eq> [])
    assert(invoke(0, 'x') <eq> [])
    assert(invoke(undefined, 'x') <eq> [])
    assert(invoke(false, 'x') <eq> [])
    assert(invoke(true, 'x') <eq> [])
    assert(invoke(/foo/, 'x') <eq> [])

    // otherwise, replace with the result of funcall, or undef if not fn
    assert(invoke(array, 'x') <eq> [1, undefined, 1, undefined, 1])
    assert(invoke(array, 'x', 1) <eq> [2, undefined, 2, undefined, 2])

    // nothing should be in-place
    assert(invoke(array, 'x') !== array)
})

// Run the test cases
//claire.verbose = false
claire.run()
