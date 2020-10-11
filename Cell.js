
function Cell(x, y, z, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
    if(random(1) < 0.4) {
        this.bomb = true;
    } else {
        this.bomb = false;
    }
    this.revealed = false;
}

Cell.prototype.show = function() {
    stroke(0);
    fill('rgba(255, 255, 255, 0.5)');
    translate(this.x, this.y, this.z);

    if(this.revealed) {
        if(this.bomb) {
            //translate(this.size/2, this.size/2, this.size/2);
            fill('rgba(0, 133, 255, 0.5)');
            sphere(11, 10, 10);
            //translate(-(this.size/2), -(this.size/2), -(this.size/2));
        }
    } else {
        box(this.size);
    }

    translate(-this.x, -this.y, -this.z);
}

