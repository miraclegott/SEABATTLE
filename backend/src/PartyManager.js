const Party = require('./Party');
const Player = require('./Player');
const Ship = require('./Ship');

module.exports = class PartyManager {
    players = [];
    parties = [];

    waitingForRandomPlayers = [];

    connection (socket) {
        const player = new Player(socket);
        this.players.push(player);

        socket.on('shipSet', (ships) => {
            if (this.waitingForRandomPlayers.includes(player)) {
				return;
			}
            
            if (player.party) {
                return 
            }

            player.battlefield.clear();
            for (const {size, direction, x, y} of ships) {
                const ship = new Ship(size, direction);
                player.battlefield.addShip(ship, x, y);
            }
        })

        socket.on("findRandomOpponent", () => {
            if (this.waitingForRandomPlayers.includes(player)) {
                return;
            }

            if (player.party) {
                return;
            }

            this.waitingForRandomPlayers.push(player);
            player.emit('statusChange', "randomOpponentFinding");

            if (this.waitingForRandomPlayers.length >= 2) {
                const [player1, player2] = this.waitingForRandomPlayers.splice(0, 2);
                const party = new Party(player1, player2);
                this.parties.push(party);

                const unsubscribe = party.subscribe(() => {
                    this.removeParty(party);
                    unsubscribe();
                });
            }
        });

        socket.on('gaveup', () => {
            if (player.party) {
                player.party.gaveup(player);
            }
        });

        socket.on('addShot', (x, y) => {
            if (player.party) {
                player.party.addShot(player, x, y);
            }
        });
    }

    disconnect (socket) {
        const player = this.players.find(player => player.socket === socket);

        if (!player) {
            return; 
        } 

        if (player.party) {
            player.party.gaveup(player);
        }

        if (this.waitingForRandomPlayers.includes(player)) {
            const index = this.waitingForRandomPlayers.indexOf(player);
            this.waitingForRandomPlayers.splice(index, 1);
        }
    }
    
    addPlayer (player) {
        if (this.players.includes(player)) {
            return false;
        }

        this.players.push(player);
        return true;
    }

    removePlayer (player) {
        if (!this.players.includes(player)) {
            return false;
        }
        const index = this.players.indexOf(player);
        this.players.splice(index, 1);

        if (this.waitingForRandomPlayers.includes(player)) {
            const index = this.waitingForRandomPlayers.indexOf(player);
            this.waitingForRandomPlayers.splice(index, 1);
        }

        return true;
    }

    removeAllPlayers () {
        const players = this.player.slice();

        for (const player of players) {
            this.removePlayer(player);
        }

        return players.length;
    }

    addParty (party) {
        if (this.parties.includes(party)) {
            return false;
        }

        this.parties.push(party);
        return true;
    }

    removeParty (party) {
        if (!this.parties.includes(party)) {
            return false;
        }

        const index = this.parties.indexOf(party);
        this.parties.splice(index, 1);

        return true;
    }

    removeAllParties () {
        const parties = this.party.slice();
        
        for (const party of parties) {
            this.removeParty(party);
        }

        return parties.length;
    }

    playRandom (player) {
        if(this.waitingForRandomPlayers.includes(player)) {
            return false;
        }

        this.waitingForRandomPlayers.push(player);

        if (this.waitingForRandomPlayers.length >= 2) {
            const [player1, player2] = this.waitingForRandomPlayers.splice(0, 2);
            const party = new Party(player1, player2,); 
            this.addParty(party);
        }

        return true;
    }
}