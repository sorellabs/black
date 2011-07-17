/******************************************************************************
 *                                  ~black~                                   *
 *                                ‾‾‾‾‾‾‾‾‾‾‾                                 *
 * Extended and sanitised "standard" library for JavaScript.                  *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/

var core = require('./core')

exports.unpack     = core.unpack
exports.unpack_all = core.unpack_all

exports.obj        = require('./obj')
exports.list       = require('./list')
exports.str        = require('./str')
exports.type       = require('./type')
exports.num        = require('./num')
exports.fn         = require('./fn')
