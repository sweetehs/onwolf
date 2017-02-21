function Role() {}
Role.prototype = {
	getWeight: function() {
		return this.__weight;
	},
	getName: function() {
		return this.__name
	},
	getMultly: function() {
		return !!this.__multly;
	},
	getDescription: function() {
		return this.__description;
	},
	setCard: function(card) {
		this.__card = card;
	},
	animate: function() {},
	stopAnimate: function() {}
};