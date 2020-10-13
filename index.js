
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


let percentBombs = 0.05; // Between 0 and 1
let cubeAxisLength = 10; // Number of cubes along each axis
let map;
let size = 20;
let can;
let selection = [0, 0, 9];

function setup() {
    createCanvas(600, 600, WEBGL);
    can = createGraphics(size, size, P2D);
    map = make3DArray(cubeAxisLength, cubeAxisLength, cubeAxisLength);
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

function draw() {
    background(0);
    orbitControl();

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
}

function keyPressed() {
    if(keyCode === 32) {
        map[selection[0]][selection[1]][selection[2]].hit();
        if(map[selection[0]][selection[1]][selection[2]].bomb) {
            gameOver();
        }
    }
    if(keyCode === UP_ARROW) up();
    if(keyCode === DOWN_ARROW) down();
    if(keyCode === LEFT_ARROW) left();
    if(keyCode === RIGHT_ARROW) right();
    if(keyCode === 190) moveIn();
    if(keyCode === 188) moveOut();
}

function down() {
    ++selection[1];
    if(selection[1] > (cubeAxisLength-1)) selection[1] = 0;
}

function up() {
    --selection[1];
    if(selection[1] < 0) selection[1] = (cubeAxisLength-1);
}

function left() {
    --selection[0];
    if(selection[0] < 0) selection[0] = (cubeAxisLength-1);
}

function right() {
    ++selection[0];
    if(selection[0] > (cubeAxisLength-1)) selection[0] = 0;
}

function moveIn() {
    ++selection[2];
    if(selection[2] > (cubeAxisLength-1)) selection[2] = 0;
}

function moveOut() {
    --selection[2];
    if(selection[2] < 0) selection[2] = (cubeAxisLength-1);
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