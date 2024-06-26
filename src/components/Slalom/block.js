export class Block {
    constructor(ctx, x, y, height) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.height = height;
        this.initX = x;
        this.initY = y;
    }

    get top() {
        return this.y;
    }

    set top(y) {
        this.y = y;
    }

    get left() {
        return this.x;
    }

    set left(x) {
        this.x = x;
    }

    traingle(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 10, y + this.height);
        this.ctx.lineTo(x - 10, y + this.height);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.ctx.fill();
    }

    box(x, y, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.rect(x, y, this.height, this.height);
        this.ctx.stroke();
        this.ctx.fill();
    }

    draw() {
        this.traingle(this.x, this.y, "green");
        this.traingle(this.x + 150, this.y, "red");
    }

    reset() {
        this.x = this.initX;
        this.y = this.initY;
    }
}