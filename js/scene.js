function Scene(__cards) {
	this.__$wrapper = $(".process-wrapper");
	this.cindex = 0;
	this.__curCard = [];
	this.__allCards = [].concat(__cards); // 总牌区
	this.__cards = [].concat(__cards); // 可选牌区
	this.__centerCard = []; // 中间牌区
	this.__pQueue = []; // 规则队列
	this._splitCard();
	this._processQueue();
	this._setCardsPosition();
	this._eventBind();
}
var sceneBegin = {
	_splitCard: function() {
		for (var i = 0; i < 0; i++) {
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
	_processQueue: function() {
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
	cardShowFlag: function(arr, flag, callback) {
		arr.forEach(function(card) {
			card.setShow(flag);
			callback && callback(card);
		})
	},
	cardCanShow: function(num,arr) {
		var that = this,
			index = 0;
		this.cardShowFlag(arr, true, function(card) {
			card.setShowCallback(function() {
				index++;
				if (index == num) {
					that.cardShowFlag(arr, false, function(card) {
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
			this.cardCanShow(1,this.__centerCard);
		}
	},
	seerPower: function() {
		this.cardCanShow(2,this.__centerCard);
	},
	minionPower:function(){
		var wolfs = this._getCardsByName("Wolf");
		wolfs.forEach(function(card){
			card.show();
		});
	}
};
$.extend(Scene.prototype, sceneBegin, sceneAction, {
	_initAllCard: function() {
		this.__allCards.forEach(function(card) {
			card.setShow(false);
			card.hide();
		})
		this.__curCard = [];
	},
	_process: function() {
		this._initAllCard();
		if (this.cindex < this.__pQueue.length) {
			var that = this,
				cd = this.__pQueue[this.cindex];
			var curCards = this._getCardsByName(cd.name);
			curCards.forEach(function(card) {
				that.__curCard.push(card);
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
new Scene([
	new Card(new Wolf()),
	new Card(new Wolf()),
	new Card(new Minion()),
	new Card(new Seer()),
	new Card(new Villager()),
	new Card(new Villager())
]);





