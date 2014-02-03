//* rscLoader 0.02.61 | Copyright (c) 2014 Nikita "IgelHaut" Nitichevski | MIT License *//

(function(window, document) {
	/* Resource types */
	var resourceType = {
		'stylesheet': {
			'type': ['css'],
			'createNode': function(src) {
				var node = document.createElement('link');
				node.href = src;
				node.type = 'text/css';
				node.rel = 'stylesheet';
				
				return node;
			},
			'addListener': function(node, resourceLink) {
				// Workaround for onload event - with to many file laggy...? One timer for all stylesheets?
				resourceLink.timer = function() {
					var $this = this;
					setTimeout(function() {
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
		'javascript': {
			'type': ['js'],
			'createNode': function(src) {
				var node = document.createElement('script');
				node.src = src;
				node.async = true;
				node.type = 'text/javascript';
				
				return node;
			},
			'addListener': function(node, resourceLink) {
				node.onload = function() {
					resourceLink.ready = true;
				};
			}
		},
		'image': {
			'type': ['png', 'bmp', 'svg', 'gif', 'jpg', 'jpeg'],
			'createNode': function(src) {
				var node = document.createElement('img');
				node.src = src;
				node.style.display = 'none';
				node.style.width = '0';
				node.style.height = '0';
				
				return node;
			},
			'addListener': function(node, resourceLink) {
				node.onload = function() {
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
		_timer = null;
		function timer() {
			_timer = setTimeout(function() {
				for(var i = 0; i < listener.length; i++)
					listener[i].callback($this.stats(listener[i].type), $this.resources);
				
				if($this.stats('all').ready < $this.stats('all').overall) timer();
			}, 50);
		}
		
		// Group / type / overall statistics
		this.stats = function(type) {
			var output = {
				'overall': 0,
				'ready': 0,
				'notready': 0
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
				'type': type,
				'src': src,
				'ready': false
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
				'type': type,
				'callback': callback
			});
			
			return $this;
		};
	};
	
	window.rscLoader = window._rscLoader = init;
})(window, document);
