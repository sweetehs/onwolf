function Seer() {
	this.__name = "SEER";
	this.__weight = 10;
	this.__waitTime = "1000";
	this.__description = "请查看其中一人身份或者中间牌区中的两张牌";
}
$.extend(Seer.prototype, Role.prototype, {

})