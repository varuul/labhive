function bootstrap_1() {  // FIRE UP THE ENGINES!
	
	// Run initialisation of Plugins that registered with the system
	myPlugins.initPlugins();
	
	$(document).trigger({
		type:"InitStage1complete"
	});
	return 1;

}


