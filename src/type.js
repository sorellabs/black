/******************************************************************************
 *                                   ~type~                                   *
 *                                 ‾‾‾‾‾‾‾‾‾‾                                 *
 * Type and functionality testing.                                            *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/

/// Module type ////////////////////////////////////////////////////////////////
void function (root) {

    var type

      , __class = Object.prototype.toString


    //// -Type checking ////////////////////////////////////////////////////////

    ///// Function class_of ////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ String
    //
    // Returns the internal `[[Class]]` of the given object.
    //
    function class_of(obj) {
        return __class.call(obj).slice(8, -1)
    }

    ///// Function nilp ////////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object does not point to anything valid.
    //
    // That is, whether something is `null` or `undefined`.
    //
    function nilp(obj) {
        return obj == null
    }

    ///// Function not_nilp ////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object points to anything valid.
    //
    // That is, whether something is not `null` nor `undefined`.
    //
    function not_nilp(obj) {
        return obj != null
    }

    ///// Function undefp //////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object is undefined.
    //
    function undefp(obj) {
        return obj === void 0
    }

    ///// Function strp ////////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object is a string.
    //
    function strp(obj) {
        return class_of(obj) == 'String'
    }

    ///// Function nump ////////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object is a number.
    //
    function nump(obj) {
        return class_of(obj) == 'Number'
    }

    ///// Function regexpp /////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object is a regular expression.
    //
    function regexpp(obj) {
        return class_of(obj) == 'RegExp'
    }

    ///// Function fnp /////////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object is a function.
    //
    function fnp(obj) {
        return class_of(obj) == 'Function'
    }

    ///// Function boolp ///////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object is a boolean.
    //
    function boolp(obj) {
        return class_of(obj) == 'Boolean'
    }

    ///// Function objp ////////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object is an actual object.
    //
    // In other words, it checks if the object is not a primitive or an
    // invalid value.
    //
    function objp(obj) {
        return obj === Object(obj)
    }

    ///// Function listp ///////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object is an actual array.
    //
    // :alias: Array.isArray



    //// -Interface testing ////////////////////////////////////////////////////

    ///// Function callablep ///////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object can be used as a function.
    //
    function callablep(obj) {
        return typeof obj == 'function'
    }

    ///// Function numericp ////////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object can be used as a number.
    //
    // A numeric object is something that does not evaluate to `NaN`, so
    // a string that holds a numeric value, and a list that holds a
    // single numeric element are considered numeric.
    //
    function numericp(obj) {
        return !isNaN(obj)
    }

    ///// Function sequencep ///////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object can be used as an array.
    //
    // A sequence object is something that implements a `length`
    // property, but not necessarily the methods you'd see in
    // Array.prototype.
    //
    // As such, things like the `arguments` object and `HTMLCollection`
    // are considered sequences.
    //
    function sequencep(obj) {
        return not_nilp(obj)
        && typeof obj.length == 'number'
    }


    //// -Functionality testing ////////////////////////////////////////////////

    ///// Function sliceablep //////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object implements a `slice` method.
    //
    function sliceablep(obj) {
        return not_nilp(obj)
        && typeof obj.slice == 'function'
    }

    ///// Function searchablep /////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object implements search methods that return indexes.
    //
    // Basically, we look for things that can be searched through the
    // `indexOf` and `lastIndexOf` methods.
    //
    // Arrays and Strings are considered searchable.
    //
    function searchablep(obj) {
        return not_nilp(obj)
        && typeof obj.indexOf     == 'function'
        && typeof obj.lastIndexOf == 'function'
    }

    ///// Function testablep ///////////////////////////////////////////////////
    //
    //   (obj:Obj) ↦ Bool
    //
    // Checks if the object implements a `test` method.
    //
    // A `test` method should take a regexp and return a boolean.
    //
    function testablep(obj) {
        return not_nilp(obj)
        && typeof obj.test == 'function'
    }


    ///// Exports //////////////////////////////////////////////////////////////
    type = typeof exports == 'undefined'?  root.black.type
                                        :  exports

    type.class_of     = class_of
    type.nilp         = nilp
    type.not_nilp     = not_nilp
    type.undefp       = undefp
    type.strp         = strp
    type.nump         = nump
    type.regexpp      = regexpp
    type.fnp          = fnp
    type.boolp        = boolp
    type.objp         = objp
    type.listp        = Array.isArray
    type.callablep    = callablep
    type.numericp     = numericp
    type.sequencep    = sequencep
    type.sliceablep   = sliceablep
    type.searchablep  = searchablep
    type.testablep    = testablep

    type.$black_box   = Object
    type.$black_utils = { class_of     : class_of
                        , nilp         : nilp
                        , not_nilp     : not_nilp
                        , undefp       : undefp
                        , strp         : strp
                        , nump         : nump
                        , regexpp      : regexpp
                        , fnp          : fnp
                        , boolp        : boolp
                        , objp         : objp
                        , listp        : Array.isArray
                        , callablep    : callablep
                        , numericp     : numericp
                        , sliceablep   : sliceablep
                        , searcheablep : searchablep
                        , testablep    : testablep }
                          
}(this)
