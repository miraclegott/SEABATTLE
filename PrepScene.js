const shipList = [
	{ size: 4, direction: "row", startX: 10, startY: 345 },
	{ size: 3, direction: "row", startX: 10, startY: 390 },
	{ size: 3, direction: "row", startX: 120, startY: 390 },
	{ size: 2, direction: "row", startX: 10, startY: 435 },
	{ size: 2, direction: "row", startX: 88, startY: 435 },
	{ size: 2, direction: "row", startX: 167, startY: 435 },
	{ size: 1, direction: "row", startX: 10, startY: 480 },
	{ size: 1, direction: "row", startX: 55, startY: 480 },
	{ size: 1, direction: "row", startX: 100, startY: 480 },
	{ size: 1, direction: "row", startX: 145, startY: 480 },
];

class PrepScene extends Scene{

    draggedShip = null;
    draggedOffsetX = 0;
    draggedOffsetY = 0;

    init(){
        // console.log('Prep init');
        const {player} = this.app;
        for (const {size, direction, startX, startY} of shipList) {
            const ship = new ShipView(size, direction, startX, startY);
            player.addShip(ship);
        }
    }
    start(){
        // console.log('Prep start');
    }
    update(){
        // console.log('Prep update');
        const {mouse, player} = this.app;
        // думаємо почати тягнути корабель
        if(!this.draggedShip && mouse.left && !mouse.pLeft){
            const ship = player.ships.find((ship) => ship.isUnder(mouse));

            if(ship){
                const shipRect = ship.div.getBoundingClientRect();
                
                this.draggedShip = ship;
                this.draggedOffsetX = mouse.x - shipRect.left;
                this.draggedOffsetY = mouse.y - shipRect.top;
            }
        }
        // перетягуємо
        if (mouse.left && this.draggedShip){
            const { left, top } = player.root.getBoundingClientRect();
			const x = mouse.x - left - this.draggedOffsetX;
			const y = mouse.y - top - this.draggedOffsetY;

			this.draggedShip.div.style.left = `${x}px`;
			this.draggedShip.div.style.top = `${y}px`;
        }

        // кидаємо корабель
        if (!mouse.left && this.draggedShip){
            this.draggedShip = null;
        }

        // поворот
        if (this.draggedShip && mouse.delta){
            this.draggedShip.toggleDirection();
        }
    }
    stop(){
        // console.log('Prep stop');
    }
}