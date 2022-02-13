// @ts-check
import * as THREE from 'three';
import '../../scss/styles.scss';

// init

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 1;
camera.position.y = 0.2;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(20, 0.1, 20);
const material = new THREE.MeshNormalMaterial();

const geometry2 = new THREE.BoxGeometry(0.2, 2, 0.2);

const mesh = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry2, material);
scene.add(mesh);
scene.add(mesh2);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Перемещение мыши
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

const controls = new PointerLockControls(camera, document.body);

const start = document.querySelector('#start');

if (start) {
  start.addEventListener(
    'click',
    function () {
      controls.lock();
    },
    false
  );
  controls.addEventListener('lock', function () {
    start.setAttribute('style', 'display: none;');
  });

  controls.addEventListener('unlock', function () {
    start.setAttribute('style', 'display: block;');
  });
}

// Движение
const X_SPEED = 0.05;
const Z_SPEED = 0.05;

document.addEventListener('keydown', keyPress, true);
document.addEventListener('keyup', keyPress, true);
setInterval(onDocumentKeyDown, 20);

/**
 * Обработчик нажатий и отпуска клавиш
 * @param {KeyboardEvent} e
 */
function keyPress(e) {
  map[e.key] = e.type === 'keydown';
}

/**
 * @type {{[key: string]: boolean;}}
 */
const map = {};
/**
 * Передвижение камеры при нажатии клавиш
 */
function onDocumentKeyDown() {
  if (map['w'] && !map['a'] && !map['d'] && !map['s']) {
    // Только вперед
    controls.moveForward(Z_SPEED);
    //camera.position.z -= Z_SPEED;
  } else if (map['a'] && !map['w'] && !map['s'] && !map['d']) {
    // Только влево
    controls.moveRight(-1 * X_SPEED);
  } else if (map['d'] && !map['w'] && !map['a'] && !map['s']) {
    // Только вправо
    controls.moveRight(X_SPEED);
  } else if (map['s'] && !map['d'] && !map['a'] && !map['w']) {
    // Только назад
    controls.moveForward(-1 * Z_SPEED);
  } else if (map['w'] && map['a'] && !map['d'] && !map['s']) {
    controls.moveForward(Z_SPEED);
    controls.moveRight(-1 * X_SPEED);
  } else if (map['w'] && map['d'] && !map['a'] && !map['s']) {
    controls.moveForward(Z_SPEED);
    controls.moveRight(X_SPEED);
  } else if (map['s'] && map['d'] && !map['a'] && !map['w']) {
    controls.moveForward(-1 * Z_SPEED);
    controls.moveRight(X_SPEED);
  } else if (map['s'] && map['a'] && !map['d'] && !map['w']) {
    controls.moveForward(-1 * Z_SPEED);
    controls.moveRight(-1 * X_SPEED);
  }
}

// статистика
import Stats from 'three/examples/jsm/libs/stats.module';
const stats = Stats();
document.body.appendChild(stats.dom);

// рендер анимации
function animate() {
  requestAnimationFrame(animate);
  render();
  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
