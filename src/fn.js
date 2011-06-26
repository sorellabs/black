/******************************************************************************
 *                                    ~fn~                                    *
 *                                  ‾‾‾‾‾‾‾‾                                  *
 * Function utilities.                                                        *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
void function (root) { var __old, fn

    , slice = Array.prototype.slice


    function partial(fn) { 
        return fn.bind.apply(fn, slice.call(arguments, 1))
    }

    function delay(fn, seconds) { var args
        args = slice.call(arguments, 2)
        if (args.length)  fn = fn.bind.apply(fn, args)

        return setTimeout(fn, seconds * 1000)
    }

    function defer(fn) { var args
        args = slice.call(arguments, 1)
        return delay.apply(this, [fn, 0].concat(args))
    }

    function wrap(fn, wrapper) {
        return function() {
            return wrapper.apply(this, [fn].concat(arguments)) }            
    }
    


    ///// Exports //////////////////////////////////////////////////////////////
    fn = typeof exports == 'undefined'? root.black.fn = { }
                                      : exports

    fn.partial = partial
    fn.delay   = delay
    fn.defer   = defer
    fn.wrap    = wrap

    fn.$box    = Function
    fn.$proto  = Function.prototype
    fn.$utils  = { partial: partial
                 , delay:   delay
                 , defer:   defer
                 , wrap:    wrap }

}(this)
