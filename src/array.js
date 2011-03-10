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

	// Alias, erro messages and stuff
	var classOf = Object.prototype.toString
	  , fallback


	///// Function `isArray` /////////////////////////////////////////////////
	//
	//     isArray(Obj:obj) → Bool
	//
	// Returns `true` if a variable is an array, `false` if it is not.
	//
	function isArray(obj) {
		return classOf.call(obj) == '[object Array]'
	}



})(this);