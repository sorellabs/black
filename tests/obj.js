////////////////////////////////////////////////////////////////////////////////
// Unit tests for black.obj module
//

obj = require('../src/obj')
require('claire')
test = claire.test
foo = {bar:'baz'}
bar = Object.create(foo)
bar.baz = 'foo'


test('obj:: hasp -> Bool', function() {
    var hasp = obj.hasp

    assert(hasp(foo, 'bar'))
    assert(hasp(bar, 'baz'))
    refute(hasp(bar, 'bar'))    
})

test('obj:: emptyp -> Bool', function() {
    var emptyp = obj.emptyp
    
    refute(emptyp(foo))
    refute(emptyp(bar))
    assert(emptyp({}))
    assert(emptyp(Object.create(bar)))
    assert(emptyp(Object.create(null)))           
})

test('obj:: size -> Bool', function() {
    var size = obj.size

    assert(size(foo) <eq> 1)
    assert(size(bar) <eq> 1)
    assert(size({}) <eq> 0)
    assert(size(Object.create(foo)) <eq> 0)
})

test('obj:: values -> Array', function() {
    var values = obj.values

    assert(values(foo) <eq> ['baz'])
    assert(values(bar) <eq> ['foo'])
    assert(values({}) <eq> [])
    assert(values(Object.create(foo)) <eq> [])
})

test('obj:: items -> Array', function() {
    var items = obj.items
    var baz = Object.create(foo)
    baz.bar = 'foo'

    assert(items(foo) <eq> [['bar','baz']])
    assert(items(bar) <eq> [['baz','foo']])
    assert(items({}) <eq> [])
    assert(items(baz) <eq> [['bar','foo']])
})

test('obj:: get -> *mixed*', function() {
    var get = obj.get
    var ownp = obj.hasp

    assert(get(foo, 'bar') <eq> 'baz')
    assert(get(foo, 'baz') <eq> undefined)
    assert(get(foo, 'baz', 'baz') <eq> 'baz')
    assert(get(foo, 'bar', 'baz', Array.isArray) <eq> 'baz')

    assert(get(bar, 'baz') <eq> 'foo')
    assert(get(bar, 'bar') <eq> 'baz')
    assert(get(bar, 'bar', 'foo', ownp) <eq> 'foo')
    assert(get(bar, 'bar', 'foo', isNaN) <eq> 'baz')
})

test('obj:: set-default -> *mixed*', function() {
    var set_default = obj.set_default

    assert(set_default(foo, 'bar', 'foo') <eq> 'baz')
    assert(set_default(foo, 'bar', 'foo', Array.isArray) <eq> 'foo')
    assert(set_default(bar, 'bar', 'bar') <eq> 'bar')
   
    delete bar['bar']
    foo['bar'] = 'baz'
})

test('obj:: nextend -> Obj', function() {
    var nextend = obj.nextend

    assert(nextend(foo, {foo:'bar'}) <eq> {foo:'bar', bar:'baz'})
    assert(bar.foo <eq> 'bar')
    
    nextend({}, foo, bar)
    refute('baz' in foo)
})

test('obj:: extend -> Obj', function() {
    var extend = obj.extend

    extend(foo, bar)
    refute('baz' in foo)
})



claire.run()
