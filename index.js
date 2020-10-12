
function make3DArray(x, y, z) {
    let arr = new Array(x);
    for(let i=0; i<arr.length; i++) {
        arr[i] = new Array(y);
        for(let j=0; j<arr[i].length; j++) {
            arr[i][j] = new Array(z);
        } 
    }

    return arr;
}

let map;
let size = 20;
let can;
let selection = [0, 0, 9];

function setup() {
    createCanvas(600, 600, WEBGL);
    can = createGraphics(size, size, P2D);
    map = make3DArray(10, 10, 10);
    // Init map
    for(let x=0; x<map.length; x++) {
        for(let y=0; y<map[x].length; y++) {
            for(let z=0; z<map[x][y].length; z++) {
                map[x][y][z] = new Cell(x, y, z, size);
            }
        }
    }
    // Get bomb counts for each cube
    for(let x=0; x<map.length; x++) {
        for(let y=0; y<map[x].length; y++) {
            for(let z=0; z<map[x][y].length; z++) {
                map[x][y][z].countBombs();
            }
        }
    }
}

let rays = [];
function draw() {
    /*console.log(this._renderer._curCamera.eyeX,
        this._renderer._curCamera.eyeZ);*/
    background(0);
    orbitControl();
    //translate(-100, -100);

    // Render map
    for(let x=0; x<map.length; x++) {
        for(let y=0; y<map[x].length; y++) {
            for(let z=0; z<map[x][y].length; z++) {
                if(selection[0] === x &&
                    selection[1] === y &&
                    selection[2] === z) {
                        map[x][y][z].show(true);
                } else {
                    map[x][y][z].show(false);
                }
            }
        }
    }
    //drawCrosshair();
    //image(can, 0, 0);

    /*for(let i=0; i<rays.length; i++) {
        rays[i].show();
    }*/
}

// Iterates over every cube and calls checkHit on each one
// Finds the shortest length to a hit cube
// Returns the 3d array values of that cube or null if no cube is hit
/*
function raytrace() {
    let closestHit = null;
    let closestLength = null;
    for(let x=0; x<map.length; x++) {
        for(let y=0; y<map[x].length; y++) {
            for(let z=0; z<map[x][y].length; z++) {
                let hitLength = map[x][y][z].checkHit(this._renderer._curCamera.eyeX, 
                    this._renderer._curCamera.eyeY, 
                    this._renderer._curCamera.eyeZ,
                    this._renderer._curCamera.centerX,
                    this._renderer._curCamera.centerY,
                    this._renderer._curCamera.centerZ);
                if(hitLength === 0) return [x, y, z];
                if(hitLength > 0) {
                    if(!closestLength) {
                        closestLength = hitLength;
                        closestHit = [x, y, z];
                    } else if(hitLength < closestLength) {
                        closestLength = hitLength;
                        closestHit = [x, y, z];
                    }
                }
            }
        }
    }
    console.log(closestHit);
    return closestHit;
}
*/
/*
function drawCrosshair() {
    can.stroke('rgba(255, 0, 0, 1)');
    can.line((width/2), (height/2)-10, 
        (width/2), (height/2)+10);
    can.line((width/2)-10, (height/2), 
        (width/2)+10, (height/2));
}
*/

function keyPressed() {
    if(keyCode === 32) {
        map[selection[0]][selection[1]][selection[2]].hit();
        if(map[selection[0]][selection[1]][selection[2]].bomb) {
            gameOver();
        }
        //let hitCube = raytrace();
        //if(hitCube) map[hitCube[0]][hitCube[1]][hitCube[2]].hit();
        /*renderRay(this._renderer._curCamera.eyeX,
            this._renderer._curCamera.eyeY, 
            this._renderer._curCamera.eyeZ,
            this._renderer._curCamera.centerX,
            this._renderer._curCamera.centerY,
            this._renderer._curCamera.centerZ);*/
    }
    if(keyCode === UP_ARROW) up();
    if(keyCode === DOWN_ARROW) down();
    if(keyCode === LEFT_ARROW) left();
    if(keyCode === RIGHT_ARROW) right();
    if(keyCode === 190) moveIn();
    if(keyCode === 188) moveOut();
    console.log(keyCode);
}

function down() {
    ++selection[1];
    if(selection[1] > 9) selection[1] = 0;
    //if(map[selection[0]][selection[1]][selection[2]].revealed) down();
}

function up() {
    --selection[1];
    if(selection[1] < 0) selection[1] = 9;
    //if(map[selection[0]][selection[1]][selection[2]].revealed) up();
}

function left() {
    --selection[0];
    if(selection[0] < 0) selection[0] = 9;
    //if(map[selection[0]][selection[1]][selection[2]].revealed) left();
}

function right() {
    ++selection[0];
    if(selection[0] > 9) selection[0] = 0;
    //if(map[selection[0]][selection[1]][selection[2]].revealed) right();
}

function moveIn() {
    ++selection[2];
    if(selection[2] > 9) selection[2] = 0;
    //if(map[selection[0]][selection[1]][selection[2]].revealed) right();
}

function moveOut() {
    --selection[2];
    if(selection[2] < 0) selection[2] = 9;
    //if(map[selection[0]][selection[1]][selection[2]].revealed) left();
}

function gameOver() {
    for(let x=0; x<map.length; x++) {
        for(let y=0; y<map[x].length; y++) {
            for(let z=0; z<map[x][y].length; z++) {
                map[x][y][z].revealed = true;
            }
        }
    }
}

/*
function renderRay(eyeX, eyeY, eyeZ, x, y, z) {
    let obj = {
        x: eyeX,
        y: eyeY, 
        z: eyeZ,
        cx: x,
        cy: y,
        cz: z
    };
    obj.deltaX = obj.x-obj.cx,
    obj.deltaY = obj.y-obj.cy,
    obj.deltaZ = obj.z-obj.cz,
    obj.show = function() {
        translate(obj.x, obj.y, obj.z);
        box(obj.deltaX, obj.deltaY, obj.deltaZ);
        translate(-obj.x, -obj.y, -obj.z);
    }
    rays.push(obj);
}*/