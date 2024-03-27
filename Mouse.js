class Mouse{
    element = null;

    under = false; // чи знаходиться мишка над нашим елементом
    previousUnder = false; // чи була вона під час минулого тіку над нашом елементом

    // координати миші
    x = null;
    y = null;

    // координати миші в минулий тік
    previousX = null;
    previousY = null;

    // натискання лівої клавіши миші в цей тік та минулий
    left = false;
    previousLeft = false;

    // прокручування миші, та чи була вона прокручена (наверх +, вниз -)
    delta = 0;
    previousDelta = 0;

    constructor (element){
        this.element = element;

        const update = (e) => {
            this.x = e.clientX;
            this.y = e.clientY;
            this.under = true;
            this.delta = 0;
        }

        element.addEventListener('mousemove', (e) => {
            this.tick();
            update(e);
        });
        element.addEventListener('mouseenter', (e) => {
            this.tick();
            update(e);
        });
        element.addEventListener('mouseleave', e => {
            this.tick();
            update(e);

            this.under = false;
        });
        element.addEventListener('mousedown', (e) => {
            this.tick();
            update(e);

            if (e.button === 0){
                this.left = true;
            }
        });
        element.addEventListener('mouseup', (e) => {
            this.tick();
            update(e);

            if (e.button === 0){
                this.left = false;
            }
        });
        element.addEventListener('wheel', (e) => {
            this.tick();

            this.x = e.clientX;
            this.y = e.clientY;
            this.under = true;
            this.delta = e.deltaY > 0 ? 1 : -1;
        });

    }

    // прописуємо tick де будемо записувати минулі значення, для контролю їх
    tick() {
        this.previousX = this.x;
        this.previousY = this.y;
        this.previousUnder = this.under;
        this.previousLeft = this.left;
        this.previousDelta = this.delta;
        this.delta = 0;
    }

}