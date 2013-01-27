/**
 * The Jungle is the master container for the Jungle framework
 * @author Blake Loring
 */

function Jungle(connectionDetails, canvas, logFunction) {

	this.log = logFunction;
	this.log("Jungle", "Creating JungleNet");

	this.net = new JungleNet(connectionDetails, this);

	this.log("Jungle", "Initializing stage");
	this.stage = new createjs.Stage(canvas);

	this.status = new createjs.Text("Connecting");

	this.stage.addChild(this.status);
	var stage = this.stage;

	var map = new Image();
	map.src = './dirt.jpg';

	map.onload = function() {
		
		var container = new createjs.Container();
		container.scaleY = 0.5;

		var mapBits = new createjs.Bitmap(map);
		
		mapBits.setWidth(64);
		mapBits.setHeight(64);
		
		mapBits.x = 500;
		mapBits.y = 300;
		mapBits.rotation = 45.0;
		
		container.addChild(mapBits);

		stage.addChild(container);
	}
	//Make sure this objects tick function is run repeatedly
	createjs.Ticker.addListener(this);
	createjs.Ticker.useRAF = true;

	//Target is 60FPS
	createjs.Ticker.setFPS(60);
}

/**
 * On connection JungleNet callback
 */
Jungle.prototype.connected = function() {
	this.log("Jungle", "Connected");
	this.status.text = "Connected";
}
/**
 * On failure JungleNet callback
 */

Jungle.prototype.failure = function(reason) {
	this.log("Jungle", "Connection failure " + reason);
	this.status.text = "Closed: " + reason;
}
/**
 * On data JungleNet callback
 */

Jungle.prototype.data = function(data) {

	this.log("Jungle", "Received Packet " + data);

	//If it is a chat message print it to the log
	if (data.Command == "Chat") {

		this.log("Chat", data.Data);

	}
}
/**
 * Frame redraw function
 */
Jungle.prototype.draw = function() {

	//Redraw the canvas
	this.stage.update();

}
/**
 * Frame tick function
 */
Jungle.prototype.tick = function() {
	this.draw();
}
