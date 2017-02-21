function Card(role) {
	this.role = role;
	this.canShow = false;
	this.isShow = false;
	this._init();
	this.eventBind();
};
$.extend(Card.prototype, {
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
	flicker: function() {
		this.__$wrapper.addClass("animate-flicker");
	},
	stopFlicker: function() {
		this.__$wrapper.removeClass("animate-flicker");
	},
	setShow: function(flag) {
		this.canShow = flag;
	},
	hide: function() {
		this.isShow = false;
		this.__$wrapper.find(".template-card-inner").removeClass("animate-overturn");
	},
	show: function() {
		this.isShow = true;
		this.__$wrapper.find(".template-card-inner").addClass("animate-overturn");
	},
	activeOn: function() {
		this.__$wrapper.find(".template-card-inner").addClass("active");
	},
	activeOut: function() {
		this.__$wrapper.find(".template-card-inner").removeClass("active");
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