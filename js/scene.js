function Scene(__cards) {
	this.__$wrapper = $(".process-wrapper");
	this.cindex = 0;
	this.__curCard = [];
	this.__allCards = [].concat(__cards); // 总牌区
	this.__cards = [].concat(__cards); // 可选牌区
	this.__centerCard = []; // 中间牌区
	this.__pQueue = []; // 规则队列
	this._splitCard();
	this.processQueue();
	this._setCardsPosition();
	this._eventBind();
}
var sceneBegin = {
	_splitCard: function() {
		for (var i = 0; i < 3; i++) {
			var randowNum = Math.ceil(Math.random() * (this.__cards.length - 1));
			this.__centerCard.push(this.__cards.splice(randowNum, 1)[0]);
		}
	},
	_setCardsPosition: function() {
		var x = 150,
			y = 200,
			num = 4,
			margin = 20;
		this.__cards.forEach(function(cardData, i) {
			var ix = i % 4,
				iy = Math.ceil((i + 1) / 4) - 1;
			var cx = ix * x + margin * ix,
				cy = iy * y + margin * iy;
			cardData.setPosition(cx, cy);
			$(".scene-main").append(cardData.__$wrapper);
		})
		this.__centerCard.forEach(function(cardData, i) {
			var ix = i % 4,
				iy = Math.ceil((i + 1) / 4) - 1;
			var cx = ix * x + margin * ix,
				cy = iy * y + margin * iy;
			cardData.setPosition(cx, cy);
			$(".scene-center").append(cardData.__$wrapper);
		})
	},
	processQueue: function() {
		var that = this,
			tempObj = {};
		this.__allCards.forEach(function(card) {
			var roleName = card.role.getName(),
				roleWeight = card.role.getWeight();
			if (!tempObj[roleName]) {
				tempObj[roleName] = card;
				that.__pQueue.push({
					name: roleName,
					weight: roleWeight
				})
			}
		});
		this.__pQueue = this.__pQueue.sort(function(a, b) {
			return a.weight > b.weight;
		});
	},
};
var sceneAction = {
	centerCardShowFlag: function(arr, flag, callback) {
		arr.forEach(function(card) {
			card.setShow(flag);
			callback && callback(card);
		})
	},
	centerCardCanShow: function(num) {
		var that = this,
			index = 0;
		this.centerCardShowFlag(this.__centerCard, true, function(card) {
			card.setShowCallback(function() {
				index++;
				if (index == num) {
					that.centerCardShowFlag(that.__centerCard, false, function(card) {
						card.setShowCallback("");
					});
				}
			});
		})
	},
	mainCardCanShow: function(num) {
		var that = this,
			index = 0;
		this.centerCardShowFlag(this.__cards, true, function(card) {
			card.setShowCallback(function() {
				index++;
				if (index == num) {
					that.centerCardShowFlag(that.__cards, false, function(card) {
						card.setShowCallback("");
					});
				}
			});
		})
	},
	actionCenter: function() {
		// 控制可以有什么操作
		if (this.__curCard.length !== 0) {
			this[this.__curCard[0].role.getName().toLocaleLowerCase() + "Power"]();
		}
	},
	wolfPower: function() {
		if (this.__curCard.length == 1) {
			this.centerCardCanShow(1);
		}
	},
	seerPower: function() {
		debugger;
		this.mainCardCanShow(1);
	}
};
$.extend(Scene.prototype, sceneBegin, sceneAction, {
	_setCurCard: function(card) {
		this.__curCard.push(card);
	},
	_emptyCurCard: function() {
		this.__allCards.forEach(function(card) {
			card.setShow(false);
			card.hide();
		})
		this.__curCard = [];
	},
	_process: function() {
		this._emptyCurCard();
		if (this.cindex < this.__pQueue.length) {
			var that = this,
				cd = this.__pQueue[this.cindex];
			var curCards = this._getCardsByName(cd.name);
			curCards.forEach(function(card) {
				that._setCurCard(card);
				card.show();
			});
			this.actionCenter();
			this.cindex++;
		}
	},
	_getCardsByName: function(name) {
		var arr = [];
		this.__cards.forEach(function(card) {
			if (name == card.role.getName()) {
				arr.push(card);
			}
		});
		return arr;
	},
	_eventBind: function() {
		var that = this;
		this.__$wrapper.find(".btn-next").bind("click", function() {
			that._process();
		})
	}
})
new Scene([new Card(new Wolf()), new Card(new Wolf()), new Card(new Seer()), new Card(new Villager()), new Card(new Villager()), new Card(new Villager())]);