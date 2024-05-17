const Battlefield = require("./Battlefield");

module.exports = class Player {
    battlefield = new Battlefield();
    socket = null; 
    party = null;

    get ready () {
        if (!this.battlefield.complete) {
            return false;
        }
        if (this.party) {
            return false;
        }

        if (!this.socket) {
            return false; 
        }

        return true;
    }

    constructor (socket) {
        this.socket = socket;
    }

    on(...args) {
		if (this.socket && this.socket.connected) {
			this.socket.on(...args);
		}
	}

    emit(...args) {
		if (this.socket && this.socket.connected) {
			this.socket.emit(...args);
		}
	}
}