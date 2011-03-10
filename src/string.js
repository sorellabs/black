/******************************************************************************
 *                              ~b.lack.string~                               *
 *                            ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                             *
 * Provides missing functionality for JavaScript vanilla Strings.             *
 *                                                                            *
 *     ________________________________________________________________       *
 *       Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11         *
 ******************************************************************************/


(function (root) {

	// Get the fallback function
	if (typeof exports != "undefined")  fallback = require('./core').fallback
	else                                fallback = b.lack.fallback

	// Alias, error messages and stuff
	var fallback


	///// Function `trim` ////////////////////////////////////////////////////
	//
	//     #trim() → Str
	//
	// Removes whitespace from both ends of the string.
	//
	function trim() {
		return this.replace(/^\s*|\s*$/g, "")
	}


	///// Function `trimLeft` /////////////////////////////////////////////////
	//
	//     #trimLeft() → Str
	//
	// Removes whitespace from the left end of the string.
	//
	function trim_left() {
		return this.replace(/^\s*/g, "")
	}


	///// Function `trimRight` ////////////////////////////////////////////////
	//
	//     #trimRight() → Str
	//
	// Removes whitespace from the right end of the string.
	//
	function trim_right() {
		return this.replace(/\s*$/g, "")
	}


	///// Provides the fallbacks //////////////////////////////////////////////
	fallback(String.prototype, { trim:      trim
	                           , trimLeft:  trim_left
	                           , trimRight: trim_right })
})(this)
