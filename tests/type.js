////////////////////////////////////////////////////////////////////////////////
// Unit tests for black.type module
//

type = require('../src/type')
require('claire')
test = claire.test


// Type checking
test('type:: Type checking : class_of -> String', function() {
    var class_of = type.class_of

    assert(class_of(0) <eq> 'Number')
    assert(class_of(new Number(0)) <eq> 'Number')
    assert(class_of(NaN) <eq> 'Number')
    assert(class_of(false) <eq> 'Boolean')
    assert(class_of(new Boolean(false)) <eq> 'Boolean')
    assert(class_of('foo') <eq> 'String')
    assert(class_of(new String('foo')) <eq> 'String')
    assert(class_of(/foo/) <eq> 'RegExp')
    assert(class_of(new RegExp('foo')) <eq> 'RegExp')
    assert(class_of([]) <eq> 'Array')
    assert(class_of(new Array) <eq> 'Array')
    assert(class_of({}) <eq> 'Object')
    assert(class_of(new Object) <eq> 'Object')
    assert(class_of(class_of) <eq> 'Function')
    assert(class_of(new Function) <eq> 'Function')
    assert(class_of(new Date) <eq> 'Date')
    assert(class_of(arguments) <eq> 'Arguments')
})

test('type:: Type checking : nilp -> Bool', function() {
    var nilp = type.nilp

    assert(nilp(null))
    assert(nilp(undefined))
    refute(nilp(false))
    refute(nilp(0))
    refute(nilp(''))
    refute(nilp(NaN))
})

test('type:: Type checking : not_nilp -> Bool', function() {
    var not_nilp = type.not_nilp

    assert(not_nilp(0))
    assert(not_nilp(false))
    assert(not_nilp(''))
    assert(not_nilp(NaN))
    refute(not_nilp(null))
    refute(not_nilp(undefined))
})

test('type:: Type checking : undefp -> Bool', function() {
    var undefp = type.undefp

    assert(undefp(undefined))
    refute(undefp(null))
    refute(undefp(0))
    refute(undefp(false))
    refute(undefp(''))
    refute(undefp(NaN))
})

test('type:: Type checking : strp -> Bool', function() {
    var strp = type.strp

    assert(strp(''))
    assert(strp(new String('')))
})

test('type:: Type checking : nump -> Bool', function() {
    var nump = type.nump

    assert(nump(0))
    assert(nump(new Number(0)))
})

test('type:: Type checking : regexpp -> Bool', function() {
    var regexpp = type.regexpp

    assert(regexpp(/foo/))
    assert(regexpp(new RegExp('foo')))
})

test('type:: Type checking : fnp -> Bool', function() {
    var fnp = type.fnp

    assert(fnp(fnp))
    assert(fnp(new Function))
})

test('type:: Type checking : boolp -> Bool', function() {
    var boolp = type.boolp

    assert(boolp(true))
    assert(boolp(false))
    assert(boolp(new Boolean(true)))
    assert(boolp(new Boolean(false)))

    refute(boolp(0))
    refute(boolp(''))
    refute(boolp(null))
    refute(boolp(undefined))
    refute(boolp(NaN))
})

test('type:: Type checking : objp -> Bool', function() {
    var objp = type.objp

    refute(objp(''))
    refute(objp(null))
    refute(objp(undefined))
    refute(objp(NaN))
    refute(objp(0))
    refute(objp(false))
    refute(objp(true))

    assert(objp(new String))
    assert(objp(new Boolean))
    assert(objp(new Number))
    assert(objp([]))
    assert(objp(objp))
    assert(objp(arguments))
    assert(objp({}))
    assert(objp(/foo/))
})

// Interface testing
test('type:: Interface testing : callablep -> Bool', function() {
    var callablep = type.callablep
    var callable_regexp = false
    try { /foo/('foo'); callable_regexp = true } catch(e) { }
    
    assert(callablep(callablep))
    assert(callablep(new Function))
    if (callable_regexp)
        assert(callablep(/foo/))
})

test('type:: Interface testing : numericp -> Bool', function() {
    var numericp = type.numericp

    assert(numericp(0))
    assert(numericp(new Number(0)))
    assert(numericp('0'))
    assert(numericp('   12'))
    assert(numericp([0]))
    assert(numericp(new String('12')))

    refute(numericp(NaN))
    refute(numericp('foo'))
    refute(numericp([1, 2]))
})

test('type:: Interface testing : sequencep -> Bool', function() {
    var sequencep = type.sequencep

    assert(sequencep('foo'))
    assert(sequencep([1, 2, 3]))
    assert(sequencep({0:1,length:1}))
    assert(sequencep(arguments))
    assert(sequencep(new String('foo')))
    assert(sequencep(sequencep))
    assert(sequencep({length:1}))

    refute(sequencep({}))
    refute(sequencep({length:true}))
    refute(sequencep({length:'10'}))
})

// Functionality testing
test('type:: Functionality testing : sliceablep -> Bool', function() {
    var sliceablep = type.sliceablep

    assert(sliceablep('foo'))
    assert(sliceablep([1, 2, 3]))
    assert(sliceablep(new String('foo')))
    assert(sliceablep({slice:test}))

    refute(sliceablep({slice:true}))
})

test('type:: Functionality testing : searchablep -> Bool', function() {
    var searchablep = type.searchablep

    assert(searchablep('foo'))
    assert(searchablep([1, 2, 3]))
    assert(searchablep({indexOf:test, lastIndexOf:test}))

    refute(searchablep({indexOf:test}))
    refute(searchablep({indexOf:test, lastIndexOf:true}))
})

test('type:: Functionality testing : testablep -> Bool', function() {
    var testablep = type.testablep

    assert(testablep(/foo/))
    assert(testablep({test: testablep}))
        
    refute(testablep({}))
    refute(testablep({test: 1}))
})
    

// Run the test case.
claire.run()