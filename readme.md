<h3 align="center">
	<img src="https://cdn.secure-api.org/images/aplus-node.svg" alt="aplus-node logo" />
</h3>

> ⚠️ **CAUTION:  PRE-PRODUCTION BETA** ⚠️   
>_(breaking changes may be introduced before 1.0.0 release)_
**

# alloy+ plugin: `node`

[![](http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)]()

<!-- TOC depthFrom:2 depthTo:6 insertAnchor:false orderedList:false updateOnSave:true withLinks:true -->

- [Overview](#overview)
	- [Why should I use this plugin?](#why-should-i-use-this-plugin)
	- [What is Alloy+?](#what-is-alloy)
- [Dependencies](#dependencies)
	- [Install Alloy+ Core only](#install-alloy-core-only)
	- [Install Alloy+ Bundle 📦](#install-alloy-bundle-)
- [Installing this plugin](#installing-this-plugin)
- [Usage](#usage)
	- [Examples](#examples)
	- [Supported scenarios](#supported-scenarios)
- [Other Alloy+ Plugins](#other-alloy-plugins)
- [Need Help?](#need-help)
- [License](#license)
- [Legal](#legal)

<!-- /TOC -->

## Overview

### Why should I use this plugin?
[Alloy+][] plugin [`node`][] is a plugin for making Alloy use the nodejs style of module resolution when using `require()`.
This allows you to install (via npm) and use many packages that are available today for node.js applications.

### What is Alloy+?

[Alloy+][] is an entire framework built around [Appcelerator Mobile](http://www.appcelerator.com/mobile-app-development-products/) and their [Alloy](https://github.com/appcelerator/alloy) product. 
The idea for this framework was built upon the concepts of [MobileHero Adamantium](https://github.com/mobilehero/adamantium) 
and a desire to customize and extend Appcelerator Alloy for developers.  How much faster or stronger all depends on YOU, the developer.  

There will be an assortment of alloy+ plugins (available as npm modules) that you can install in your project to help you take your existing development tools furthur 
than possible today.  You can choose which modules are executed in your `config.json` file (which is part of your Alloy project).  You can also easily create your own plugins by simply creating a npm module that follows a simple convention.  

## Dependencies

> _All modules should be installed in the root directory of your Appcelerator mobile project (the directory containing `tiapp.xml`)._

Alloy+ plugins are executed by `Alloy+ Core`.  You can install core by itself or bundled with several Alloy+ plugins.

### Install Alloy+ Core only

[![npm version](https://badge.fury.io/js/%40aplus%2Fcore.svg)](https://badge.fury.io/js/%40aplus%2Fcore)

```bash
npm install --save @aplus/core
```

### Install Alloy+ Bundle 📦

[![npm version](https://badge.fury.io/js/%40aplus%2Fbundle.svg)](https://badge.fury.io/js/%40aplus%2Fbundle)

```bash
npm install --save @aplus/bundle
```


## Installing this plugin

> _All modules should be installed in the root directory of your Appcelerator mobile project (the directory containing `tiapp.xml`)._

[![npm version](https://badge.fury.io/js/%40aplus%2Fnode.svg)](https://badge.fury.io/js/%40aplus%2Fnode)

```bash
npm install --save @aplus/node
```

## Usage

To use this installed plugin in your app, merge the following to your app's `config.json` file:

```json
	{
		"tasks": [ "@aplus/node" ]
	}
```

>_In default mode, the task will run in the `postcompile` stage of the Alloy build process so that 
any generated files have already been placed in the resource folder._

### Examples

**Fix require resolve issues in the Platform-specific resource folder**  
&nbsp;&nbsp;&nbsp;&nbsp;`"postcompile": [ "@aplus/node" ]`

**Add a core module: mycore**  
```json
	"modules": {
		"core": [
			{
				"id": "mycore",
				"path": "path/to/mycore"
			}
		]
	},
```

**Add a fallback module: bluebird** 
```json
	"modules": {
		"fallback": [
			{
				"id": "bluebird",
				"path": "@mobile/bluebird"
			}
		]
	},
```

### Supported scenarios

>The following scenarios are valid and should work.  Check the status below to see which have been tested and are working in the current build.

- [X] Requiring a module from the alloy directory -- `require('alloy/moment')`
- [ ] Requiring a module from the root node_modules directory  -- `require('@mobile/bluebird')`
- [ ] Requiring core module (path) -- `require('path')`
- [ ] Requiring a module with index.js -- `require('test')`
- [ ] Requiring a module with `main` property in `package.json` -- `require('test')`
- [ ] Requiring a module with relative path -- `require('./mymodule')`
- [ ] Requiring a module with concatenated string -- `require('lo' + 'dash')`


## Other Alloy+ Plugins 

> **Coming Soon! :mega:**

- [`underscore`][]: Fix invalid usages of underscore.js within Alloy source code
- [`npm`][]: Execute npm during the Alloy build process
- [`babel`][]: Run babel transformations on your code during the build process
- [`es6`][]: Use ES6/ES2015 code in your apps via babel transformations!


_You can also search for more plugins developed by the community._

## Need Help?

Please [submit an issue](https://github.com/mobilehero/aplus-node/issues) on GitHub and provide information about your setup.

## License

[![](http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)]()

This project is licensed under the terms of the MIT license. See the [license.md](https://github.com/mobilehero/aplus-node/blob/master/license.md)  file.
This means you have full access to the source code and can modify it to fit your own needs. 

## Legal

Superhero Studios Incorporated and this project are in no way affiliated with any of the following companies:

- _Appcelerator, Inc_
- _Axway Inc_
- _Apple Inc_
- _Google Inc_

_Alloy is developed by Appcelerator and the community and is Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved. 
Alloy is made available under the Apache Public License, version 2. See their [LICENSE](https://github.com/appcelerator/alloy/blob/master/LICENSE) file for more information._


[alloy]: https://github.com/appcelerator/alloy  "alloy"
[npm]: https://www.npmjs.com/    "npm"
[alloy+]: https://github.com/mobilehero/aplus-core  "Alloy+"
[`node`]: https://github.com/mobilehero/aplus-node  "node"
[`babel`]: https://github.com/mobilehero/aplus-babel  "babel"
[`es6`]: https://github.com/mobilehero/aplus-es6  "es6"
[`underscore`]: https://github.com/mobilehero/aplus-underscore  "underscore"
[`npm`]: https://github.com/mobilehero/aplus-npm  "npm"