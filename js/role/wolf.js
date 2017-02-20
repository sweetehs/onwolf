function Wolf() {
	this.__name = "Wolf";
	this.__weight = 5;
	this.__waitTime = "1000";
	this.__multly = true;
}
$.extend(Wolf.prototype, Role.prototype, {
	doing: function() {}
})