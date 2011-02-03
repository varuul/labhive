Plugins = function() {
	this.Plugins = new Array();
	return this;
}

Plugins.prototype.initPlugins = function() {
	for (var i=0; i<this.Plugins.length;i++) {
		if (!isEmpty(this.Plugins[i]) && jQuery.isFunction(this.Plugins[i].init) && this.Plugins[i].initialized != true) this.Plugins[i].init();
	}
}

Plugins.prototype.add = function(pluginObject) {
	this.Plugins.push(pluginObject);
}

myPlugins = new Plugins();