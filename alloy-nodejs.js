"use strict";
/***
 *                          __     _  __       __                     
 *       ____ ___   ____   / /_   (_)/ /___   / /_   ___   _____ ____ 
 *      / __ `__ \ / __ \ / __ \ / // // _ \ / __ \ / _ \ / ___// __ \ 
 *     / / / / / // /_/ // /_/ // // //  __// / / //  __// /   / /_/ / 
 *    /_/ /_/ /_/ \____//_.___//_//_/ \___//_/ /_/ \___//_/    \____/ 
 *                                                                    
 *                  mobile solutions for everyday heroes
 *                                                                    
 * @file 
 * Alloy+ => Alloy+ plugin for executing npm during build process
 * 
 * @module 
 * alloy-npm
 * 
 * @author 
 * Brenton House <brenton.house@gmail.com>
 * 
 * @copyright
 * Copyright (c) 2016 by Superhero Studios Incorporated.  All Rights Reserved.
 *      
 * @license
 * Licensed under the terms of the MIT License (MIT)
 * Please see the LICENSE.md included with this distribution for details.
 * 
 */

var path = require("path");
var _ = require('lodash');
var logger;

var fix_require = function(params, directory) {

	logger = params.logger;
	params.dirname = params.dirname || params.event.dir.lib;

	_.defaults(params.config, {
		modules: {}
	});

	logger.trace("fixing alloy require in directory: " + params.dirname);
	logger.trace(JSON.stringify(params.config, null, 2));

	var r = require('./resolver/resolve-fix');
	var resolveFix = new r(directory, params.config.modules, logger);
	var registry = JSON.stringify(resolveFix.registry, null, 4);
	//console.warn(registry);
}

module.exports = fix_require;