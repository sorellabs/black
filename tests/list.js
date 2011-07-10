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
test('Making lists : make_array -> Array', function() {
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

test('Making lists : range -> Array', function() {
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

test('Making lists : to_array -> Array', function() {
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

test('Making lists : copy -> Array', function() {
    var copy   = list.copy
    var nested = [1, [2, [3, [4]]]]

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
})


// Extracting informations about a list
test('List information : size -> Num', function() {
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

test('List information : empty? -> Bool', function() {
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

test('List information : has? -> Bool', function() {
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
    
test('List information : count -> Num', function() {
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
test('List access : first -> *mixed*', function() {
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

test('List access : last -> *mixed*', function() {
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

test('List access : nth -> *mixed*', function() {
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

test('List access : find_first -> *mixed*', function() {
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

test('List access : find_last -> *mixed*', function() {
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
test('List subsections : slice -> Array', function() {
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



// Run the test cases
//claire.verbose = false
claire.run()
