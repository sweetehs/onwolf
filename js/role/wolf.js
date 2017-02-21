function Wolf() {
	this.__name = "Wolf";
	this.__weight = 5;
	this.__waitTime = "1000";
	this.__multly = true;
	this.__description = "确认自己的同伴，如果场上只有一名狼人，请查看中央牌区的一张卡牌";
}
$.extend(Wolf.prototype, Role.prototype, {
	doing: function() {}
})