class OnlineScene extends Scene {
    status = '';
    actionsBar = null; 

    ownTurn = false;

    init () {
        const actionsBar = document.querySelector('[data-scene="online"]');
        this.actionsBar = actionsBar;

        const {socket} = this.app;
        
        socket.on('statusChange', (status) => {
            console.log('statusChange');
            this.status = status;
            this.statusUpdate();
        });

        socket.on("turnUpdate", (ownTurn) => {
            console.log('turnUpdate');
            this.ownTurn = ownTurn;
            this.statusUpdate();
        })

        socket.on('addShot', ({x, y, variant}) => {
            const shot = new ShotView(x, y, variant);

            if (this.ownTurn) {
                this.app.opponent.addShot(shot);
            }
            else {
                this.app.player.addShot(shot);
            }
        });

        socket.on('setShots', (shots) => {
            const battlefield = this.ownTurn ? this.app.player : this.app.opponent;
            battlefield.removeAllShots();

            for (const {x, y, variant} of shots) {
                const shot = new ShotView(x, y, variant);
                battlefield.addShot(shot);
            }
        })

        this.statusUpdate();
    }
    start (variant){
        const {socket, player} = this.app;

        socket.emit('shipSet', player.ships.map(ship => ({size: ship.size, direction: ship.direction, x: ship.x, y: ship.y})));
        
        socket.emit('findRandomOpponent');

        document
			.querySelectorAll(".app-actions")
			.forEach((element) => element.classList.add("hidden"));

		document
			.querySelector('[data-scene="online"]')
			.classList.remove("hidden");

        this.statusUpdate();
    }

    statusUpdate () {
        const statusDiv = this.actionsBar.querySelector('.battlefield-status');

        if (!this.status) {
            statusDiv.textContent = '';
        }

        else if (this.status === 'randomOpponentFinding') {
            statusDiv.textContent = 'Пошук випадкового гравця';
        }

        else if (this.status === 'play') {
            statusDiv.textContent = this.ownTurn ? "Ваш хід" : "Хід суперника";
        }
    }

    update () {
        const {mouse, opponent, socket} = this.app; 

        const cells = opponent.cells.flat();
        cells.forEach(x => x.classList.remove('battlefield-item__active'));

        if (opponent.isUnder(mouse)) {
            const cell = opponent.cells.flat().find(cell => isUnderPoint(mouse, cell));

            if (cell) {
                cell.classList.add('battlefield-item__active');

                if (mouse.left && !mouse.pLeft) {
                    const x = parseInt(cell.dataset.x);
                    const y = parseInt(cell.dataset.y);
                    socket.emit('addShot', x, y);
                }
            }
        }
    }
}