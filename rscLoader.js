//* rscLoader 0.01.02 | Copyright (c) 2014 Nikita "IgelHaut" Nitichevski | MIT License *//

(function(window, document) {
	var init = function() {};
	var Engine = {};
	init.prototype = Engine;
	
	Engine.timer = null;
	
	Engine.resources = {
		'css': [],
		'js': [],
		'img': []
	};
	
	Engine.listener = {
		'css': [],
		'js': [],
		'img': [],
		'all': [],
	};
	
	
	function timer() {
		try {
			var $this = Engine;
			$this.timer = setTimeout(function() {
				
				for(var t in $this.listener) {
					for(var i = 0; i < $this.listener[t].length; i++) {
						$this.listener[t][i].call($this, $this.stats(t), (t == 'all' ? $this.resources : $this.resources[t]));
					}
				}
				if($this.stats('all').loaded < $this.stats('all').overall) timer();
			}, 50);
		}
		catch(exception) {
			console.error(exception);
		}
	}
	
	function createTag(type, src, target) {
		try {
			if(type == 'css') {
				var tag = document.createElement('link');
				tag.href = src;
				tag.type = 'text/css';
				tag.rel = 'stylesheet';
			}
			else if(type == 'js') {
				var tag = document.createElement('script');
				tag.src = src;
				tag.type = 'text/javascript';
			}
			else if(type == 'img') {
				var tag = document.createElement('img');
				tag.src = src;
				tag.style.display = 'none';
			}
			tag.onload = function() {
				for(var i = 0; i < Engine.resources[type].length; i++) {
					if(Engine.resources[type][i].src == src)
						Engine.resources[type][i].loaded = true;
				}
			};
			
			(target || document.body).appendChild(tag);
		}
		catch(exception) {
			console.error(exception);
		}
	}
	
	
	Engine.stats = function (type) {
		try {
			if(['css', 'js', 'img', 'all'].indexOf(type) == -1)
				throw 'rscLoader error: Invalid resource type given.'
			
			var overall = 0;
			var loaded = 0;
			var notloaded = 0;
			for(var t in this.resources) {
				if(type != 'all' && t != type)
					continue;
				
				for(var i = 0; i < this.resources[t].length; i++) {
					overall++;
					if(!this.resources[t][i].loaded) notloaded++;
					if(this.resources[t][i].loaded) loaded++;
				}
			}
			
			return {
				'overall': overall,
				'loaded': loaded,
				'notloaded': notloaded
			};
		}
		catch(exception) {
			console.error(exception);
		}
	}
	
	
	Engine.load = function(src, type) {
		try {
			if(!src)
				throw 'rscLoader error: Resource not given.';
			
			if(!type)
				type = src.substr(src.lastIndexOf('.')+1);
			if(['png', 'bmp', 'svg', 'gif', 'jpg', 'jpeg'].indexOf(type) != -1)
				type = 'img';
			if(['css', 'js', 'img'].indexOf(type) == -1)
				throw 'rscLoader error: Invalid resource type given.'
			
			this.resources[type].push({
				'src': src,
				'loaded': false
			});
			
			if(!this.timer)
				timer();
			
			createTag(type, src);
			
			return this;
		}
		catch(exception) {
			console.error(exception);
		}
	};
	
	
	Engine.listen = function(type, callback) {
		try {
			if(['css', 'js', 'img', 'all'].indexOf(type) == -1)
				throw 'rscLoader error: Invalid resource type given.'
			
			if(!callback || typeof(callback) != 'function')
				throw 'rscLoader error: Invalid callback given.'
			
			this.listener[type].push(callback);
			
			return this;
		}
		catch(exception) {
			console.error(exception);
		}
	};
	
	window.rscLoader = new init();
})(window, document);
