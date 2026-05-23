const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let clockInterval = null;
let angleX = 0, angleY = 0, angleZ = 0;

const imgReloj = new Image();
imgReloj.src = 'CBnJt88WYAEgkkA.jpg';

const size = 80;
const half = size / 2;

let cubeVertices = [
    { x: -half, y: -half, z: -half },
    { x:  half, y: -half, z: -half },
    { x:  half, y:  half, z: -half },
    { x: -half, y:  half, z: -half },
    { x: -half, y: -half, z:  half },
    { x:  half, y: -half, z:  half },
    { x:  half, y:  half, z:  half },
    { x: -half, y:  half, z:  half }
];

let rect3DVertices = [];

const geometryFaces = [
    { indices: [0, 1, 2, 3], color: 'red'    },
    { indices: [5, 4, 7, 6], color: 'blue'   },
    { indices: [4, 0, 3, 7], color: 'green'  },
    { indices: [1, 5, 6, 2], color: 'yellow' },
    { indices: [4, 5, 1, 0], color: 'orange' },
    { indices: [3, 2, 6, 7], color: 'purple' }
];

function getCoords() {
    return {
        x1: parseInt(document.getElementById('x1').value) || 0,
        y1: parseInt(document.getElementById('y1').value) || 0,
        x2: parseInt(document.getElementById('x2').value) || 0,
        y2: parseInt(document.getElementById('y2').value) || 0,
        r: parseInt(document.getElementById('radius').value) || 0,
        sep: parseInt(document.getElementById('separacion').value) || 10,
        cx: canvas.width / 2,
        cy: canvas.height / 2
    };
}

function toCanvas(x, y) {
    const { cx, cy } = getCoords();
    return { x: cx + x, y: cy - y };
}

function dibujarPlanoCartesiano() {
    const { cx, cy, sep } = getCoords();
    const w = canvas.width;
    const h = canvas.height;

    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= w; i += sep) {
        ctx.moveTo(i, 0); ctx.lineTo(i, h);
        ctx.moveTo(0, i); ctx.lineTo(w, i);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
    ctx.moveTo(0, cy); ctx.lineTo(w, cy);
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText('Y', cx + 5, 15);
    ctx.fillText('X', w - 15, cy - 5);
    ctx.fillText('-X', 5, cy - 5);
}

function clearCanvas() {
    if (clockInterval) clearInterval(clockInterval);
    angleX = 0; angleY = 0; angleZ = 0;
    
    cubeVertices = [
        { x: -half, y: -half, z: -half },
        { x:  half, y: -half, z: -half },
        { x:  half, y:  half, z: -half },
        { x: -half, y:  half, z: -half },
        { x: -half, y: -half, z:  half },
        { x:  half, y: -half, z:  half },
        { x:  half, y:  half, z:  half },
        { x: -half, y:  half, z:  half }
    ];
    
    rect3DVertices = [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarPlanoCartesiano();
}

function rotate3D(x, y, z, ax, ay, az) {
    let radX = ax * Math.PI / 180;
    let y1 = y * Math.cos(radX) - z * Math.sin(radX);
    let z1 = y * Math.sin(radX) + z * Math.cos(radX);
    y = y1; z = z1;

    let radY = ay * Math.PI / 180;
    let x2 = x * Math.cos(radY) + z * Math.sin(radY);
    let z2 = -x * Math.sin(radY) + z * Math.cos(radY);
    x = x2; z = z2;

    let radZ = az * Math.PI / 180;
    let x3 = x * Math.cos(radZ) - y * Math.sin(radZ);
    let y3 = x * Math.sin(radZ) + y * Math.cos(radZ);
    x = x3; y = y3;

    return { x, y, z };
}

function drawStar() {
    const { cx, cy, sep } = getCoords();
    const limit = cx; 
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let i = 0; i <= limit; i += sep) {
        let points = [
            {x: i, y: 0, z: 0}, {x: 0, y: -(limit - i), z: 0},
            {x: -i, y: 0, z: 0}, {x: 0, y: -(limit - i), z: 0},
            {x: i, y: 0, z: 0}, {x: 0, y: (limit - i), z: 0},
            {x: -i, y: 0, z: 0}, {x: 0, y: (limit - i), z: 0}
        ];

        for (let j = 0; j < points.length; j += 2) {
            let p1 = rotate3D(points[j].x, points[j].y, points[j].z, angleX, angleY, angleZ);
            let p2 = rotate3D(points[j+1].x, points[j+1].y, points[j+1].z, angleX, angleY, angleZ);
            ctx.moveTo(cx + p1.x, cy - p1.y);
            ctx.lineTo(cx + p2.x, cy - p2.y);
        }
    }
    ctx.stroke();
}

function refreshFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarPlanoCartesiano();
    drawStar();
}

function drawStaticStar() {
    if (clockInterval) clearInterval(clockInterval);
    angleX = 0; angleY = 0; angleZ = 0;
    refreshFrame();
}

function rotateX() {
    if (clockInterval) clearInterval(clockInterval);
    angleX += 5;
    refreshFrame();
}

function rotateY() {
    if (clockInterval) clearInterval(clockInterval);
    angleY += 5;
    refreshFrame();
}

function rotateZ() {
    if (clockInterval) clearInterval(clockInterval);
    angleZ += 5;
    refreshFrame();
}

function drawPointBtn() {
    const c = getCoords();
    const p = toCanvas(c.x1, c.y1);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
}

function drawLineBtn() {
    const c = getCoords();
    const p1 = toCanvas(c.x1, c.y1);
    const p2 = toCanvas(c.x2, c.y2);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawRectangleBtn() {
    const c = getCoords();
    const p = toCanvas(c.x1, c.y1);
    const width = c.x2 - c.x1;
    const height = -(c.y2 - c.y1);
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.fillRect(p.x, p.y, width, height);
    ctx.strokeRect(p.x, p.y, width, height);
}

function drawCircleBtn() {
    const c = getCoords();
    const p = toCanvas(c.x1, c.y1);
    ctx.beginPath();
    ctx.arc(p.x, p.y, c.r, 0, Math.PI * 2);
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'green';
    ctx.fill();
    ctx.stroke();
}

function drawTriangleBtn() {
    const c = getCoords();
    const p1 = toCanvas(c.x1, c.y1);
    const p2 = toCanvas(c.x2, c.y2);
    const p3 = toCanvas(c.x1, c.y2);
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fillStyle = 'orange';
    ctx.strokeStyle = 'orange';
    ctx.fill();
    ctx.stroke();
}

function drawPolygonBtn() {
    const points = [
        toCanvas(0, 100), toCanvas(95, 31), toCanvas(59, -81),
        toCanvas(-59, -81), toCanvas(-95, 31)
    ];
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fillStyle = 'green';
    ctx.strokeStyle = 'green';
    ctx.fill();
    ctx.stroke();
}

function drawTextBtn() {
    const p = toCanvas(getCoords().x1, getCoords().y1);
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText("Texto en plano", p.x, p.y);
}

function drawImageBtn() {
    const p = toCanvas(getCoords().x1, getCoords().y1);
    ctx.drawImage(imgReloj, p.x, p.y, 100, 100);
}

function startClock() {
    if (clockInterval) clearInterval(clockInterval);
    let minInicio = parseInt(document.getElementById('startMin').value) || 0;
    let segInicio = parseInt(document.getElementById('startSeg').value) || 0;
    let totalSegundos = (minInicio * 60) + segInicio;

    clockInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        dibujarPlanoCartesiano();
        const { cx, cy } = getCoords();
        const size = 600;
        if (imgReloj.complete) {
            ctx.drawImage(imgReloj, cx - size / 2, cy - size / 2, size, size);
        }
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
        for (let i = 0; i < 360; i += 1) {
            let rad = i * Math.PI / 180;
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + (size / 2) * Math.cos(rad), cy + (size / 2) * Math.sin(rad));
        }
        ctx.stroke();
        let s = totalSegundos % 60;
        let m = Math.floor(totalSegundos / 60) % 60;
        const angleSec = (s * 6 - 90) * Math.PI / 180;
        const angleMin = (m * 6 - 90) * Math.PI / 180;
        drawHand(cx, cy, angleMin, size * 0.3, 'black', 6);
        drawHand(cx, cy, angleSec, size * 0.4, 'red', 2);
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
        totalSegundos++;
    }, 1000);
}

function drawHand(x, y, angle, len, color, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.moveTo(x, y);
    ctx.lineTo(x + len * Math.cos(angle), y + len * Math.sin(angle));
    ctx.stroke();
}

function project3D(vertex, cx, cy) {
    return {
        x: cx + vertex.x,
        y: cy - vertex.y,
        z: vertex.z
    };
}

function drawRender3D(vertices) {
    const { cx, cy } = getCoords();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujarPlanoCartesiano();

    const facesToDraw = geometryFaces.map(face => {
        const projected = face.indices.map(i => project3D(vertices[i], cx, cy));
        const avgZ = projected.reduce((sum, p) => sum + p.z, 0) / projected.length;
        return { face, projected, avgZ };
    });

    facesToDraw.sort((a, b) => a.avgZ - b.avgZ);

    for (const { face, projected } of facesToDraw) {
        const points2D = projected.map(p => ({ x: p.x, y: p.y }));
        drawPolygon(points2D, face.color, 'black', 1);
    }
}

function drawCube() {
    drawRender3D(cubeVertices);
}

function drawRect3D() {
    if (rect3DVertices.length === 0) {
        const c = getCoords();
        const wHalf = Math.abs(c.x2 - c.x1) / 2;
        const hHalf = Math.abs(c.y2 - c.y1) / 2;
        const dHalf = c.r / 2;

        rect3DVertices = [
            { x: -wHalf, y: -hHalf, z: -dHalf },
            { x:  wHalf, y: -hHalf, z: -dHalf },
            { x:  wHalf, y:  hHalf, z: -dHalf },
            { x: -wHalf, y:  hHalf, z: -dHalf },
            { x: -wHalf, y: -hHalf, z:  dHalf },
            { x:  wHalf, y: -hHalf, z:  dHalf },
            { x:  wHalf, y:  hHalf, z:  dHalf },
            { x: -wHalf, y:  hHalf, z:  dHalf }
        ];
    }
    drawRender3D(rect3DVertices);
}

function drawPolygon(points, fillColor, strokeColor, strokeWidth) {
    if (points.length < 3) return;
    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function rotatePoint3D(p, cx, cy, cz, axis, angleDeg) {
    const rad = angleDeg * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    
    let x = p.x - cx;
    let y = p.y - cy;
    let z = p.z - cz;
    
    let xRot, yRot, zRot;
    
    if (axis === 'Z') {
        xRot = x * cos - y * sin;
        yRot = x * sin + y * cos;
        zRot = z;
    } else if (axis === 'X') {
        xRot = x;
        yRot = y * cos - z * sin;
        zRot = y * sin + z * cos;
    } else {
        xRot = x * cos + z * sin;
        yRot = y;
        zRot = -x * sin + z * cos;
    }
    
    return { x: xRot + cx, y: yRot + cy, z: zRot + cz };
}

function rotateCube(axis, angle) {
    if (clockInterval) clearInterval(clockInterval);
    const cx = 0, cy = 0, cz = 0;
    cubeVertices = cubeVertices.map(v => rotatePoint3D(v, cx, cy, cz, axis, angle));
    drawCube();
}

function rotateRect3D(axis, angle) {
    if (clockInterval) clearInterval(clockInterval);
    const cx = 0, cy = 0, cz = 0;
    if (rect3DVertices.length === 0) drawRect3D();
    rect3DVertices = rect3DVertices.map(v => rotatePoint3D(v, cx, cy, cz, axis, angle));
    drawRect3D();
}

function drawCubeStatic() {
    if (clockInterval) clearInterval(clockInterval);
    drawCube();
}

function drawRect3DStatic() {
    if (clockInterval) clearInterval(clockInterval);
    rect3DVertices = [];
    drawRect3D();
}

function rotateCubeX() { rotateCube('X', 5); }
function rotateCubeY() { rotateCube('Y', 5); }
function rotateCubeZ() { rotateCube('Z', 5); }

function rotateRect3DX() { rotateRect3D('X', 5); }
function rotateRect3DY() { rotateRect3D('Y', 5); }
function rotateRect3Z()  { rotateRect3D('Z', 5); }

window.onload = dibujarPlanoCartesiano;
