function Scene(__cards, yourCard) {
	this.__$wrapper = $(".process-wrapper");
	this.cindex = 0;
	this.__yourCard = yourCard;
	this.__curCard = [];
	this.__allCards = [].concat(__cards); // 总牌区
	this.__cards = []; // 可选牌区
	this.__centerCard = []; // 中间牌区
	this.__pQueue = []; // 规则队列
	this.__isEyeOpen = false;
	// 游戏准备
	this._background();
	this._beforeChooseCard(); // 展示牌
	this._processQueue();
	this._eventBind();
}
var sceneListen = {
	__temp: [],
	listenChoose: function(index) {
		//监听选择牌
		var that = this;
		this.__temp.push(index);
		this.__cards.push(this.__allCards[index]);
		this.__cards.forEach(function(card) {
			card.stopFlicker();
			card.flicker();
		});
		// 如果牌剩余三张则游戏开始
		if (this.__allCards.length - this.__cards.length == 3) {
			this.__allCards.forEach(function(card, index) {
				card.stopFlicker();
				if (that.__temp.indexOf(index) == -1) {
					that.__centerCard.push(card);
				}
			})
			alert("游戏开始");
			that._afterChooseCard();
		}
	}
};
var sceneCommon = {
	cardShowFlag: function(arr, flag, callback) {
		arr.forEach(function(card) {
			card.setShow(flag);
			callback && callback(card);
		})
	},
	cardCanShow: function(num, arr, callback) {
		var that = this,
			index = 0;
		this.cardShowFlag(arr, true, function(card) {
			card.setShowCallback(function() {
				index++;
				if (index == num) {
					callback && callback(card);
					that.cardShowFlag(arr, false, function(card) {
						card.setShowCallback("");
					});
				}
			});
		})
	}
};
var sceneBegin = {
	cardsDo: function(cards, callback, time) {
		var that = this;
		return new Promise(function(reslove) {
			var time = time == undefined ? 200 : time,
				timer;
			cards.forEach(function(card, i) {
				setTimeout(function() {
					callback && callback(card, i);
					if (i == cards.length - 1) {
						reslove();
					}
				}, 100 * i);
			})
		})
	},
	_getSceneSize: function() {
		return {
			x: 150,
			y: 200,
			num: 5,
			margin: 20
		}
	},
	_background: function() {
		var sceneSize = this._getSceneSize();
		$(".scene-warpper").css({
			width: (sceneSize.x + sceneSize.margin) * sceneSize.num,
			height: (sceneSize.y + sceneSize.margin) * Math.ceil(this.__allCards.length / sceneSize.num)
		})
	},
	_getRC: function(i, fy) { 
		var sceneSize = this._getSceneSize();
		var ix = i % sceneSize.num,
			iy = Math.ceil((i + 1) / sceneSize.num) - 1;
		if (fy) {
			iy += fy;
		}
		return {
			cx: ix * sceneSize.x + sceneSize.margin * ix,
			cy: iy * sceneSize.y + sceneSize.margin * iy
		}
	},
	_getSceneCenter: function() {

	},
	_beforeChooseCard: function() {
		var that = this;
		this.__allCards.forEach(function(card, index) {
			var rc = that._getRC(index);
			card.setPosition(rc.cx, rc.cy);
			$(".scene-main").append(card.__$wrapper);
		})
		this.cardsDo(this.__allCards, function(card) {
			card.show();
		}).then(function() {
			return that.cardsDo(that.__allCards, function(card) {
				card.hide();
			})
		}).then(function() {
			return that.cardsDo(that.__allCards, function(card) {
				card.setPosition(0, 0);
			})
		}).then(function() {
			// 打乱数组顺序
			that.__allCards = that.__allCards.sort(function() {
				return 0.5 - Math.random();
			});
			return that.cardsDo(that.__allCards, function(card, index) {
				var rc = that._getRC(index);
				card.setPosition(rc.cx, rc.cy);
			});
		}).then(function() {
			that.cardCanShow(1, that.__allCards, function(card) {
				that.__yourCard = card;
			})
		})
	},
	_afterChooseCard: function() {
		var that = this;
		that.cardsDo(that.__cards, function(card, index) {
			var rc = that._getRC(index);
			return card.setPosition(rc.cx, rc.cy);
		}).then(function() {
			that.cardsDo(that.__centerCard, function(card, index) {
				var rc = that._getRC(index, 1);
				card.setPosition(rc.cx, rc.cy);
			});
		});

	},
	_processQueue: function() {
		var that = this,
			tempObj = {};
		this.__allCards.forEach(function(card) {
			var roleName = card.role.getName(),
				roleWeight = card.role.getWeight(),
				roleDescription = card.role.getDescription();
			if (!tempObj[roleName]) {
				tempObj[roleName] = card;
				that.__pQueue.push({
					name: roleName,
					weight: roleWeight,
					description: roleDescription
				})
			}
		});
		this.__pQueue = this.__pQueue.sort(function(a, b) {
			return a.weight > b.weight;
		});
	},
};
var sceneAction = {
	doPower: function() {
		// 控制可以有什么操作
		if (this.__curCard.length !== 0) {
			this[this.__curCard[0].role.getName().toLocaleLowerCase() + "Power"]();
		}
	},
	wolfPower: function() {
		if (this.__curCard.length == 1) {
			// 一只狼
			this.cardCanShow(1, this.__centerCard);
		}
	},
	seerPower: function() {
		this.cardCanShow(2, this.__centerCard);
	},
	minionPower: function() {
		var wolfs = this._getCardsByName("Wolf");
		wolfs.forEach(function(card) {
			card.show();
		});
	}
};
$.extend(Scene.prototype, sceneCommon, sceneListen, sceneBegin, sceneAction, {
	_initAllCard: function() {
		this.__allCards.forEach(function(card) {
			card.setShow(false);
			card.activeOut();
			card.hide();
		})
		this.__curCard = [];
	},
	_process: function() {
		if (this.cindex < this.__pQueue.length) {
			var that = this;
			if (!this.__isEyeOpen) {
				// 玩家睁眼
				var cq = this.__pQueue[this.cindex];
				var curCards = this._getCardsByName(cq.name);
				curCards.forEach(function(card) {
					// 轮到自己操作
					if (that.__yourCard.role.getName() == card.role.getName()) {
						that.__curCard.push(card);
						card.show();
					}
					if (card == that.__yourCard) {
						that.__yourCard.activeOn();
					}
				});
				this.__isEyeOpen = true;
				this.doPower();
				this.cindex++;
				$(".process-wrapper .text").html(cq.name + "请睁眼，" + cq.description);
			} else {
				// 玩家闭眼
				var bq = this.__pQueue[this.cindex - 1];
				this.__isEyeOpen = false;
				this._initAllCard();
				$(".process-wrapper .text").html(bq.name + "请闭眼");
			}
		}
	},
	_getCardsByName: function(name) {
		var arr = [];
		this.__allCards.forEach(function(card) {
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
var wolfCard1 = new Card(new Wolf());
var wolfCard2 = new Card(new Wolf());
var minionCard1 = new Card(new Minion());
var seerCard1 = new Card(new Seer());
var villagerCard1 = new Card(new Villager());
var villagerCard2 = new Card(new Villager());
var villagerCard3 = new Card(new Villager());
var villagerCard4 = new Card(new Villager());
var s = new Scene([
	wolfCard1,
	minionCard1,
	seerCard1,
	wolfCard2,
	villagerCard1,
	villagerCard2
]);

function test() {
	s.listenChoose(3)
	s.listenChoose(4)
	s.listenChoose(5)
}