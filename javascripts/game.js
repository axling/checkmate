var g_window_x=600;
var g_window_y=600;
var levels = [];

function coord(x, y) {
    this.x = x;
    this.y = y;
}

function getDistance(coord1, coord2) {
    return Math.sqrt((coord2.x-coord1.x)*(coord2.x-coord1.x) + 
		     (coord2.y-coord1.y)*(coord2.y-coord1.y));
    
}

function getNewPoint(coord1, coord2, magnitude) {
    var distance = getDistance(coord1, coord2);
    if(distance > magnitude) {
	var deltaY = coord2.y - coord1.y;
	var deltaX = coord2.x - coord1.x;
	angle = Math.atan2(deltaY, deltaX);
	var newX = Math.cos(angle)*magnitude;
	var newY = Math.sin(angle)*magnitude;
	return doBoundaryCheck(new coord(coord1.x+newX, coord1.y+newY));
    } else {
	return doBoundaryCheck(new coord(coord2.x, coord2.y));
    }
}

function doBoundaryCheck(point) {
    if(point.x < 0 && point.y < 0) {
	return new coord(0,0);	
    } else if (point.x < 0 && point.y > (g_window_y-60)) {
	return new coord(0,g_window_y-60);
    } else if(point.x > (g_window_x-60) && point.y < 0) {
	return new coord(g_window_x-60,0);
    } else if(point.x > g_window_x-60 && point.y > g_window_y-60) {
	return new coord(g_window_x-60, g_window_y-60);
    } else if(point.x < 0) {
	return new coord(0, point.y);
    } else if(point.x > g_window_x-60) {
	return new coord(g_window_x-60, point.y);
    } else if(point.y < 0) {
	return new coord(point.x, 0);
    } else if(point.y > g_window_y-60) {
	return new coord(point.x, g_window_y-60)
    } else {
	return point;
    }
	
}

function doBishopAttackData(attackPoint, playerPos) {
    var deltaY = attackPoint.y - playerPos.y;
    var deltaX = attackPoint.x - playerPos.x;
    var radians = Math.atan2(deltaY, deltaX);
    var angle = 180 * radians/ Math.PI;
    var distance = getDistance(playerPos, attackPoint);
    if(angle >= -90 && angle < 0 ) {
	var radAngle = -45*Math.PI/180;
	var magnitude = distance * Math.cos(
	    Math.abs(radians - radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if(angle >= 0 && angle < 90 ) {
	var radAngle = 45*Math.PI/180;
	var magnitude = distance * Math.cos(Math.abs(radians-radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if(angle > 90 && angle <= 180 ) {
	var radAngle = 135*Math.PI/180;
	var magnitude = distance * Math.cos(Math.abs(radians-radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if(angle > -180 && angle <= -90 ) {
	var radAngle = -135*Math.PI/180;
	var magnitude = distance * Math.cos(Math.abs(radians-radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else {
	console.log("Unhandled angle in bishop attackvector function: "
		    + angle);
    }
}   

function doQueenAttackData(attackPoint, playerPos) {
    var deltaY = attackPoint.y - playerPos.y;
    var deltaX = attackPoint.x - playerPos.x;
    var radians = Math.atan2(deltaY, deltaX);
    var angle = 180 * radians/ Math.PI;
    var distance = getDistance(playerPos, attackPoint);
    if( angle >= -22.5 && angle < 22.5) {
	var newY = 0; //sin(0)=0
	var newX = deltaX; //cos(0)=1
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if(angle >= 22.5 && angle < 67.5 ) {
	
	var radAngle = 45*Math.PI/180;
	var magnitude = distance * Math.cos(
	    Math.abs(radians - radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	console.log("Angle: " + angle + ", magnitude: " + magnitude);
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if(angle >= 67.5 && angle < 112.5) {
	var newY = deltaY; // sin(90) = 1
	var newX = 0; // cos(90) = 0
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if(angle >= 112.5 && angle < 157.5 ) {
	var radAngle = 135*Math.PI/180;
	var magnitude = distance * Math.cos(Math.abs(radians-radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if((angle >= 157.5 && angle <= 180) ||
	      (angle < -157.5 && angle >= -180)) {
	var newY = 0; // sin(180) = 0
	var newX = deltaX; // cos(180) = 1
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if(angle < -112.5 && angle >= -157.5 ) {
	var radAngle = -135*Math.PI/180;
	var magnitude = distance * Math.cos(Math.abs(radians-radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if (angle < -67.5 && angle >= -112.5 ) {
	var newY = deltaY; // sin(-90) = 0
	var newX = 0; // cos(180) = 1
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if(angle < -22.5 && angle >= -67.5 ) {
	var radAngle = -45*Math.PI/180;
	var magnitude = distance * Math.cos(Math.abs(radians-radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else {
	console.log("Unhandled angle in queen attackvector function: "
		    + angle);
    }
}

function doRookAttackData(attackPoint, playerPos) {
    var deltaY = attackPoint.y - playerPos.y;
    var deltaX = attackPoint.x - playerPos.x;
    var radians = Math.atan2(deltaY, deltaX);
    var angle = 180 * radians/ Math.PI;
    var distance = getDistance(playerPos,
			       attackPoint);
    if(angle >= -45 && angle < 45 ) {
	var radAngle = -0*Math.PI/180;
	var magnitude = distance * Math.cos(
	    Math.abs(radians - radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if(angle >= 45 && angle < 135 ) {
	var radAngle = 90*Math.PI/180;
	var magnitude = distance * Math.cos(Math.abs(radians-radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if((angle > 135 && angle <= 180) ||
	      (angle >= -180 && angle < -135)) {
	var radAngle = Math.PI;
	var magnitude = distance * Math.cos(Math.abs(radians-radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else if(angle >= -135 && angle < -45 ) {
	var radAngle = -90*Math.PI/180;
	var magnitude = distance * Math.cos(Math.abs(radians-radAngle));
	var newY = Math.sin(radAngle)*magnitude;
	var newX = Math.cos(radAngle)*magnitude;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
					  playerPos.y + newY))];
    } else {
	console.log("Unhandled angle in rook attackvector function: "
		    + angle);
    }
}

function doKnightAttackData(attackPoint, playerPos) {
    var deltaY = attackPoint.y - playerPos.y;
    var deltaX = attackPoint.x - playerPos.x;
    var radians = Math.atan2(deltaY, deltaX);
    var angle = 180 * radians/ Math.PI;
    
    if(angle >= -90 && angle < -45 ) {
	var first = new coord(playerPos.x, playerPos.y-150);
	var second = new coord(playerPos.x+75, playerPos.y-150);
	return [doBoundaryCheck(first),
		doBoundaryCheck(second)];
    } else if(angle >= -45 && angle < 0 ) {
	var first = new coord(playerPos.x, playerPos.y-75);
	var second = new coord(playerPos.x+150, playerPos.y-75);
	return [doBoundaryCheck(first),
		doBoundaryCheck(second)];
    } else if(angle >= 0 && angle <= 45) {
	var first = new coord(playerPos.x, playerPos.y+75);
	var second = new coord(playerPos.x+145, playerPos.y+75);
	return [doBoundaryCheck(first),
		doBoundaryCheck(second)];
    } else if(angle >= 45 && angle < 90 ) {
	var first = new coord(playerPos.x, playerPos.y+150);
	var second = new coord(playerPos.x+75, playerPos.y+150);
	return [doBoundaryCheck(first),
		doBoundaryCheck(second)];
    } else if(angle >= 90 && angle < 135) {
	var first = new coord(playerPos.x, playerPos.y+150);
	var second = new coord(playerPos.x-75, playerPos.y+150);
	return [doBoundaryCheck(first),
		doBoundaryCheck(second)];
    } else if(angle >= 135 && angle < 180) {
	var first = new coord(playerPos.x, playerPos.y+75);
	var second = new coord(playerPos.x-150, playerPos.y+75);
	return [doBoundaryCheck(first),
		doBoundaryCheck(second)];
    } else if(angle >= -180 && angle < -135) {
	var first = new coord(playerPos.x, playerPos.y-75);
	var second = new coord(playerPos.x-150, playerPos.y-75);
	return [doBoundaryCheck(first),
		doBoundaryCheck(second)];
    } else if(angle >= -135 && angle < -90) {
	var first = new coord(playerPos.x, playerPos.y-150);
	var second = new coord(playerPos.x-75, playerPos.y-150);
	return [doBoundaryCheck(first),
		doBoundaryCheck(second)];
    } else {
	console.log("Unhandled angle in knight attackvector function: "
		    + angle);
    }
}

function doKingAttackData(attackPoint, playerPos) {
    var deltaY = attackPoint.y - playerPos.y;
    var deltaX = attackPoint.x - playerPos.x;
    var radians = Math.atan2(deltaY, deltaX);
    var angle = 180 * radians/ Math.PI;
    
    if( angle >= -22.5 && angle < 22.5) {
	var newX = 75; //cos(0)=1
	return [doBoundaryCheck(new coord(playerPos.x + newX,
						       playerPos.y))];
    } else if(angle >= 22.5 && angle < 67.5 ) {
	var newY = 75;
	var newX = 75
	return [doBoundaryCheck(new coord(playerPos.x + newX,
						       playerPos.y + newY))];
    } else if(angle >= 67.5 && angle < 112.5) {
	var newY = 75;
	return [doBoundaryCheck(new coord(playerPos.x,
						       playerPos.y + newY))];
    } else if(angle >= 112.5 && angle < 157.5 ) {
	var newY = 75;
	var newX = -75;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
						       playerPos.y + newY))];
    } else if((angle >= 157.5 && angle <= 180) ||
	      (angle < -157.5 && angle >= -180)) {
	var newX = -75;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
						       playerPos.y))];
    } else if(angle < -112.5 && angle >= -157.5 ) {
	var newY = -75
	var newX = -75
	return [doBoundaryCheck(new coord(playerPos.x + newX,
						       playerPos.y + newY))];
    } else if (angle < -67.5 && angle >= -112.5 ) {
	var newY = -75;
	return [doBoundaryCheck(new coord(playerPos.x,
						       playerPos.y + newY))];
    } else if(angle < -22.5 && angle >= -67.5 ) {
	var newY = -75;
	var newX = 75;
	return [doBoundaryCheck(new coord(playerPos.x + newX,
						       playerPos.y + newY))];
    } else {
	console.log("Unhandled angle in king attackvector function: "
		    + angle);
    }
}

function setLevels(playerType, playerSpeed) {
    levels =  
	[
	    {
		type: "level",
		name: "Level 1",
		player: {
		    type: playerType,
		    speed: playerSpeed
		},
		enemies: [{
		    type: "peasant",
		    speed: 5
		}]
	    },
	    {
		type: "level",
		name: "Level 2",
		player: {
		    type: playerType,
		    speed: playerSpeed
		},
		enemies: [{
		    type: "peasant",
		    speed: 8
		}, {
		    type: "peasant",
		    speed: 6
		}]
	    },
	    {
		type: "level",
		name: "Level 3",
		player: {
		    type: playerType,
		    speed: playerSpeed
		},
		enemies: [{
		    type: "bishop",
		    speed: 5
		}]
	    },{
		type: "level",
		name: "Level 4",
		player: {
		    type: playerType,
		    speed: playerSpeed
		},
		enemies: [{
		    type: "bishop",
		    speed: 3
		},{
		    type: "peasant",
		    speed: 8
		}]
	    },{
		type: "level",
		name: "Level 5",
		player: {
		    type: playerType,
		    speed: playerSpeed
		},
		enemies: [{
		    type: "knight",
		    speed: 5
		},{
		    type: "bishop",
		    speed: 5
		}]
	    },{
		type: "level",
		name: "Level 6",
		player: {
		    type: playerType,
		    speed: playerSpeed
		},
		enemies: [{
		    type: "peasant",
		    speed: 5
		},{
		    type: "peasant",
		    speed: 5
		},{
		    type: "knight",
		    speed: 2
		}]
	    },{
		type: "level",
		name: "Level 7",
		player: {
		    type: playerType,
		    speed: playerSpeed
		},
		enemies: [{
		    type: "rook",
		    speed: 5
		},{
		    type: "peasant",
		    speed: 5
		}]
	    },{
		type: "level",
		name: "Level 8",
		player: {
		    type: playerType,
		    speed: playerSpeed
		},
		enemies: [{
		    type: "rook",
		    speed: 8
		},{
		    type: "peasant",
		    speed: 8
		},{
		    type: "peasant",
		    speed: 8
		}]
	    }, {
		type: "level",
		name: "Level 9",
		player: {
		    type: playerType,
		    speed: playerSpeed
		},
		enemies: [{
		    type: "queen",
		    speed: 8
		},{
		    type: "bishop",
		    speed: 6
		},{
		    type: "king",
		    speed: 6
		}]
	    }];
}

$(document).ready(function() { 
    enchant();
    enchant.ENV.SOUND_ENABLED_ON_MOBILE_SAFARI = false;
    var game = new Game(g_window_x,g_window_y);
    var playerType = "queen";
    var playerSpeed = 8;
    var currentPlayerType = "queen";
    setLevels(currentPlayerType, playerSpeed);
    console.log(levels);
    var currentLevel = null;

    game.preload("images/pieces_spritemap.png");
    game.preload("images/board.png");
    game.onload = function() {
	game.pushScene(new StartGame());
    };
    game.start();

    var LevelScene = Class.create(Scene, {
	initialize: function(level) {
	    Scene.apply(this);
	    var bg = new Sprite(g_window_x, g_window_y);
	    bg.image = game.assets['images/board.png'];
	    this.addChild(bg);
	    if(level.player.type == "peasant") {
		var player = new gameChar('images/pieces_spritemap.png',
					   60, 60, 300, 500);
		this.addChild(player);
		this.player = player;
	    } else if(level.player.type == "queen") {
		var player = new queenChar('images/pieces_spritemap.png',
					   60, 60, 300, 500);
		this.addChild(player);
		this.player = player;
	    } else if(level.player.type == "bishop") {
		var player = new bishopChar('images/pieces_spritemap.png',
					   60, 60, 300, 500);
		this.addChild(player);
		this.player = player;
	    } else if(level.player.type == "rook") {
		var player = new rookChar('images/pieces_spritemap.png',
					   60, 60, 300, 500);
		this.addChild(player);
		this.player = player;
	    } else if(level.player.type == "knight") {
		var player = new knightChar('images/pieces_spritemap.png',
					   60, 60, 300, 500);
		this.addChild(player);
		this.player = player;
	    }
	    else if(level.player.type == "king") {
		var player = new kingChar('images/pieces_spritemap.png',
					   60, 60, 300, 500);
		this.addChild(player);
		this.player = player;
	    }
	    this.player.speed = level.player.speed;
	    for(var i=0; i < level.enemies.length; i++) {
		var x = Math.floor(Math.random()*(g_window_x-60));
		var enemy = null;
		if(level.enemies[i].type == "peasant") {
		    enemy = new Ai('images/pieces_spritemap.png',
				       60, 60, x, 100);
		} else if(level.enemies[i].type == "bishop") {
		    enemy = new bishopAi('images/pieces_spritemap.png',
					 60, 60, x, 100);
		} else if(level.enemies[i].type == "queen") {
		    enemy = new QueenAi('images/pieces_spritemap.png',
					60, 60, x, 100);
		} else if(level.enemies[i].type == "rook") {
		    enemy = new rookAi('images/pieces_spritemap.png',
					60, 60, x, 100);
		} else if(level.enemies[i].type == "knight") {
		    enemy = new knightAi('images/pieces_spritemap.png',
					60, 60, x, 100);
		} else if(level.enemies[i].type == "king") {
		    enemy = new kingAi('images/pieces_spritemap.png',
					60, 60, x, 100);
		}
		if(enemy) {
		    enemy.speed = level.enemies[i].speed;
		    this.player.enemies.push(enemy);
		    enemy.player = this.player;
		    this.addChild(enemy);
		}
	    }
	    var label = new Label(level.name);
	    label.x = 5;
	    label.y = 5;
	    label.width = 50;
	    label.height = 12;
	    label.font = "15px strong";
	    label.textAlign = "center";
	    this.scene.addChild(label);
	    	    
	    this.addEventListener("touchmove", this.handleTouchMove);
	    this.addEventListener("touchstart", this.handleTouchStart);
	    this.addEventListener("touchend", this.handleTouchEnd);
	    	    
	    this.touchStart = 0;
	    this.lastTap = 0;
	},
	handleTouchStart: function(e) {
	    var now = Date.now();
	    this.touchStart = now;
	    this.player.startMove(now);
	    this.player.updateMove(new coord(e.x, e.y));
	    
	},
	handleTouchEnd: function(e) {
	    this.player.updateMove(new coord(e.x, e.y));
	    this.player.stopMove();
	    var touchEnd = Date.now();
	    var touchDiff = touchEnd - this.touchStart;
	    if(touchDiff < 300) {
		if(touchEnd - this.lastTap < 300) {
		    // DoubleTap: Enter attack state
		    this.player.doAttack(new coord(e.x, e.y));
		} else {
		    //Tap
		}
		this.lastTap = Date.now();
	    } else {
		// Notap
	    }
	},
	handleTouchMove: function(e) {
	    this.player.updateMove(new coord(e.x, e.y));
	}
	
    });
    
    var gameChar = Class.create(Sprite, {
	initialize: function(img, width, height, x, y) {
	    Sprite.apply(this, [width, height]);
	    this.image = game.assets[img];
	    this.color="black";
	    this.isMoving = false;
	    this.isAttacking = false;
	    this.frame = 5;
	    this.type = "peasant"; 
	    this.x = x;
	    this.y = y;
	    this.toX = 0;
	    this.toY = 0;
	    this.attackVector = [];
	    this.speed = 8;
	    this.enemies=[];
	    this.delayMoveTs = 0;
	    this.addEventListener("enterframe", this.handleEnterFrame);
	},
	updateMove: function(toCoord) {
	    this.toY = toCoord.y;
	    this.toX = toCoord.x;
	},
	startMove: function(start) {
	    if(!this.isAttacking) {
		this.isMoving = true;
		this.delayMoveTs = start;
	    }
	},
	stopMove: function() {
	    this.isMoving=false;
	},
	doAttack: function(coord) {
	    this.isAttacking=true;
	    this.isMoving=false;
	    this.calculateAttackData(coord);
	},
	calculateAttackData: function(point) {
	    var deltaY = point.y - this.y;
	    var deltaX = point.x - this.x;
	    var angle = 180 * Math.atan2(deltaY, deltaX) / Math.PI;
	    
	    if( angle > -90 && angle < 90) {
		var attackAngle = (this.color=="black") ? -45 : 45
		var radAngle = attackAngle*Math.PI/180;
		var newY = Math.sin(radAngle)*70;
		var newX = Math.cos(radAngle)*70;
		this.attackVector = [doBoundaryCheck(new coord(this.x + newX,
							       this.y + newY))];
	    } else {
		var attackAngle = (this.color=="black") ? -135 : 135
		var radAngle = attackAngle*Math.PI/180;
		var newY = Math.sin(radAngle)*70;
		var newX = Math.cos(radAngle)*70;
		this.attackVector = [doBoundaryCheck(new coord(this.x + newX,
							       this.y + newY))];
	    }
	},
	doAttackMove: function() {
	    if(this.attackVector.length > 0) {
		// Get first point
		var first = this.attackVector[0];
		var newCoord = 
		    getNewPoint(new coord(this.x, this.y),
				new coord(first.x, first.y), 20);
		if(newCoord.x==first.x && newCoord.y==first.y) {
		    
		    // We have arrived at point, shift array
		    this.attackVector.shift();
		    if(this.attackVector.length == 0) {
			// Do collision detecting
			return true;
		    }
		}
		this.x = newCoord.x;
		this.y = newCoord.y;
	    } else {
		console.log("ERROR: got that player is attacking but " + 
			    " attackvector is empty");
	    }
	},
	doCollision: function(enemies) {
	    if(this.scene) {
		if(enemies.length > 0) {
		    for(var i=enemies.length-1; i>=0; i--) {
			if(this.within(enemies[i], 45)) {
			    var label = new FloatLabel(
				"Hit!", newCoord.x, newCoord.y-20);
			    label.x = newCoord.x;
			    label.y = newCoord.y-20;
			    label.font = "32px strong";
			    this.scene.addChild(label);
			    this.scene.removeChild(
				enemies[i]);
			    
			    enemies.splice(i, 1);
			} 
		    }
		    return enemies;
		} else {
		    console.log("Attacking enemy that is null");
		    return [];
		}
	    }
	},
	handleEnterFrame: function() {
	    if(this.enemies.length == 0) {
		var game = Game.instance;
		if(levels.length > 0) {
		    game.replaceScene(new LevelDone());
		} else {
		    var gameDone = new GameDone();
		    game.replaceScene(gameDone);
		}
	    }
	    if(this.isMoving && (Date.now() - this.delayMoveTs > 100)) {
		var newCoord = 
		    getNewPoint(new coord(this.x, this.y),
				new coord(this.toX, this.toY),
				this.speed);
		this.x = newCoord.x;
		this.y = newCoord.y;
	    }
	    if(this.isAttacking) {
		if(this.doAttackMove()) {
		    this.isAttacking = false;
		    this.enemies = this.doCollision(this.enemies);
		}
	    }
	    updatedCoord = doBoundaryCheck(new coord(this.x, this.y));
	    this.x = updatedCoord.x;
	    this.y = updatedCoord.y;
	}
	
    });
    var Ai = Class.create(gameChar, {
	initialize: function(img, width, height, x, y) {
	    gameChar.apply(this, [img, width, height, x, y]);
	    this.frame = 11;
	    this.speed = 0;
	    this.player = null;
	    this.color = "white";
	    this.toX = Math.floor(Math.random()*g_window_x);
	    this.toY = Math.floor(Math.random()*g_window_y);
	    this.comments = ["Peasants unite!",
			     "Farm this",
			     "You and me are Brothers!"];
	    this.lastCommentTime = Date.now();
	    this.attackWaitTime = 0;
	    this.attackAngle = 0;
	    this.latestPosTime = Date.now();
	    this.addEventListener("enterframe", this.handleEnterFrame);
	},
	getPlayerPos: function() {
	    var noiseX = 0;
	    var noiseY = 0;
	    if(Date.now() - this.latestPosTime > 1000) {
		noiseX = Math.floor(Math.random()*200);
		noiseY = Math.floor(Math.random()*200);
		noiseX = Math.random() > 0.5 ? noiseX : -noiseX;
		noiseY = Math.random() > 0.5 ? noiseY : -noiseY;
		this.latestPosTime = Date.now();
		console.log("NoiseX: " + noiseX + "  NoiseY: " + noiseY );
	    }
	    var x = this.player.x + noiseX;
	    var y = this.player.y + noiseY;
	    return new coord(x, y);
	},
	chooseAttackPos: function (playerPos) {
	    var angle1 = -135;
	    var angle2 = -45;
	
	    var radAngle1 = angle1*Math.PI/180;
	    var radAngle2 = angle2*Math.PI/180;
	    var deltaX1 = 75*Math.cos(radAngle1);
	    var deltaY1 = 75*Math.sin(radAngle1);
	    var deltaX2 = 75*Math.cos(radAngle2);
	    var deltaY2 = 75*Math.sin(radAngle2);
	    var pos1 = new coord(playerPos.x + deltaX1,
				 playerPos.y + deltaY1);
	    var pos2 = new coord(playerPos.x + deltaX2,
				 playerPos.y + deltaY2);
	    var aiPos = new coord(this.x, this.y);
	    var dist1 = getDistance(aiPos, pos1);
	    var dist2 = getDistance(aiPos, pos2);
	    if(dist1 >= dist2) {
		return pos2;
	    } else {
		return pos1;
	    }	    
	},
	handleEnterFrame: function(e) {
	    /* AI general strategy:
	    /* 1. Get best attack position, can do two attack moves there?
	    /* 2. Get to attacking position
            /* 3. If in attacking position
            /* 3.1 Do attack
	    /**/
	    if(this.player && ! this.isAttacking) {
		var playerPos = this.getPlayerPos();
		// First focus on attacking player, get in striking pos
		var chosenPos = this.chooseAttackPos(playerPos);
		this.toX = chosenPos.x;
		this.toY = chosenPos.y;
		var dist = getDistance(new coord(this.x, this.y),
				       chosenPos);
		if(dist < 8) {
		    this.attackWaitTime = Date.now();
		    this.stopMove();
		    this.doAttack(playerPos);
		}
		if(!this.isMoving && !this.isAttacking) {
		    this.startMove(100);
		}
	    }
	    if(this.isAttacking) {
		if(Date.now() - this.attackWaitTime > 100) {
		    if(this.doAttackMove()) {
			this.isAttacking = false;
			this.stopMove();
			var players = this.doCollision([this.player]);
			if(players.length==0) {
			    var game = Game.instance;
			    game.replaceScene(new PlayerDead());
			};
		    }
		}
	    }
	    
	    if(Math.random() > 0.95) {
		if(Date.now() - this.lastCommentTime > 8000) {
		    var i = Math.floor(Math.random()*this.comments.length);
		    var commentText = this.comments[i];
		    var comment = new FloatLabel(commentText, this.x-50, this.y - 10);
		    this.scene.addChild(comment);
		    this.lastCommentTime = Date.now();
		}
	    }
	    
	    newCoord = getNewPoint(new coord(this.x, this.y),
				   new coord(this.toX, this.toY),
				   this.speed);
	    
	    boundedCoord = doBoundaryCheck(newCoord);
	    this.x = newCoord.x;
	    this.y = newCoord.y;
	}
    });
    var FloatLabel = Class.create(Label, {
	initialize: function(text, x, y) {
	    Label.apply(this);
	    this.text = text;
	    this.x = x;
	    this.y = y;
	    this.font = "25px strong";
	    this.textAlign = "center";
	    this.addEventListener("enterframe", this.handleEnterFrame);
	    if(this.y > 100 ) {
		this.toCoord = new coord(this.x, this.y-100);
	    } else {
		this.toCoord = new coord(this.x, this.y);
	    }
	    this.speed = 1;
	},
	handleEnterFrame: function() {
	    var newTo = getNewPoint(new coord(this.x, this.y), this.toCoord, 
				    this.speed);
	    if(newTo.x == this.x && newTo.y == this.y) {
		this.scene.removeChild(this);
	    }
	    this.x = newTo.x;
	    this.y = newTo.y;
	}
    });
    var GameDone = Class.create(Scene, {
	initialize: function() {
	    Scene.apply(this);
	    
	    var label = new Label("Check Mate!");
	    label.x = 50;
	    label.y = 300;
	    label.width = 500;
	    label.height = 200;
	    label.font = "25px strong";
	    label.textAlign = "center";
	    this.scene.addChild(label);
	    
	    var label2 = new Label("Game is now completed");
	    label2.x = 50;
	    label2.y = 350;
	    label2.width = 500;
	    label2.height = 100;
	    label2.font = "25px strong";
	    label2.textAlign = "center";
	    this.scene.addChild(label2);
	    if(currentPlayerType != "peasant") {
		var label3 = new Label("Click to get a tougher challenge");
		label3.x = 50;
		label3.y = 500;
		label3.width = 500;
		label3.height = 50;
		label3.font = "18px strong";
		label3.textAlign = "center";
		this.scene.addChild(label3);
	    }
	    this.addEventListener("touchstart", this.handleTouchStart);
	},
	handleTouchStart: function() {
	    var game = Game.instance;
	    if(currentPlayerType != "peasant") {
		if(currentPlayerType == "queen") {
		    currentPlayerType = "rook";		    
		} else if(currentPlayerType == "rook") {
		    currentPlayerType = "bishop";
		} else if(currentPlayerType == "bishop") {
		    currentPlayerType = "knight";
		} else if(currentPlayerType == "knight") {
		    currentPlayerType = "king";
		} else if(currentPlayerType == "king") {
		    currentPlayerType = "peasant";
		}
		setLevels(currentPlayerType, playerSpeed);
		level = levels.shift();
		currentLevel = level;
		if(level.type == "level") {
		    game.replaceScene(new LevelScene(level));
		}
	    }
	}
    });
    var LevelDone = Class.create(Scene, {
	initialize: function() {
	    Scene.apply(this);
	    
	    var label = new Label("You won!");
	    label.x = 50;
	    label.y = 300;
	    label.width = 500;
	    label.height = 200;
	    label.font = "25px strong";
	    label.textAlign = "center";
	    this.scene.addChild(label);
	    
	    var label2 = new Label("Click to proceed to next level");
	    label2.x = 50;
	    label2.y = 350;
	    label2.width = 500;
	    label2.height = 100;
	    label2.font = "25px strong";
	    label2.textAlign = "center";
	    this.scene.addChild(label2);
	    this.addEventListener("touchstart", this.handleTouchStart);
	},
	handleTouchStart: function() {
	    var game = Game.instance;
	    if(levels.length > 0) {
		var level = levels.shift();
		currentLevel = level;
		if(level.type == "level") {
		    game.replaceScene(new LevelScene(level));
		}
	    } else {
		var gameDone = new GameDone();
		game.replaceScene(gameDone);
	    }
	}
    });
    var StartGame = Class.create(Scene, {
	initialize: function() {
	    Scene.apply(this);
	    
	    var label = new Label("Check Mate");
	    label.x = 50;
	    label.y = 100;
	    label.width = 500;
	    label.height = 100;
	    label.font = "32px strong";
	    label.textAlign = "center";
	    this.scene.addChild(label);
	    
	    var label2 = new Label("Click/tap and hold to move piece");
	    label2.x = 50;
	    label2.y = 200;
	    label2.width = 500;
	    label2.height = 100;
	    label2.font = "22px strong";
	    label2.textAlign = "center";
	    this.scene.addChild(label2);

	    var label3 = new Label("Double Click/Tap to attack");
	    label3.x = 50;
	    label3.y = 250;
	    label3.width = 500;
	    label3.height = 100;
	    label3.font = "22px strong";
	    label3.textAlign = "center";
	    this.scene.addChild(label3);
	    
	    var label3 = new Label("Click to start game");
	    label3.x = 50;
	    label3.y = 500;
	    label3.width = 500;
	    label3.height = 100;
	    label3.font = "32px strong";
	    label3.textAlign = "center";
	    this.scene.addChild(label3);
	    this.addEventListener("touchstart", this.handleTouchStart);
	},
	handleTouchStart: function() {
	    var game = Game.instance;
	    if(levels.length > 0) {
		var level = levels.shift();
		currentLevel = level;
		game.replaceScene(new LevelScene(level));
	    } else {
		var gameDone = new GameDone();
		game.replaceScene(gameDone);
	    }
	}
    });
    var PlayerDead = Class.create(Scene, {
	initialize: function() {

	    Scene.apply(this);
	    
	    var label = new Label("You died");
	    label.x = 50;
	    label.y = 300;
	    label.width = 500;
	    label.height = 200;
	    label.font = "25px strong";
	    label.textAlign = "center";
	    this.scene.addChild(label);
	    
	    var label2 = new Label("Click to replay level");
	    label2.x = 50;
	    label2.y = 350;
	    label2.width = 500;
	    label2.height = 100;
	    label2.font = "25px strong";
	    label2.textAlign = "center";
	    this.scene.addChild(label2);
	    this.addEventListener("touchstart", this.handleTouchStart);
	},
	handleTouchStart: function() {
	    var game = Game.instance;
	    game.replaceScene(new LevelScene(currentLevel));
	}
		
    });
    var queenChar = Class.create(gameChar, {
	initialize: function(img, width, height, x, y) {
	    gameChar.apply(this, [img, width, height, x, y]);
	    this.frame = 1;
	    this.type = "queen";
	    
	},
	calculateAttackData: function(attackPoint) {
	    var attackVector = 
		doQueenAttackData(attackPoint, new coord(this.x, this.y));
	    this.attackVector = attackVector;	
	}	
    });

    var bishopChar = Class.create(gameChar, {
	initialize: function(img, width, height, x, y) {
	    gameChar.apply(this, [img, width, height, x, y]);
	    this.frame = 3;
	    this.type = "bishop";
	    
	},
	calculateAttackData: function(attackPoint) {
	    var attackVector = 
		doBishopAttackData(attackPoint, new coord(this.x, this.y));
	    this.attackVector = attackVector;	
	}
    });

    var rookChar = Class.create(gameChar, {
	initialize: function(img, width, height, x, y) {
	    gameChar.apply(this, [img, width, height, x, y]);
	    this.frame = 2;
	    this.type = "rook";
	},
	calculateAttackData: function(attackPoint) {
	    var attackVector = 
		doRookAttackData(attackPoint, new coord(this.x, this.y));
	    this.attackVector = attackVector;
	} 
	
    });

    var knightChar = Class.create(gameChar, {
	initialize: function(img, width, height, x, y) {
	    gameChar.apply(this, [img, width, height, x, y]);
	    this.frame = 4;
	    this.type = "knight";
	    
	},
	calculateAttackData: function(attackPoint) {
	    var attackVector = 
		doKnightAttackData(attackPoint, new coord(this.x, this.y));
	    this.attackVector = attackVector;	
	} 
	
    });

    var kingChar = Class.create(gameChar, {
	initialize: function(img, width, height, x, y) {
	    gameChar.apply(this, [img, width, height, x, y]);
	    this.frame = 0;
	    this.type = "king";
	    
	},
	calculateAttackData: function(point) {
	    var attackVector = 
		doKingAttackData(attackPoint, new coord(this.x, this.y));
	    this.attackVector = attackVector;
	} 
	
    });
    var bishopAi = Class.create(Ai, {
	initialize: function(img, width, height, x, y) {
	    gameChar.apply(this, [img, width, height, x, y]);
	    this.frame = 9;
	    this.type = "bishop";	    
	},
	calculateAttackData: function(attackPoint) {
	    var attackVector = 
		doBishopAttackData(attackPoint, new coord(this.x, this.y));
	    this.attackVector = attackVector;	
	},
	chooseAttackPos: function(playerPos) {
	    // Find angle to player
	    // Then find smallest angle to attackangle
	    var dist = getDistance(playerPos, new coord(this.x, this.y));
	    var deltaY = this.y - playerPos.y;
	    var deltaX = this.x - playerPos.x;
	    var radians = Math.atan2(deltaY, deltaX);
	    var angle = 180 * radians/ Math.PI;
	    var radAngle;
	    if(angle > -180 && angle <= -90) {
		radAngle = -135*Math.PI/180;
	    } else if(angle > -90 && angle <= 0) {
		radAngle = -45*Math.PI/180;
	    } else if(angle > 0 && angle <= 90) {
		radAngle = 45*Math.PI/180;
	    } else if(angle > 90 && angle <= 180) {
		radAngle = 135*Math.PI/180;
	    }
	    var newX = dist * Math.cos(radAngle);
	    var newY = dist * Math.sin(radAngle);
	    if(playerPos.x + newX < 0) {
		if(newY > 0) {
		    return new coord(0, playerPos.y+playerPos.x);
		} else {
		    return new coord(0, playerPos.y-playerPos.x);
		}		
	    } else if(playerPos.x + newX > g_window_x) {
		if(newY > 0) {
		    return new coord(g_window_x, playerPos.y+playerPos.x);
		} else {
		    return new coord(g_window_x, playerPos.y-playerPos.x);
		}
	    } else {
		return new coord(playerPos.x + newX,
				 playerPos.y + newY);
	    }
	}
    });
    var QueenAi = Class.create(Ai, {
	initialize: function(img, width, height, x, y) {
	    gameChar.apply(this, [img, width, height, x, y]);
	    this.frame = 7;
	    this.type = "queen";	    
	},
	calculateAttackData: function(attackPoint) {
	    var attackVector = 
		doQueenAttackData(attackPoint, new coord(this.x, this.y));
	    this.attackVector = attackVector;	
	},
	chooseAttackPos: function(playerPos) {
	    // Find angle to player
	    // Then find smallest angle to attackangle
	    var dist = getDistance(playerPos, new coord(this.x, this.y));
	    var deltaY = this.y - playerPos.y;
	    var deltaX = this.x - playerPos.x;
	    var radians = Math.atan2(deltaY, deltaX);
	    var angle = 180 * radians/ Math.PI;
	    var radAngle=0;
	    if(angle > -157.5 && angle <= -112.5) {
		radAngle = -135*Math.PI/180;
	    } else if(angle > -112.5 && angle <= -67.5) {
		radAngle = -90*Math.PI/180;
	    } else if(angle > -67.5 && angle <= -22.5) {
		radAngle = -45*Math.PI/180;
	    } else if(angle > -22.5 && angle <= 22.5) {
		radAngle = 0
	    } else if(angle > 22.5 && angle <= 67.5) {
		radAngle = 45*Math.PI/180;
	    } else if(angle > 67.5 && angle <= 112.5) {
		radAngle = 90*Math.PI/180;
	    } else if(angle > 112.5 && angle <= 157.5) {
		radAngle = 135*Math.PI/180;
	    } else if((angle > 157.5 && angle <= 180) || 
		      (angle > -180 <= -157.5)) {
		radAngle = -180*Math.PI/180;
	    }
	    var newX = dist * Math.cos(radAngle);
	    var newY = dist * Math.sin(radAngle);
	    if(playerPos.x + newX < 0) {
		if(newY > 0) {
		    return new coord(0, playerPos.y+playerPos.x);
		} else {
		    return new coord(0, playerPos.y-playerPos.x);
		}		
	    } else if(playerPos.x + newX > g_window_x) {
		if(newY > 0) {
		    return new coord(g_window_x, playerPos.y+playerPos.x);
		} else {
		    return new coord(g_window_x, playerPos.y-playerPos.x);
		}
	    } else {
		return new coord(playerPos.x + newX,
				 playerPos.y + newY);
	    }
	}
    });
    var rookAi = Class.create(Ai, {
	initialize: function(img, width, height, x, y) {
	    gameChar.apply(this, [img, width, height, x, y]);
	    this.frame = 8;
	    this.type = "rook";	    
	},
	calculateAttackData: function(attackPoint) {
	    var attackVector = 
		doRookAttackData(attackPoint, new coord(this.x, this.y));
	    this.attackVector = attackVector;	
	},
	chooseAttackPos: function(playerPos) {
	    // Find angle to player
	    // Then find smallest angle to attackangle
	    var dist = getDistance(playerPos, new coord(this.x, this.y));
	    var deltaY = this.y - playerPos.y;
	    var deltaX = this.x - playerPos.x;
	    var radians = Math.atan2(deltaY, deltaX);
	    var angle = 180 * radians/ Math.PI;
	    var radAngle;
	    if(angle > -135 && angle <= -45) {
		radAngle = -90*Math.PI/180;
	    } else if(angle > -45 && angle <= 45) {
		radAngle = 0;
	    } else if(angle > 45 && angle <= 135) {
		radAngle = 90*Math.PI/180;
	    } else if((angle > 135 && angle <= 180) ||
		      (angle <= -135 && angle > -180)) {
		radAngle = 180*Math.PI/180;
	    }
	    var newX = dist * Math.cos(radAngle);
	    var newY = dist * Math.sin(radAngle);
	    
	    return new coord(playerPos.x + newX,
			     playerPos.y + newY);
	    
	}
    });
    var knightAi = Class.create(Ai, {
	initialize: function(img, width, height, x, y) {
	    gameChar.apply(this, [img, width, height, x, y]);
	    this.frame = 10;
	    this.type = "knight";	    
	},
	calculateAttackData: function(attackPoint) {
	    var attackVector = 
		doKnightAttackData(attackPoint, new coord(this.x, this.y));
	    this.attackVector = attackVector;	
	},
	chooseAttackPos: function(playerPos) {
	    var deltaY = this.y - playerPos.y;
	    var deltaX = this.x - playerPos.x;
	    var radians = Math.atan2(deltaY, deltaX);
	    var angle = 180 * radians/ Math.PI;
	    if(angle >= -180 && angle < -135 ) {
		return new coord(playerPos.x-150, playerPos.y-75);
	    } else if(angle >= -135 && angle < -90) {
		return new coord(playerPos.x-75, playerPos.y-150);
	    } else if(angle >= -90 && angle <= -45) {
		return new coord(playerPos.x+75, playerPos.y-150);
	    } else if(angle >= -45 && angle < 0 ) {
		return new coord(playerPos.x+150, playerPos.y-75);
	    } else if(angle >= 0 && angle < 45) {
		return new coord(playerPos.x+150, playerPos.y+75);		
	    } else if(angle >= 45 && angle < 90) {
		return new coord(playerPos.x+150, playerPos.y+150);
	    } else if(angle >= 90 && angle < 135) {
		return new coord(playerPos.x+150, playerPos.y+75);
	    } else if(angle >= 135 && angle < 180) {
		return new coord(playerPos.x-150, playerPos.y+75);
	    } else {
		console.log("Unhandled angle in knight attackvector function: "
			    + angle);
	    }
	    
	}
    });
    var kingAi = Class.create(Ai, {
	initialize: function(img, width, height, x, y) {
	    gameChar.apply(this, [img, width, height, x, y]);
	    this.frame = 6;
	    this.type = "king";	    
	},
	calculateAttackData: function(attackPoint) {
	    var attackVector = 
		doKingAttackData(attackPoint, new coord(this.x, this.y));
	    this.attackVector = attackVector;	
	},
	chooseAttackPos: function(playerPos) {
	    var deltaY = this.y - playerPos.y;
	    var deltaX = this.x - playerPos.x;
	    var radians = Math.atan2(deltaY, deltaX);
	    var angle = 180 * radians/ Math.PI;
	    if(((angle >= -180 && angle < -135) ||
		(angle >= 135 && angle < 180)) && playerPos.x > 75) {
		return new coord(playerPos.x-75, playerPos.y);
	    } else if(angle >= -135 && angle < -45 && playerPos.y > 75) {
		return new coord(playerPos.x, playerPos.y-75);
	    } else if(angle >= -45 && angle < 45 &&
		      playerPos.x < g_window_x-60) {
		return new coord(playerPos.x+75, playerPos.y);
	    } else if(angle >= 45 && angle < 135 && 
		      playerPos.y < g_window_y-60) {
		return new coord(playerPos.x, playerPos.y+75);
	    } else {
		console.log("Unhandled angle in knight attackvector function: "
			    + angle);
	    }
	    
	}
    });
});


