/******************************************************************************
 *                                    ~fn~                                    *
 *                                  ‾‾‾‾‾‾‾‾                                  *
 * Function utilities.                                                        *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
void function (root) {

    var fn

    , slice = Array.prototype.slice


    ///// Function partial /////////////////////////////////////////////////////
    //
    //   (fn:Fn, args...) ↦ Fn
    //
    // Return a function that'll always have the given arguments
    // prepended to argument list passed to the function.
    //
    function partial(fn) {
        var args = slice.call(arguments, 1)
        return function() { return fn.apply(this, args.concat(slice.call(arguments))) }
    }


    ///// Function delay ///////////////////////////////////////////////////////
    //
    //   (fn:Fn, seconds:Num) ↦ Num
    //
    // Calls the function after the given number of seconds.
    //
    // Returns an ID to a timer, such that the call to the function can
    // be cancelled by passing that ID to `clearTimeout`.
    //
    function delay(fn, seconds) { var args
        args = slice.call(arguments, 2)
        if (args.length)  fn = fn.bind.apply(fn, args)

        return setTimeout(fn, seconds * 1000)
    }

    ///// Function defer ///////////////////////////////////////////////////////
    //
    //   (fn:Fn) ↦ Num
    //
    // Same as `delay`, but calls the function as soon as the engine is
    // not busy doing other things.
    //
    function defer(fn) { var args
        args = slice.call(arguments, 1)
        return delay.apply(this, [fn, 0].concat(args))
    }


    ///// Function wrap ////////////////////////////////////////////////////////
    //
    //   (fn:Fn[, wrapper:Fn]) ↦ Fn
    //
    // Returns a function that passes the given `wrapper` as the first
    // argument for `fn`.
    //
    function wrap(fn, wrapper) {
        if (!wrapper)
            wrapper = function(f){ f.apply(this, slice.call(arguments, 1)) }

        return partial(wrapper, fn)
    }



    ///// Exports //////////////////////////////////////////////////////////////
    fn = typeof exports == 'undefined'?  root.black.fn = { }
       :                                 exports

    fn.partial = partial
    fn.delay   = delay
    fn.defer   = defer
    fn.wrap    = wrap

    fn.$black_box    = Function
    fn.$black_proto  = Function.prototype
    fn.$black_utils  = { partial : partial
                       , delay   : delay
                       , defer   : defer
                       , wrap    : wrap }
}(this)
