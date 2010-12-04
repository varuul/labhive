BrowserInstance = function(e) {
	this.id = tools_randomid(12);
	this.language = "en";
	/*if (document.location.host == undefined || document.location.host == "") {
		var mypathEnd = document.location.href.lastIndexOf("/");
		this.URL_home = document.location.href.substr(0,mypathEnd+1);
	} else 
	*/
	this.URL_home = "http://"+document.location.host+"/";
	this.URL_backend = this.URL_home+"backend/";
	this.URL_html = this.URL_home+"html/";
	this.URL_images = this.URL_home+"img/";
	
	this.loadedhtml = new Array();
	this.FileName_login = "user.php";
	this.UserStatus = 0; // 0="anonymous", 1="logged in"
	this.myUser = {
		uid: 0,
		name: "Anonymous",
		email: "test@example.com",
		AccessLevel: 0 // 0 = "anonymous", 1 = "normal logged in user", 2 = "admin"
	}
	this.CheckAjaxUpdates = function(JSONDOC) {
		this.UserStatus = (JSONDOC.DB_Session=="true") ? 1 : 0;
		if (isEmpty(JSONDOC.userinfo)==false) {
			this.myUser.email = (isEmpty(JSONDOC.userinfo.user_email)) ? "test@example.com" : JSONDOC.userinfo.user_email;
			this.myUser.AccessLevel = (isEmpty(JSONDOC.userinfo.user_xslevel)) ? 0 : JSONDOC.userinfo.user_xslevel;
			this.myUser.name = (isEmpty(JSONDOC.userinfo.username)) ? 0 : JSONDOC.userinfo.username;
			this.myUser.uid = (isEmpty(JSONDOC.userinfo.user_id)) ? 0 : JSONDOC.userinfo.user_id;
		}
		this.menu.updateButtonVisibility();
	}
	return this;
}