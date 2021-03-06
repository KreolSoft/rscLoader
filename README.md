Introduction
============

rscLoader is a simple, lightweight JavaScript library.
With easy syntax and codeless startup:
Create a new instance of the rscLoader, attach listeners and the files you want to preload.
The library helps you to download images, stylesheets and script files asynchronously, before you show your main userinterface. With this features you can easily create a preloader for HTML5 games and websites.
Basic examples - view the sections below.


Example - Preloading Files
==========================
	var mainLoader = new rscLoader();						// Create instance
	
	// Load with standard file endings like, *.css / *.js / *.png /...
	mainLoader.load('*.png');								// Add image file - rocognized file extensions: .png / .jpg / .jpeg / .bmp / .svg / .gif
	mainLoader.load('*.css');								// Add a stylesheet - recognized extension: .css
	mainLoader.load('*.js');								// Add a script file - recognized extension: .js
	
	// Load files with non-standard file extensions
	mainLoader.load('imagefile.*', 'image');				// Add image file - notice the second parameter 'img'
	mainLoader.load('stylesheetfile.*', 'stylesheet');		// Add a stylesheet - notice the second parameter 'css'
	mainLoader.load('scriptfile.*', 'javascript');			// Add a script file - notice the second parameter 'js'
	
	mainLoader.listen('all', function(stats) {				// Create a listener for *all* files - possible listener types: image / stylesheet / javascript
		if(stats.ready == stats.overall)					// Check download status
			alert('All files loaded!');						// Alert 'All files loaded!'
	});
