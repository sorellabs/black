////////////////////////////////////////////////////////////////////////////////
// Unit tests for the black.str module
//

str = require('../src/str')
require('claire')
test = claire.test

test('str:: make_str -> Str', function() {
    var make_str = str.make_str

    assert(make_str('foo') <eq> '')
    assert(make_str('foo', 2) <eq> 'foofoo')
    assert(make_str('foo', 1) <eq> 'foo')
    assert(make_str('foo', -1) <eq> '')
    assert(make_str('foo', 0) <eq> '')

    assert(make_str(['foo', 'bar'], 2) <eq> 'foo,barfoo,bar')
    assert(make_str(42, 2) <eq> '4242')
    assert(make_str({}, 2) <eq> '[object Object][object Object]')
})

test('str:: cat -> Str', function() {
    var cat = str.cat

    assert(cat() <eq> '')
    assert(cat('a',1,[2],{3:4}) <eq> 'a12[object Object]')
})

test('str:: capitalise -> Str', function() {
    var capitalise = str.capitalise

    assert(capitalise('---the. first.') <eq> '---The. first.')
    assert(capitalise('---the. first.', true) <eq> '---The. First.')
    assert(capitalise('-Fo:b&ar. bAZ.', true) <eq> '-Fo:B&Ar. Baz.')
})

test('str:: starts_withp -> Bool', function() {
    var starts_withp = str.starts_withp

    assert(starts_withp('foobar', 'foo'))
    refute(starts_withp('foobar', 'oob'))
})

test('str:: ends_withp -> Bool', function() {
    var ends_withp = str.ends_withp

    assert(ends_withp('foobar', 'bar'))
    refute(ends_withp('foobar', 'oba'))
})

test('str:: hasp -> Bool', function() {
    var hasp = str.hasp

    assert(hasp('foobar', 'bar'))
    assert(hasp('foobar', 'foo'))
    assert(hasp('foobar', 'ooba'))
})

test('str:: count -> Num', function() {
    var count = str.count

    assert(count('foobar', 'o') <eq> 2)
    assert(count('foobar', 'O') <eq> 0)
    assert(count('foobar', 'o', 3) <eq> 0)
    assert(count('foobar', 'o', 0, 2) <eq> 1)
    assert(count('foobar', 'o', 1, 3) <eq> 2)
    assert(count('foobar', 'o', -4) <eq> 1)
    assert(count('foobar', 'o', 2, -2) <eq> 1)
})

test('str:: dasherise -> Str', function() {
    var dasherise = str.dasherise

    assert(dasherise('foo  bar   baz') <eq> 'foo-bar-baz')
    assert(dasherise('   foo. Bar. Baz   ') <eq> 'foo.-Bar.-Baz')
})

test('str:: camelise -> Str', function() {
    var camelise = str.camelise

    assert(camelise('  foo   bar_baz-foo ') <eq> 'FooBarBazFoo ')
})



claire.run()
