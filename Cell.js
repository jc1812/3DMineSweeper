
function Cell(x, y, z, size) {
    this.index = [x, y, z];
    this.x = x * size;
    this.y = y * size;
    this.z = z * size;
    this.size = size;
    this.neighbourCount = 0;
    if(random(1) < percentBombs) {
        this.bomb = true;
    } else {
        this.bomb = false;
    }
    this.revealed = false;
}

Cell.prototype.show = function(selected) {
    translate(this.x, this.y, this.z);
    if(selected) {
        stroke('rgba(255, 0, 0, 1)');
        fill('rgba(160, 75, 0, 0.7)');
        box(this.size);
    } else {
        stroke(0);
        fill('rgba(255, 255, 255, 0.5)');
    }

    if(this.revealed) {
        if(this.bomb) {
            fill('rgba(255, 33, 0, 0.5)');
            sphere(11, 10, 10);
        } else {
            if(this.neighbourCount > 0) {
                can.background('rgba(251, 0, 133, 0.7)');
                can.textAlign(CENTER, CENTER);
                can.text(this.neighbourCount, 10, 10);
                texture(can);
                noStroke();
                plane(15, 15);
            }
        }
    } else {
        box(this.size);
    }

    translate(-this.x, -this.y, -this.z);
}

Cell.prototype.hit = function() {
    this.revealed = true;
    if(this.neighbourCount === 0) {
        this.floodFill();
    }
}

Cell.prototype.floodFill = function() {
    for(let x=-1; x <= 1; x++) {
        for(let y=-1; y <= 1; y++) {
            for(let z=-1; z <= 1; z++) {
                let posX = this.index[0]+x;
                let posY = this.index[1]+y;
                let posZ = this.index[2]+z;
                if(posX > -1 && posX < cubeAxisLength) {
                    if(posY > -1 && posY < cubeAxisLength) {
                        if(posZ > -1 && posZ < cubeAxisLength) {
                            let neighbour = map[posX][posY][posZ];
                            if(!neighbour.bomb && !neighbour.revealed) {
                                neighbour.hit();
                            }
                        }
                    }
                }
            }
        }
    }
}

Cell.prototype.countBombs = function() {
    if(this.bomb) {
        this.neighbourCount = -1;
        return;
    }
    let total = 0;

    for(let x=-1; x <= 1; x++) {
        for(let y=-1; y <= 1; y++) {
            for(let z=-1; z <= 1; z++) {
                let posX = this.index[0]+x;
                let posY = this.index[1]+y;
                let posZ = this.index[2]+z;
                if(posX > -1 && posX < cubeAxisLength) {
                    if(posY > -1 && posY < cubeAxisLength) {
                        if(posZ > -1 && posZ < cubeAxisLength) {
                            let neighbour = map[posX][posY][posZ];
                            if(neighbour.bomb) {
                                total++;
                            }
                        }
                    }
                }
            }
        }
    }

    this.neighbourCount = total;
}