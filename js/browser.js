BrowserInstance = function(e) {
	this.id = tools_randomid(12);
	this.language = "en";
	this.URL_home = "http://"+document.location.host+"/";
	this.URL_backend = this.URL_home+"backend/";
	this.URL_html = this.URL_home+"html/";
	this.URL_images = this.URL_home+"img/";
	
	this.myTemplate = {}
	this.myTemplate.Images = {}
	this.myTemplate.Images.Fail = "/img/template/fail.png";
	this.myTemplate.Images.Success = "/img/template/success.png";
	this.myTemplate.Images.Info = "/img/template/info.png";
	this.myTemplate.Images.Alert = "/img/template/alert.png";

	return this;
}

BrowserInstance.prototype.AJAX__ProcessAnswer = function(doc) {
	var JSONdoc = {};
	try {
		JSONdoc = jQuery.parseJSON(doc);
	} catch(err) {
		return false;
	}
	$(document).trigger({type: "AjaxResponse", json: JSONdoc});
	return JSONdoc;
}

//this object holds all the general variables and information
myBrowser = new BrowserInstance();












