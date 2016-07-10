"use strict";

var _ = require("lodash");
var wrench = require("wrench");
var path = require("path");
var fs = require("fs-extra");

module.exports = function(rootpath, registry, logger) {

	_.defaults(registry, {
		files: [],
		directories: [],
		core: [],
		fallback: [],
	});
	logger = logger || console;

	function injectCode() {

		var fullpath = path.join(rootpath, "app.js");
		var source = fs.readFileSync(fullpath, 'utf8');
		var test = /\/\/ALLOY-RESOLVER/.test(source);
		logger.trace("CODE INJECTED ALREADY: " + test);
		if(!test) {
			source = source.replace(/(var\s+Alloy[^;]+;)/g, "$1\n//ALLOY-RESOLVER\nvar process=require('/process');\nAlloy.resolve=new (require('/resolver'))().resolve;\n");
			fs.writeFileSync(fullpath, source);
		}
	}

	function fixFiles() {
		logger.info("inside fixFiles()");
		_.each(registry.files, function(file) {
			var fullpath = path.join(rootpath, file);
			var basepath = path.posix.dirname(file);
			var basefile = path.posix.resolve(file);
			var source = fs.readFileSync(fullpath, 'utf8');
			logger.trace("fixing file: " + fullpath);
			var requireRegex = /(require)\s*\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/g;
			var staticRequireRegex = /(require)(?:\(\s*['"])([^'"]+)(?:['"]\s*\))/g;

			source = source.replace(requireRegex, function($1, $2, $3) {
				var requestedModule = $2;
				if(staticRequireRegex.test($1)) {
					// logger.info("found match!!");
					var staticRequireSource = $1;
					staticRequireSource = staticRequireSource.replace(staticRequireRegex, function($1, $2, $3) {
						var resolved_path = resolver.resolve($3, basepath);
						// logger.info("resolved_path: " + resolved_path);
						return 'require("' + resolved_path + '")';
					});
					return staticRequireSource;
				} else {
					return 'require(Alloy.resolve(' + $3 + ', "' + basepath + '"))';
				}
			});

			fs.writeFileSync(fullpath, source, { mode: 0o755 });
		});
	}

	function replaceBackSlashes(str) {
		var isExtendedLengthPath = /^\\\\\?\\/.test(str);
		var hasNonAscii = /[^\x00-\x80]+/.test(str);

		if(isExtendedLengthPath || hasNonAscii) {
			return str;
		}

		return str.replace(/\\/g, '/');
	};

	function findFiles(extensions) {
		logger.info("inside findFiles()");
		var extensions = extensions || ['js', 'json'];
		var rx = new RegExp('^.+\.(' + extensions.join('|') + ')$');

		var files = _.map(wrench.readdirSyncRecursive(rootpath), function(filename) {
			return path.posix.sep + replaceBackSlashes(filename);
		});
		return _.filter(files, function(f) {
			return rx.test(f) && !fs.statSync(path.join(rootpath, f)).isDirectory();
		}) || [];
	};

	function loadFiles(extensions) {
		logger.trace("inside loadFiles()");
		var allfiles = findFiles(extensions);
		var filepaths = _.filter(allfiles, function(filepath) {
			return !/.+(package\.json)/.test(filepath);
		});
		_.forEach(filepaths, function(filepath) {
			registry.files.push(filepath);
		});

		var packagepaths = _.filter(allfiles, function(filepath) {
			return(/.+(package\.json)/.test(filepath));
		});
		_.forEach(packagepaths, function(filepath) {
			var content = fs.readFileSync(path.posix.join(rootpath, filepath), 'utf8');
			var json = JSON.parse(content);
			if(json.main) {
				registry.directories.push({
					id: path.posix.dirname(filepath),
					path: path.posix.resolve(path.posix.join(path.posix.dirname(filepath), json.main))
				});
			}
		});
		var indexpaths = _.filter(allfiles, function(filepath) {
			return(/.+(index\.js)/.test(filepath));
		});

		_.forEach(indexpaths, function(filepath) {
			var existingdir = _.find(registry.directories, function(dir) {
				return dir.id === path.posix.dirname(filepath);
			});
			if(!existingdir) {
				registry.directories.push({
					id: path.posix.dirname(filepath),
					path: filepath
				});
			}
		});

		return registry;
	};

	function writeRegistry() {
		logger.info("inside writeRegistry()");
		var filepath = path.join(rootpath, "resolver.js");
		var content = fs.readFileSync(filepath, 'utf8');
		var regex = /(var\s+registry\s+=\s+)[^;]*(;)/g;
		var modified = content.replace(regex, "$1" + JSON.stringify(registry) + "$2");
		fs.writeFileSync(filepath, modified);
	}

	fs.copySync(path.join(__dirname, "resolver.js"), path.join(rootpath, "resolver.js"));
	fs.copySync(path.join(__dirname, "path.js"), path.join(rootpath, "path.js"));
	fs.copySync(path.join(__dirname, "process.js"), path.join(rootpath, "process.js"));

	loadFiles();

	var r = require("./resolver");
	var resolver = new r(registry, logger);
	registry = resolver.registry;

	injectCode();
	fixFiles();
	writeRegistry();

	// console.debug(JSON.stringify(registry,null,2));

	Object.defineProperty(this, "registry", {
		get: function() {
			return _.clone(registry);
		},
		enumerable: true,
		configurable: false
	});
}