/******************************************************************************
 *                                   ~str~                                    *
 *                                 ‾‾‾‾‾‾‾‾‾                                  *
 * String utilities                                                           *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
void function (root) {

    var __old, str

    , type = typeof require == 'function'?  require('./type') : black.type

    , __char_code = String.prototype.charCodeAt
    , __char      = String.fromCharCode
    , __concat    = String.prototype.concat
    , __lower     = String.prototype.toLowerCase
    , __upper     = String.prototype.toUpperCase
    , __find      = String.prototype.indexOf
    , __findr     = String.prototype.lastIndexOf
    , __trim      = String.prototype.trim
    , __slice     = String.prototype.slice
    , __match     = String.prototype.match
    , __replace   = String.prototype.replace
    , __split     = String.prototype.split


    , strp = type.strp


    ///// Function ord /////////////////////////////////////////////////////////
    //
    //   (str:Str[, index:Num]) ↦ Num
    // 
    // Converts a character to its numeric representation.
    //
    function ord(str, index) {
        return __char_code.call(str, index || 0)
    }

    ///// Function chr /////////////////////////////////////////////////////////
    //
    //   (code:Num) ↦ String
    // 
    // Converts a numeric representation of a character to an actual
    // string with that character.
    //
    function chr(code) {
        return __char(code)
    }

    ///// Function make_str ////////////////////////////////////////////////////
    //
    //   (str:Str[, times:Num]) ↦ Str
    // 
    // Returns an string by repeating `str` the given number of times.
    //
    function make_str(str, times) {
        return times <= 0?  ''
                         :  Array(times + 1).join(str)
    }

    ///// Function cat /////////////////////////////////////////////////////////
    //
    //   (strings:Str...) ↦ Str
    // 
    // Combines all given strings together.
    //
    function cat() {
        return __concat.apply('', arguments)
    }



    ///// Function upcase //////////////////////////////////////////////////////
    //
    //   (str:Str) ↦ Str
    // 
    // Converts all characters in the given string to UPPER CASE.
    //
    function upcase(str) {
        return __upper.call(str)
    }

    ///// Function downcase ////////////////////////////////////////////////////
    //
    //   (str:Str) ↦ Str
    // 
    // Converts all characters in the given string to lower case.
    //
    function downcase(str) {
        return __lower.call(str)
    }

    ///// Function trim ////////////////////////////////////////////////////////
    //
    //   (str:Str) ↦ Str
    // 
    // Strips all whitespace from both ends of the string.
    //
    function trim(str) {
        return __trim.call(str)
    }



    ///// Function starts_with /////////////////////////////////////////////////
    //
    //   (str:Str, substr:Str) ↦ Bool
    // 
    // Checks if a string starts with a piece of text.
    //
    function starts_with(str, substr) {
        return find(str, substr) == 0
    }

    ///// Function ends_with ///////////////////////////////////////////////////
    //
    //   (str:Str, substr:Str) ↦ Bool
    // 
    // Checks if a string ends with a piece of text.
    //
    function ends_with(str, substr) {
        return slice(str, str.length - substr.length) == substr
    }

    ///// Function hasp ////////////////////////////////////////////////////////
    //
    //   (str:Str, substr:Substr) ↦ Bool
    // 
    // Checks if the given string contains the substring.
    //
    function hasp(str, substr) {
        return !!~find(str, substr)
    }

    ///// Function count ///////////////////////////////////////////////////////
    //
    //   (str:Str, substr:Str[, start:Num][, end:Num]) ↦ Num
    // 
    // Counts the number of ocurrences of a substring.
    // 
    // If start and end are given, only that small part of the string
    // will be searched.
    //
    function count(str, substr, start, end) { var result, pos
        function next(){ return find(str, substr, pos + 1) }
        if (start != null)  str = slice(str, start, end)

        result = 0
        pos    = -1
        while (~(pos = next()))  result++
        return result
    }
    

    ///// Function find ////////////////////////////////////////////////////////
    //
    //   (str:Str, substr:Str[, start:Num]) ↦ Num
    // 
    // Returns the index in which `substr' can be found in `str`, or -1
    // if it can't find `substr`.
    //
    function find(str, substr, start) {
        return __find.call(str, substr, start)
    }

    ///// Function find_last ///////////////////////////////////////////////////
    //
    //   (str:Str, substr:Str[, start:Num]) ↦ Num
    // 
    // Returns the index in which `substr` can be found in `str`, or -1
    // if it can't find `substr`.
    // 
    // The search is performed from right to left.
    //
    function find_last(str, substr, start) {
        return __findr.call(str, substr, start)
    }

    ///// Function slice ///////////////////////////////////////////////////////
    //
    //   (str:Str[, start:Num][, end:Num]) ↦ Str
    // 
    // Returns a substring out of the string.
    //
    function slice(str, start, end) {
        return __slice.call(str, start, end)
    }

    ///// Function split ///////////////////////////////////////////////////////
    //
    //   (str:Str[, separator:Str][, limit:Num]) ↦ Array
    // 
    // Splits the string at each separator, up to the limit specified.
    //
    function split(str, separator, limit) {
        return __split.call(str, separator, limit)
    }



    ///// Function match ///////////////////////////////////////////////////////
    //
    //   (str:Str, regexp:RegExp) ↦ Array
    // 
    // Returns an array of match groups from the given regexp.
    //
    function match(str, regexp) {
        return __match.call(str, regexp)
    }

    ///// Function replace /////////////////////////////////////////////////////
    //
    //   (str:Str, substr:Str|RegExp, replacement:Str|Fn) ↦ Str
    // 
    // Replaces the occurrences of substr across the string.
    //
    function replace(str, substr, replacement) {
        return __replace.call(str, substr, replacement)
    }

    



    ///// Exports //////////////////////////////////////////////////////////////
    str = typeof exports == 'undefined'?  root.black.str = { }
                                       :  exports

    str.ord         = ord
    str.chr         = chr
    str.make_str    = make_str
    str.cat         = cat
    str.upcase      = upcase
    str.downcase    = downcase
    str.trim        = trim
    str.starts_with = starts_with
    str.ends_with   = ends_with
    str.hasp        = hasp
    str.count       = count
    str.find        = find
    str.find_last   = find_last
    str.slice       = slice
    str.split       = split
    str.match       = match
    str.replace     = replace

    str.$black_box   = String
    str.$black_proto = String.prototype
}(this)
