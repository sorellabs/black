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
    assert(make_array(0)       <eq> [])
    assert(make_array(-1)      <eq> [])
    assert(make_array(MAX_INT) <eq> [])

    // Whenever a default value isn't given, it should map to empty string
    assert(make_array(1) <eq> [''])
    assert(make_array(3) <eq> ['', '', ''])

    // If a default value is given, it should map elms to that value
    assert(make_array(1, 0)          <eq> [0])
    assert(make_array(3, null)       <eq> [null, null, null])
    assert(make_array(1, undefined)  <eq> [undefined])
    assert(make_array(1, make_array) <eq> [make_array])
})

test('Making lists : range -> Array', function() {
    var range = list.range

    // Empty sequence
    assert(range(0, 0) <eq> [])
    assert(range(3, 1) <eq> [])

    // sequences with only start:end defined
    assert(range(0, 2) <eq> [0, 1])
    assert(range(5, 9) <eq> [5, 6, 7, 8])
    assert(0 in range(0, 2))
    assert(1 in range(0, 2))

    // sequences with step
    assert(range(0, 10, 2) <eq> [0, 2, 4, 6, 8])
    assert(range(0, 3, 5)  <eq> [0])
})

test('Making lists : to_array -> Array', function() {
    var to_array = list.to_array

    // Empty sequences
    assert(to_array()         <eq> [])
    assert(to_array(null)     <eq> [])
    assert(to_array(false)    <eq> [])
    assert(to_array(true)     <eq> [])
    assert(to_array(42)       <eq> [])
    assert(to_array(/foo/)    <eq> [])
    assert(to_array(to_array) <eq> [])

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
    assert(other <eq> [1, [2, [3, [4]]]])
    other[1][0] = 5
    assert(other <eq> [1, [5, [3, [4]]]])
})


// Extracting informations about a list
test('List information : size -> Num', function() {
    var size = list.size

    // Empty lists
    assert(size([])     == 0)
    assert(size({})     == 0)
    assert(size()       == 0)
    assert(size(1)      == 0)
    assert(size(null)   == 0)
    assert(size(true)   == 0)
    assert(size(false)  == 0)
    assert(size(/foo/)  == 0)    	   

    // Objects as lists
    assert(size(seq)    == 4)
    assert(size(size)   == 1)
    assert(size('foo')  == 3)

    // Actual arrays
    assert(size([1])    == 1)
    assert(size([1, 2]) == 2)
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
    assert(!emptyp(seq))
    assert(!emptyp(emptyp))
    assert(!emptyp('foo'))
    assert(!emptyp([1]))
    assert(!emptyp([1, 2]))
})

test('List information : has? -> Bool', function() {
    var hasp = list.hasp
    function weak_equalp(value, elm) { return elm == value }


    // empty lists should always return false
    assert(!hasp(0, 1))
    assert(!hasp(null, 1))
    assert(!hasp(/foo/, 2))
    assert(!hasp(null, 1, function() { return true }))

    // Functions without predicate should rely on indexOf (===)
    assert(hasp(seq, 1))
    assert(hasp([1, 2], 2))
    assert(hasp('foo', 'f'))
    assert(!hasp(seq, '1')) // different types

    // Functions with predicates
    assert(hasp(seq, '1', weak_equalp))
})
    

// Run the test cases
claire.run()