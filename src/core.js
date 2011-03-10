/******************************************************************************
 *                               ~b.lack.core~                                *
 *                             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                              *
 * Provides base functionality for implementing missing functionality.        *
 *                                                                            *
 *     ________________________________________________________________       *
 *       Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11         *
 ******************************************************************************/


(function (root) {

	var mod

	if (typeof exports == "undefined") {
		if (!root.b)      root.b = {}
		if (!root.b.lack) root.b.lack = {}
		mod = root.b.lack }
	else
		mod = exports


	///// Function `fallback` ////////////////////////////////////////////////
	//
	//     fallback(Obj:obj, Obj:map)
	//
	// Provides a fallback implementation to the given `obj`'s
	// properties, where they are not implemented natively (or by
	// another library) in the current environment.
	//
	function fallback(map) {
		var attr
		for (attr in map)
			if (!obj[attr]) obj[attr] = map[attr]
	}


	///// Exports ////////////////////////////////////////////////////////////
	mod.fallback = fallback
})(this);