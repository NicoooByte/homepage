'use strict';

var A = 0;
var B = 0;
var C = 0;
var bg = ".";
const cube = document.getElementById('cube')


cube.style.width = "fit-content";
cube.innerHTML = "@"
const width = Math.floor(widthUncidodeLine / cube.clientWidth) + 20;
const height = Math.floor(window.innerHeight / cube.clientHeight);
cube.style.width = "unset";


const cubeWidth = 30;
var zBuffer = new Array(width * height).fill(0);
var buffer = new Array(width * height).fill(bg);
const distanceFromCam = 80;
const horizontalOffset = width / 1.6;
const K1 = 20;

const incrementSpeed = 5;

var x, y, z;
var ooz;
var xp, yp;
var idx;
var basd = false;




function updateCube() {
    basd = !basd;
    if (basd == true)
        return build(buffer);
    zBuffer.fill(0);
    buffer = new Array(width * height).fill(bg);
    for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
        for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
            calculateForSurface(cubeX, cubeY, -cubeWidth, '@');
            calculateForSurface(cubeWidth, cubeY, cubeX, '$');
            calculateForSurface(-cubeWidth, cubeY, -cubeX, '~');
            calculateForSurface(-cubeX, cubeY, cubeWidth, '#');
            calculateForSurface(cubeX, -cubeWidth, -cubeY, ';');
            calculateForSurface(cubeX, cubeWidth, cubeY, '+');
        }
    }
    buffer.forEach(format);
    A += 0.05;
    B += 0.05;
    C += 0.01;
    cube.innerHTML = build(buffer);
}

function build(item) {
    var result = "";
    for (var i = 0; i < item.length; i++) {
        result += item[i];
    }
    return result;
}

function format(item, index, arr) {
    if (index % width * 4 == 0 && index != 0) {
        arr.splice(index, 0, " <br>");
    }
}

function calculateX(i, j, k) {
    return j * Math.sin(A) * Math.sin(B) * Math.cos(C) - k * Math.cos(A) * Math.sin(B) * Math.cos(C) +
        j * Math.cos(A) * Math.sin(C) + k * Math.sin(A) * Math.sin(C) + i * Math.cos(B) * Math.cos(C);
}
function calculateY(i, j, k) {
    return j * Math.cos(A) * Math.cos(C) + k * Math.sin(A) * Math.cos(C) -
        j * Math.sin(A) * Math.sin(B) * Math.sin(C) + k * Math.cos(A) * Math.sin(B) * Math.sin(C) -
        i * Math.cos(B) * Math.sin(C);
}
function calculateZ(i, j, k) {
    return k * Math.cos(A) * Math.cos(B) - j * Math.sin(A) * Math.cos(B) + i * Math.sin(B);
}
function calculateForSurface(cubeX, cubeY, cubeZ, ch) {
    x = calculateX(cubeX, cubeY, cubeZ);
    y = calculateY(cubeX, cubeY, cubeZ);
    z = calculateZ(cubeX, cubeY, cubeZ) + distanceFromCam;
    ooz = 1 / z;
    xp = Math.floor(width / 2 + horizontalOffset + K1 * ooz * x * 2);
    yp = Math.floor(height / 2 + K1 * ooz * y);
    idx = xp + yp * width;
    if (idx >= 0 && idx < width * height) {
        if (ooz > zBuffer[idx]) {
            zBuffer[idx] = ooz;
            buffer[idx] = ch;
        }
    }
}
updateCube();
updateCube();
let intervalCube = setInterval(() => {
    updateCube();
}, 50)
