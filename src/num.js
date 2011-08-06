/******************************************************************************
 *                                ~black.num~                                 *
 *                              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                               *
 * Numeric utilities.                                                         *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
void function (root) {

    var num
      , floor = Math.floor
      , round = Math.round

    ///// Function clamp ///////////////////////////////////////////////////////
    //
    //   (num:Num, min:Num, max:Num) ↦ Num
    //
    // Returns the nearest number within the given boundaries.
    //
    function clamp(num, min, max) {
        return num < min?  min
        : num > max?  max
        :             num
    }

    ///// Function wrap ////////////////////////////////////////////////////////
    //
    //   (num:Num, min:Num, max:Num) ↦ Num
    //
    // Keeps a number within the given boundaries, but if the given
    // number exceeds it, it wraps around.
    //
    function wrap(num, min, max) {
        return num - floor((num - min) / (max - min)) * (max - min)
    }

    ///// Function snap ////////////////////////////////////////////////////////
    //
    //   (num:Num, step:Num) ↦ Num
    //
    // Snaps the number to the nearest number in the arithmetic
    // progression with the given step size.
    //
    function snap(num, step) {
        return round(num / step) * step
    }

    ///// Function pad /////////////////////////////////////////////////////////
    //
    //   (num:Num, size:Num) ↦ Str
    //
    // Prefixes a number with zeroes, such that it always has the given
    // size.
    //
    function pad(num, size) { var result
        result = String(num)
        return result.length >= size?  result
        :                        Array(size).join('0') + result
    }


    //// Exports ///////////////////////////////////////////////////////////////
    num = typeof exports == 'undefined'?  root.black.num = { }
        :                                 exports

    num.clamp        = clamp
    num.wrap         = wrap
    num.snap         = snap
    num.pad          = pad

    num.$black_box   = Number
    num.$black_proto = Number.prototype
    num.$black_utils = { clamp: clamp
                       , wrap:  wrap
                       , snap:  snap
                       , pad:   pad }
}(this)
