/******************************************************************************
 *                                   ~str~                                    *
 *                                 ‾‾‾‾‾‾‾‾‾                                  *
 * String utilities                                                           *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
void function (root) { var __old, str

    // Checks if a string starts with substr
    function starts_with(str, substr) {
        return str.indexOf(substr) == 0
    }
    
    // Checks if a string ends with substr
    function ends_with(str, substr) {
        return str.slice(str.length - substr.length) == substr
    }

    // Conversion to/from char
    function ord(str, idx) { return str.charCodeAt(idx || 0)  }
    function chr(code)     { return String.fromCharCode(code) }
    
    // Change the case of the string
    function lower(str) { return str.toLowerCase() }
    function upper(str) { return str.toUpperCase() }
    function capitalise(str, all_words) { var re
        re = all_words? /\b(\w)/g
                      : /\b(\w)/
        return lower(str).replace(re, function(match, letter) {
            return letter.toUpperCase() })
    }

    // Count occurrences of substr in string
    function count(str, substr, start, end) { var result, pos
        function find_next(){ return str.indexOf(substr, pos + 1) }
        if (start != null) str = str.slice(start, end)

        result = 0
        pos    = -1
        while (~(pos = find_next()))  result++

        return result
    }

    // Makes a new string by repeating str some times
    function make_str(str, times) {
        return Array(times + 1).join(str)
    }

    // CSS/JS identifier helpers
    function dasherise(str) {
        return str.replace(/\s+/g, '-')
    }

    function camelise(str) { var re
        re = /[\s\-_]+(\w)/
        return lower(str).replace(re, function(match, letter) {
            return letter.toUpperCase() })
    }

    // Checks if a string contains some substring
    function hasp(str, substr) {
        return !!~str.indexOf(substr)
    }


    ///// Exports //////////////////////////////////////////////////////////////
    str = typeof exports == 'undefined'? root.black.str = { }
                                       : exports

    str.starts_with = starts_with
    str.ends_with   = ends_with
    str.ord         = ord
    str.chr         = chr
    str.lower       = lower
    str.upper       = upper
    str.capitalise  = capitalise
    str.count       = count
    str.make_str    = make_str
    str.dasherise   = dasherise
    str.camelise    = camelise
    str.hasp        = hasp

    str.$box        = String
    str.$proto      = String.prototype
    str.$utils      = { ord:      ord
                      , chr:      chr
                      , make_str: make_str }

}(this)
