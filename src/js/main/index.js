// @ts-check
import * as THREE from 'three';
import '../../scss/styles.scss';

// Размер здания
const BLOCKS = 15;
// Коэффициент высоты стен
const WALL_HEIGHT_COEFF = 0.8;

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 1;
camera.position.x = 1;
camera.position.y = 0.2;

const scene = new THREE.Scene();

/**
 * Создает шахматный пол
 */
const createFloor = () => {
  const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
  const white = new THREE.MeshBasicMaterial({ color: 0xc5c5c5 });
  const black = new THREE.MeshBasicMaterial({ color: 0x00000 });
  const board = new THREE.Group();
  for (let x = 0; x < BLOCKS; x++) {
    for (let z = 0; z < BLOCKS; z++) {
      let cube;
      if (z % 2 !== 0) {
        cube = new THREE.Mesh(geometry, x % 2 === 0 ? black : white);
      } else {
        cube = new THREE.Mesh(geometry, x % 2 === 0 ? white : black);
      }
      cube.position.set(x / 10, 0, z / 10);
      board.add(cube);
    }
  }
  scene.add(board);
};

createFloor();

const wallHeight = (BLOCKS / 10) * WALL_HEIGHT_COEFF;
const wallLenght = BLOCKS / 10;

const wallShift = BLOCKS / 10 / 2;
const wallWidht = 0.1;

/**
 * Создание стены
 * @param {{
 *  xWidth: number;
 *  yWidth: number;
 *  zWidth: number;
 *  xPos: number;
 *  yPos: number;
 *  zPos: number
 * }} param0
 * @param {boolean} dark
 */
const createWall = ({ xWidth, yWidth, zWidth, xPos, yPos, zPos }, dark = false) => {
  const geometry = new THREE.BoxGeometry(xWidth, yWidth, zWidth);
  const loader = new THREE.TextureLoader();
  loader.load(
    // resource URL
    dark ? 'textures/wall-marble.jpg' : 'textures/wall-white.jpg',
    // onLoad callback
    function (texture) {
      // in this example we create the material when the texture is loaded
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      const box = new THREE.Mesh(geometry, material);
      box.position.set(xPos, yPos, zPos);
      scene.add(box);
    },
    // onProgress callback currently not supported
    undefined,
    function (err) {
      console.error('An error happened.', err);
    }
  );
};

// Стены
createWall({
  xWidth: wallWidht,
  yWidth: wallHeight,
  zWidth: wallLenght,
  xPos: 0,
  yPos: 0,
  zPos: wallShift,
});
createWall({
  xWidth: wallWidht,
  yWidth: wallHeight,
  zWidth: wallLenght,
  xPos: wallLenght,
  yPos: 0,
  zPos: wallShift,
});
createWall({
  xWidth: wallLenght,
  yWidth: wallHeight,
  zWidth: wallWidht,
  xPos: wallShift,
  yPos: 0,
  zPos: wallLenght,
});
createWall({
  xWidth: wallLenght,
  yWidth: wallHeight,
  zWidth: 0.1,
  xPos: wallShift,
  yPos: 0,
  zPos: 0,
});

// Балки
createWall(
  {
    xWidth: wallLenght,
    yWidth: wallWidht,
    zWidth: wallWidht * 6,
    xPos: wallShift,
    yPos: wallHeight / 2,
    zPos: 0,
  },
  true
);
createWall(
  {
    xWidth: wallLenght,
    yWidth: wallWidht,
    zWidth: wallWidht * 6,
    xPos: wallShift,
    yPos: wallHeight / 2,
    zPos: wallShift * 2,
  },
  true
);
createWall(
  {
    xWidth: wallWidht * 6,
    yWidth: wallWidht,
    zWidth: wallLenght,
    xPos: wallShift * 2,
    yPos: wallHeight / 2,
    zPos: wallShift,
  },
  true
);
createWall(
  {
    xWidth: wallWidht * 6,
    yWidth: wallWidht,
    zWidth: wallLenght,
    xPos: 0,
    yPos: wallHeight / 2,
    zPos: wallShift,
  },
  true
);

/**
 * Создание колонны
 * @param {{
 *  xPos: number;
 *  yPos: number;
 *  zPos: number
 * }} param0
 */
const createCylinder = ({ xPos, yPos, zPos }) => {
  const geometry = new THREE.CylinderGeometry(wallWidht / 2, wallWidht / 2, wallHeight, 100);
  const loader = new THREE.TextureLoader();
  loader.load(
    // resource URL
    'textures/marble-black.jpg',
    // onLoad callback
    function (texture) {
      // in this example we create the material when the texture is loaded
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.set(xPos, yPos, zPos);
      scene.add(cylinder);
    },
    // onProgress callback currently not supported
    undefined,
    function (err) {
      console.error('An error happened.', err);
    }
  );
};

createCylinder({
  xPos: wallWidht * 2,
  yPos: 0,
  zPos: wallWidht * 2,
});

createCylinder({
  xPos: wallLenght - wallWidht * 2,
  yPos: 0,
  zPos: wallWidht * 2,
});

createCylinder({
  xPos: wallWidht * 2,
  yPos: 0,
  zPos: wallLenght - wallWidht * 2,
});

createCylinder({
  xPos: wallLenght - wallWidht * 2,
  yPos: 0,
  zPos: wallLenght - wallWidht * 2,
});

/**
 * Создание купола
 */
const createDome = () => {
  const points = [];
  for (let i = 7; i > 0; i--) {
    points.push(new THREE.Vector2((Math.sin(i * 0.5) * 10 + 5) / 10, i - 3));
  }
  const geometry = new THREE.LatheGeometry(points, 33);
  const loader = new THREE.TextureLoader();
  loader.load(
    // resource URL
    'textures/dome.jpg',
    // onLoad callback
    function (texture) {
      // in this example we create the material when the texture is loaded
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      const lathe = new THREE.Mesh(geometry, material);
      lathe.position.set(wallShift, wallHeight, wallShift);
      scene.add(lathe);
    },
    // onProgress callback currently not supported
    undefined,
    function (err) {
      console.error('An error happened.', err);
    }
  );
};

createDome();

const renderer = new THREE.WebGLRenderer({ antialias: true });
const windowResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
};
windowResize();
window.addEventListener('resize', windowResize);
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
const X_SPEED = 0.01;
const Z_SPEED = 0.02;

document.addEventListener('keydown', keyPress, true);
document.addEventListener('keyup', keyPress, true);
setInterval(onDocumentKeyDown, 20);

/**
 * Обработчик нажатий и отпуска клавиш
 * @param {KeyboardEvent} e
 */
function keyPress(e) {
  map[e.key.toLowerCase()] = e.type === 'keydown';
  console.log(camera.position);
}

const keyW = () => {
  return map['w'] || map['ц'];
};
const keyA = () => {
  return map['a'] || map['ф'];
};
const keyS = () => {
  return map['s'] || map['ы'];
};
const keyD = () => {
  return map['d'] || map['в'];
};

/**
 * Текущие нажатые клавиши
 * @type {{[key: string]: boolean;}}
 */
const map = {};
/**
 * Передвижение камеры при нажатии клавиш
 */
function onDocumentKeyDown() {
  if (keyW() && !keyA() && !keyD() && !keyS()) {
    // Только вперед
    controls.moveForward(map['shift'] ? Z_SPEED * 2 : Z_SPEED);
    //camera.position.z -= Z_SPEED;
  } else if (keyA() && !keyW() && !keyS() && !keyD()) {
    // Только влево
    controls.moveRight(-1 * X_SPEED);
  } else if (keyD() && !keyW() && !keyA() && !keyS()) {
    // Только вправо
    controls.moveRight(X_SPEED);
  } else if (keyS() && !keyD() && !keyA() && !keyW()) {
    // Только назад
    controls.moveForward(-1 * Z_SPEED);
  } else if (keyW() && keyA() && !keyD() && !keyS()) {
    controls.moveForward(Z_SPEED);
    controls.moveRight(-1 * X_SPEED);
  } else if (keyW() && keyD() && !keyA() && !keyS()) {
    controls.moveForward(Z_SPEED);
    controls.moveRight(X_SPEED);
  } else if (keyS() && keyD() && !keyA() && !keyW()) {
    controls.moveForward(-1 * Z_SPEED);
    controls.moveRight(X_SPEED);
  } else if (keyS() && keyA() && !keyD() && !keyW()) {
    controls.moveForward(-1 * Z_SPEED);
    controls.moveRight(-1 * X_SPEED);
  }
  if (camera.position.x < 0.1) {
    camera.position.x = 0.1;
  }
  if (camera.position.x > BLOCKS / 10 - 0.1) {
    camera.position.x = BLOCKS / 10 - 0.1;
  }
  if (camera.position.z < 0.1) {
    camera.position.z = 0.1;
  }
  if (camera.position.z > BLOCKS / 10 - 0.1) {
    camera.position.z = BLOCKS / 10 - 0.1;
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
