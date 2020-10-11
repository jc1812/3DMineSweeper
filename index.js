
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

function setup() {
    createCanvas(600, 600, WEBGL);
    map = make3DArray(10, 10, 10);
    // Init map
    for(let x=0; x<map.length; x++) {
        for(let y=0; y<map[x].length; y++) {
            for(let z=0; z<map[x][y].length; z++) {
                map[x][y][z] = new Cell(x*size, y*size, z*size, size);
            }
        }
    }
}

function draw() {
    //console.log(this._renderer._curCamera.eyeX,
      //  this._renderer._curCamera.eyeZ);
    background(0);
    orbitControl();
    translate(-100, -100);
    // Render map
    for(let x=0; x<map.length; x++) {
        for(let y=0; y<map[x].length; y++) {
            for(let z=0; z<map[x][y].length; z++) {
                map[x][y][z].show();
            }
        }
    }
}