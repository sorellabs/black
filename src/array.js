/******************************************************************************
 *                              ~b.lack.array~                                *
 *                            ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                              *
 * Provides missing Array functionality.                                      *
 *                                                                            *
 *     ________________________________________________________________       *
 *       Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11         *
 ******************************************************************************/


(function (root) {

	// Get the fallback function
	if (typeof exports != "undefined")  fallback = require('./core').fallback
	else                                fallback = b.lack.fallback

	// Alias, error messages and stuff
	var classOf = Object.prototype.toString
	  , abs     = Math.abs
	  , max     = Math.max
	  , min     = Math.min
	  , fallback


	///// Function `isArray` /////////////////////////////////////////////////
	//
	//     isArray(Obj:obj) → Bool
	//
	// Returns `true` if a variable is an array, `false` if it is not.
	//
	function arrayp(obj) {
		return classOf.call(obj) == '[object Array]'
	}


	///// Function `indexOf` /////////////////////////////////////////////////
	//
	//     #indexOf(value[, Num:start]) → Num
	//
	// Compares `value` to the elements of the array, in ascending
	// order, using the Strict Equality Comparison algorithm. If a match
	// is found, that match is returned, otherwise, -1 is returned.
	// 
	// The optional `start` argument defines the array index at which
	// the search should start. If it's not present, or 0, the whole
	// array will be searched, otherwise, only the part starting at the
	// given index will be searched.
	// 
	// Follows the algorithm described in ES-262 15.4.4.14
	//
	function search(value, start) {
		var obj = Object(this)
		  , len = obj.length >> 0
		  , key

		start = +start || 0
		if (!len || start >= len)  return -1
		if (start < 0)             start = max(0, len - abs(start))
		
		for (key = start; key < len; ++key)
			if (key in obj && obj[key] === value) return key

		return -1
	}


	///// Function `lastIndexOf` /////////////////////////////////////////////
	//
	//     #lastIndexOf(value[, Num:start]) → Num
	//
	// Compares `value` to the elements of the array, in descending
	// order, using the Strict Equality Comparison algorithm. If a match
	// is found, that match is returned, otherwise, -1 is returned.
	// 
	// The optional `start` argument defines the array index at which
	// the search should start. If it's not present, or if it's great or
	// equal to the length of the array, the whole array will be
	// searched, otherwise, only the part starting at the given index
	// will be searched.
	// 
	// Follows the algorithm described in ES-262 15.4.4.15
	//
	function search_right(value, start) {
		function get_start() { return clamp((!isNaN(+start)) ? +start : len)  }
		function clamp(n)    { return (n >= 0) ? min(n, len-1) : len - abs(n) }

		var obj = Object(this)
		  , len = obj.length >> 0
		  , key

		if (!len) return -1

		for (key = get_start(); key < len; --key)
			if (key in obj && obj[key] === value) return key

		return -1
	}


	///// Provides the fallbacks /////////////////////////////////////////////
	fallback(Array, { isArray: arrayp })

	fallback(Array.prototype, { indexOf:     search
	                          , lastIndexOf: search_right })

})(this);