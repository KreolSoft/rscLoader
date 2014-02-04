//* rscLoader 0.02.75 | Copyright (c) 2014 Nikita "IgelHaut" Nitichevski | MIT License *//

(function(window, document) {
	"use strict";
	
	/* Resource types */
	var resourceType = {
		"stylesheet": {
			"type": ["css"],
			"createNode": function(src) {
				var node = document.createElement('link');
				node.href = src;
				node.type = 'text/css';
				node.rel = 'stylesheet';
				
				return node;
			},
			"addListener": function(node, resourceLink) {
				// Workaround for onload event - with to many file laggy...? One timer for all stylesheets?
				resourceLink.timer = function() {
					var $this = this;
					window.setTimeout(function() {
						for(var i = 0; i < document.styleSheets.length; i++) {
							if(document.styleSheets[i].href == $this.src) {
								$this.ready = true;
								delete($this.timer);
								break;
							}
						}
						
						if(!$this.ready) $this.timer();
					}, 10);
				};
				resourceLink.timer();
			}
		},
		"javascript": {
			"type": ["js"],
			"createNode": function(src) {
				var node = document.createElement('script');
				node.src = src;
				node.async = true;
				node.type = 'text/javascript';
				
				return node;
			},
			"addListener": function(node, resourceLink) {
				node.onload = function() {
					resourceLink.ready = true;
				};
				node.onreadystatechange = function() {
					if(this.readyState == 'complete')
						resourceLink.ready = true;
				};
			}
		},
		"image": {
			"type": ["png", "bmp", "svg", "gif", "jpg", "jpeg"],
			"createNode": function(src) {
				var node = document.createElement('img');
				node.src = src;
				node.style.display = 'none';
				node.style.width = '0';
				node.style.height = '0';
				
				return node;
			},
			"addListener": function(node, resourceLink) {
				node.onload = function() {
					resourceLink.ready = true;
				};
				node.onreadystatechange = function() {
					if(this.readyState == 'complete')
						resourceLink.ready = true;
				};
			}
		}
	};

	/* Get resource container */
	function resourceContainer() {
		var rscLoader = document.getElementById('rscLoaderTarget');
		if(!rscLoader) {
			var rscLoaderTarget = document.createElement('div');
			rscLoaderTarget.id = 'rscLoaderTarget';
			rscLoaderTarget.style.display = 'none';
			rscLoaderTarget.style.width = '0';
			rscLoaderTarget.style.height = '0';
			document.body.insertBefore(rscLoaderTarget, document.body.childNodes[0]);
			
			rscLoader = document.getElementById('rscLoaderTarget');
		}
		
		return rscLoader;
	}

	/* Engine */
	var init = function() {
		var $this = this;
		
		// Resource library
		this.resources = [];
		
		// Listener library
		var listener = [];
		
		// Timer
		var _timer = null;
		function timer() {
			_timer = window.setTimeout(function() {
				for(var i = 0; i < listener.length; i++)
					listener[i].callback($this.stats(listener[i].type), $this.resources);
				
				if($this.stats('all').ready < $this.stats('all').overall) timer();
			}, 50);
		}
		
		// Group / type / overall statistics
		this.stats = function(type) {
			var output = {
				"overall": 0,
				"ready": 0,
				"notready": 0
			};
			
			for(var i = 0; i < $this.resources.length; i++) {
				if(type != 'all' && type != $this.resources[i].type)
					continue;
				
				output.overall++;
				if($this.resources[i].ready) output.ready++;
				if(!$this.resources[i].ready) output.notready++;
			}
			
			return output;
		};
		
		// Load resource
		this.load = function(src, type) {
			// Get type
			if(!type || !resourceType[type]) {
				for(var t in resourceType) {
					if(resourceType[t].type.indexOf(src.substr(src.lastIndexOf('.')+1)) != -1) {
						type = t;
						break;
					}
				}
				if(!type)
					return;
			}
			
			// Insert into resource library
			$this.resources.push({
				"type": type,
				"src": src,
				"ready": false
			});
			
			if(!_timer)
				timer();
			
			// Create resource node
			var node = resourceType[type].createNode(src);
				// Add onload listener
				resourceType[type].addListener(node, $this.resources[($this.resources.length-1)]);
			
			// Inject node asynchronously
			setTimeout(function() {
				resourceContainer().insertBefore(node);
			}, 0);
			
			return $this;
		};
		
		// Add listener
		this.listen = function(type, callback) {
			listener.push({
				"type": type,
				"callback": callback
			});
			
			return $this;
		};
	};
	
	window.rscLoader = window._rscLoader = init;
	
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {
			"use strict";
			if(this == null)
				throw new TypeError();
			
			var t = Object(this);
			var len = t.length >>> 0;

			if(len === 0)
				return -1;
			
			var n = 0;
			if (arguments.length > 1) {
				n = Number(arguments[1]);
				if(n != n) {
					n = 0;
				}
				else if(n != 0 && n != Infinity && n != -Infinity) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}
			if(n >= len)
				return -1;
			
			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
			for(; k < len; k++) {
				if(k in t && t[k] === searchElement)
					return k;
			}
			return -1;
		}
	}
})(window, document);
