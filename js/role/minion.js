function Minion() {
	this.__name = "Minion";
	this.__weight = 6;
	this.__waitTime = "1000";
	this.__description = "请查看现在场上的狼人，并且记住他";
}
$.extend(Minion.prototype, Role.prototype, {

})