/**
 * Networking portion of the Jungle framework
 * @author Blake Loring
 */

function JungleNet(details, callbacks) {

	//Store the connection details
	this.details = details;

	//Store the callbacks
	this.callbacks = callbacks;

	//Set logged in to false
	this.loggedIn = false;

	//Open a new socket
        this.socket = new WebSocket(details.Address);

	//Store a reference to this so the callbacks can work
	var thisReference = this;

	//Set the sockets connection listener to the onConnect function
	this.socket.onopen = function(evt) {
		thisReference.onConnect(evt);
	}

	//Route all messages to the right place
	this.socket.onmessage = function(evt) {
		thisReference.onMessage(evt);
	}

	//Set the close listener
	this.socket.onclose = function(evt) {
		thisReference.onClose(evt.reason);
	}

}

/**
 * Function to send a message
 */

JungleNet.prototype.Send = function(object) {
	var encoded = $.toJSON(object);
	this.socket.send(encoded);
}

/**
 * Function to process every message received
 */

JungleNet.prototype.onMessage = function(evt) {

	var incoming = $.parseJSON(evt.data);

	console.log(incoming);

	if (incoming.Command == "Disconnect") {

		//Call the onClose function with the reason given by the message
		this.onClose(incoming.Data);

		//Remove the socket onclose function so that onClose doesn't get called twice
		this.socket.onclose = null;

		//And finally close the connection
		this.socket.close();
	} else {

		this.callbacks.data(incoming);

	}
}

JungleNet.prototype.onConnect = function(evt) {
	console.log("Connected");

	var loginRequest = new Object();

	loginRequest.Email = this.details.Email;
	loginRequest.Password = this.details.Password;

	this.Send(loginRequest);

	var chatMessage = new Object();
	

	chatMessage.Command = "Chat";
	chatMessage.Data = "BOOM CHICA";

	this.Send(chatMessage);

	this.callbacks.connected();
}

JungleNet.prototype.onClose = function(reason) {
	console.log("Closed");
	this.callbacks.failure(reason);
}

/**
 * Connection details, stores username password and address
 */
function JungleNetConnectionDetails(email, password, address) {
	this.Email = email;
	this.Password = password;
	this.Address = address;
}
