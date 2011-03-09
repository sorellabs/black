/*****************************************************************************
 *                              ~b.lack.object~                              *
 *                            ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                            *
 * Provides missing functionality for JavaScript vanilla Objects.            *
 *                                                                           *
 *     ________________________________________________________________      *
 *       Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 *****************************************************************************/


(function (root) {

	// Error message, variables, alias and such
	var ENullObj = "Object prototype may only be an Object or null"


	///// Function `fallback` ////////////////////////////////////////////////
	//
	//     fallback(map)
	//
	// Provides a fallback implementation to the Object's attribute if
	// it's not implemented natively (or by another library) in the
	// browser.
	//
	function fallback(map) {
		var attr
		for (attr in map)
			if (!Object[attr]) Object[attr] = map[attr]
	}


	///// Function `create` //////////////////////////////////////////////////
	//
	//     create(Obj:proto[, Obj:props]) → Obj
	//
	// Creates a new Object with the specified prototype and properties.
	//
	function create(proto, props) {
		if (typeof proto != "object") throw new TypeError(ENullObj)

		var Empty = function(){ }
		  , obj, prop

		Empty.prototype = proto
		obj             = new Empty
		for (prop in props)
			if (obj.hasOwnProperty(prop)) obj[prop] = props[prop]

		return obj
	}
	

	///// Provides the fallbacks /////////////////////////////////////////////
	fallback({ create: create })
})(this)
