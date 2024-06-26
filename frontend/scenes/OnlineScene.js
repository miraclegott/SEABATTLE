class OnlineScene extends Scene {
    status = '';
    actionsBar = null; 

    ownTurn = false;

    removeEventListeners = [];

    init () {
        const actionsBar = document.querySelector('[data-scene="online"]');
        this.actionsBar = actionsBar;

        const {socket, player, opponent} = this.app;
        
        socket.on('statusChange', (status) => {
            // console.log('statusChange');
            this.status = status;
            this.statusUpdate();
        });

        socket.on("turnUpdate", (ownTurn) => {
            // console.log('turnUpdate');
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

        socket.on('setShots', (ownShots, opponentShots) => {
            player.removeAllShots();

            for (const {x, y, variant} of ownShots) {
                const shot = new ShotView(x, y, variant);
                player.addShot(shot);
            }

            opponent.removeAllShots();

            for (const {x, y, variant} of opponentShots) {
                const shot = new ShotView(x, y, variant);
                opponent.addShot(shot);
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

		const sceneActionsBar = document.querySelector('[data-scene="online"]');
        sceneActionsBar.classList.remove("hidden");

        const gaveupButton = sceneActionsBar.querySelector ('[data-action="gaveup"]');
        const againButton = sceneActionsBar.querySelector ('[data-action="again"]');

        gaveupButton.classList.remove('hidden');
        againButton.classList.add('hidden');

        this.removeEventListeners = [];

        this.removeEventListeners.push(addListener(gaveupButton, 'click', () => {
            socket.emit('gaveup');
            this.app.start('preparation')
        }));

        this.removeEventListeners.push(addListener(againButton, 'click', () => {
            this.app.start('preparation')
        }));

        this.statusUpdate();
    }

    stop () {
        for (const removeEventListener of this.removeEventListeners) {
            removeEventListener();
        } 
        
        this.removeEventListeners = [];
    }

    statusUpdate () {
        const statusDiv = this.actionsBar.querySelector('.battlefield-status');

        if (!this.status) {
            statusDiv.textContent = '';
        }

        else if (this.status === 'randomOpponentFinding') {
            statusDiv.textContent = 'Пошук противника';
        }

        else if (this.status === 'play') {
            statusDiv.textContent = this.ownTurn ? "Ваш хід" : "Хід суперника";
        }

        else if (this.status === 'winner') {
            statusDiv.textContent = 'Перемога =)';
        }

        else if (this.status === 'loser') {
            statusDiv.textContent = 'Поразка =(';
        }
    }

    update () {
        const {mouse, opponent, player, socket} = this.app; 

        const cells = opponent.cells.flat();
        cells.forEach((x) => x.classList.remove('battlefield-item__active'));

        if (['loser', 'winner'].includes(this.status)) {
            const sceneActionsBar = document.querySelector('[data-scene="online"]');
            const gaveupButton = sceneActionsBar.querySelector ('[data-action="gaveup"]');
            const againButton = sceneActionsBar.querySelector ('[data-action="again"]');

            gaveupButton.classList.add('hidden');
            againButton.classList.remove('hidden');
        }

        if (player.loser) {
            return
        } 

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