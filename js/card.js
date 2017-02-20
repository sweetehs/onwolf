function Card(role) {
	this.role = role;
	this.canShow = false;
	this.isShow = false;
	this._init();
	this.eventBind();
}
var cardAnimate = {
	flicker: function() {
		this.__$wrapper.addClass("animate-flicker");
	},
	stopFlicker: function() {
		this.__$wrapper.removeClass("animate-flicker");
	},
	overturn: function() {
		this.__$wrapper.find(".template-card-inner").addClass("animate-overturn");
	},
	stopOverturn: function() {
		this.__$wrapper.find(".template-card-inner").removeClass("animate-overturn");
	}
};
$.extend(Card.prototype, cardAnimate, {
	_init: function() {
		this.__$wrapper = this._dom();
	},
	_dom: function() {
		var html = $(".template-card-wrapper.template").clone()[0].outerHTML;
		var dataCard = {
			"roleName": this.role.__name
		};
		return $(doT.template(html)(dataCard)).removeClass("template");
	},
	setPosition: function(x, y) {
		this.__$wrapper.css({
			left: x,
			top: y
		})
	},
	setShow: function(flag) {
		this.canShow = flag;
	},
	hide: function() {
		this.isShow = false;
		this.stopFlicker();
		this.stopOverturn();
	},
	show: function() {
		this.isShow = true;
		this.flicker();
		this.overturn();
	},
	setShowCallback: function(callback) {
		this.showCallback = callback;
	},
	eventBind: function() {
		var that = this;
		this.__$wrapper.bind("click", function() {
			if (that.canShow && !that.isShow) {
				that.show();
				that.showCallback && that.showCallback();
			} else {
				that.hide();
			}
		})
	}
});