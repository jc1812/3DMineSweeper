
function Cell(x, y, z, size) {
    this.index = [x, y, z];
    this.x = x * size;
    this.y = y * size;
    this.z = z * size;
    this.size = size;
    this.neighbourCount = 0;
    if(random(1) < 0.4) {
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
            //translate(this.size/2, this.size/2, this.size/2);
            fill('rgba(0, 133, 255, 0.5)');
            sphere(11, 10, 10);
            //translate(-(this.size/2), -(this.size/2), -(this.size/2));
        } else {
            /*textAlign(CENTER);
            fill(0);
            text(this.neighbourCount, this.x, this.y, )*/
        }
    } else {
        box(this.size);
    }

    translate(-this.x, -this.y, -this.z);
}

Cell.prototype.hit = function() {
    this.revealed = true;
}

Cell.prototype.countBombs = function() {
    if(this.bomb) return -1;
    let total = 0;

    for(let x=-1; x <= 1; x++) {
        for(let y=-1; y <= 1; y++) {
            for(let z=-1; z <= 1; z++) {
                let posX = this.index[0]+x;
                let posY = this.index[1]+y;
                let posZ = this.index[2]+z;
                if(posX > -1 && posX < 10) {
                    if(posY > -1 && posY < 10) {
                        if(posZ > -1 && posZ < 10) {
                            let neighbour = map[posX, posY, posZ];
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

// Creates 3d vectors for the top left and bottom right of the cube (defining a bounding box)
// Creates 3d vectors for the start and end of the line segment
// Checks for a hit and returns a 3d vector representing the location of the hit in 3d space
// Gets the length of the line from the start position to the hit position
// If there is a hit, return the absolute length of this line, if not return -1
Cell.prototype.checkHit = function(camX, camY, camZ, centX, centY, centZ) {
    if(this.revealed) return -1;
    let b1 = glMatrix.vec3.fromValues(this.x, this.y, this.z);
    let b2 = glMatrix.vec3.fromValues(this.x+this.size, this.y+this.size, this.z+this.size);
    let l1 = glMatrix.vec3.fromValues(camX, camY, camZ);
    let l2 = glMatrix.vec3.fromValues(centX, centY, centZ);

    let hit = glMatrix.vec3.create();

    let isHit = checkLineBox(b1, b2, l1, l2, hit);

    let len = glMatrix.vec3.create();
    glMatrix.vec3.subtract(len, l1, hit); // Get the difference between origin and intersection points

    return isHit ? Math.abs(glMatrix.vec3.length(len)) : -1;
}

// all args are Vec3, Hit will be filled by this algo
function checkLineBox( B1, B2, L1, L2, Hit) {
    if (L2[0] < B1[0] && L1[0] < B1[0]) return false;
    if (L2[0] > B2[0] && L1[0] > B2[0]) return false;
    if (L2[1] < B1[1] && L1[1] < B1[1]) return false;
    if (L2[1] > B2[1] && L1[1] > B2[1]) return false;
    if (L2[2] < B1[2] && L1[2] < B1[2]) return false;
    if (L2[2] > B2[2] && L1[2] > B2[2]) return false;
    if (L1[0] > B1[0] && L1[0] < B2[0] &&
        L1[1] > B1[1] && L1[1] < B2[1] &&
        L1[2] > B1[2] && L1[2] < B2[2])
    {
        glMatrix.vec3.set( Hit, L1);
        return true;
    }

    if ((getIntersection(L1[0] - B1[0], L2[0] - B1[0], L1, L2, Hit) && inBox(Hit, B1, B2, 1))
    || (getIntersection(L1[1] - B1[1], L2[1] - B1[1], L1, L2, Hit) && inBox(Hit, B1, B2, 2))
    || (getIntersection(L1[2] - B1[2], L2[2] - B1[2], L1, L2, Hit) && inBox(Hit, B1, B2, 3))
    || (getIntersection(L1[0] - B2[0], L2[0] - B2[0], L1, L2, Hit) && inBox(Hit, B1, B2, 1))
    || (getIntersection(L1[1] - B2[1], L2[1] - B2[1], L1, L2, Hit) && inBox(Hit, B1, B2, 2))
    || (getIntersection(L1[2] - B2[2], L2[2] - B2[2], L1, L2, Hit) && inBox(Hit, B1, B2, 3)))
        return true;

    return false;
}

function getIntersection( fDst1, fDst2, P1, P2, Hit) {
    let temp = glMatrix.vec3.create();

    if ((fDst1 * fDst2) >= 0) return false;
    if (fDst1 == fDst2) return false;

    glMatrix.vec3.subtract(temp, P2, P1);
    glMatrix.vec3.scale( temp, temp, (-fDst1 / (fDst2 - fDst1)));
    glMatrix.vec3.add( Hit, temp, P1);

    return true;
}

function inBox(Hit, B1, B2, Axis) {
    if (Axis == 1 && Hit[2] > B1[2] && Hit[2] < B2[2] && Hit[1] > B1[1] && Hit[1] < B2[1]) return true;
    if (Axis == 2 && Hit[2] > B1[2] && Hit[2] < B2[2] && Hit[0] > B1[0] && Hit[0] < B2[0]) return true;
    if (Axis == 3 && Hit[0] > B1[0] && Hit[0] < B2[0] && Hit[1] > B1[1] && Hit[1] < B2[1]) return true;
    return false;
}