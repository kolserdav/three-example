// @ts-check

// Перемещение мыши
import { PerspectiveCamera } from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { BLOCKS, Z_SPEED, X_SPEED, ZOOM_SPEED } from './constants';
import { isMobile } from './lib';

/**
 * Класс управляющий камерой персонажа
 */
export default class Animation {
  /**
   * Камера гостя
   * @type {PerspectiveCamera}
   */
  camera;

  /**
   * Управление захваченным курсором мыши
   * @type {PointerLockControls}
   */
  controls;

  /**
   * Текущие нажатые клавиши
   * @type {{[key: string]: boolean;}}
   */
  map;

  constructor() {
    this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    this.camera.position.z = 1;
    this.camera.position.x = 1;
    this.camera.position.y = 0.2;
    this.controls = new PointerLockControls(this.camera, document.body);
    this.initialMouseControls();
    this.map = {};
    /**
     * Обработчик нажатий и отпуска клавиш
     * @param {KeyboardEvent} e
     */
    const keyPress = (e) => {
      this.map[e.key.toLowerCase()] = e.type === 'keydown';
    };
    // Движение
    document.addEventListener('keydown', keyPress, true);
    document.addEventListener('keyup', keyPress, true);
    setInterval(this.onDocumentKeyDown, 20);
  }

  /**
   * Контроль мыши от первого лица
   */
  initialMouseControls = () => {
    /**
     * Зуммирование
     * @param {WheelEvent} e
     */
    const cameraZoom = (e) => {
      if (e.deltaY < 0) {
        this.camera.zoom += ZOOM_SPEED;
      } else {
        this.camera.zoom -= ZOOM_SPEED;
      }
      if (this.camera.zoom < ZOOM_SPEED) {
        this.camera.zoom = ZOOM_SPEED;
      } else if (this.camera.zoom > 12) {
        this.camera.zoom = 12;
      }
      if (this.camera.zoom < 1) {
        this.camera.zoom = 1;
      }
      this.camera.updateProjectionMatrix();
    };
    const start = document.querySelector('#start');
    const controls = this.controls;
    if (start && !isMobile) {
      start.addEventListener(
        'click',
        function () {
          if (!isMobile) {
            controls.lock();
          }
        },
        false
      );
      this.controls.addEventListener('lock', function () {
        document.addEventListener('wheel', cameraZoom);
        start.setAttribute('style', 'display: none;');
      });
      this.controls.addEventListener('unlock', function () {
        document.removeEventListener('wheel', cameraZoom);
        start.setAttribute('style', 'display: block;');
      });
    } else if (start) {
      start.setAttribute('style', 'display: none;');
      /**
       * @type {number}
       */
      let startX;
      /**
       * @type {number}
       */
      let startY;
      document.ontouchstart = (e) => {
        const { clientX, clientY } = e.touches[0];
        startX = clientX;
        startY = clientY;
        const { x, y } = this.camera.rotation;
        console.log('start', startX, startY, x, y);
      };
      document.ontouchmove = (e) => {
        const { clientX, clientY } = e.touches[0];
        const { x, y } = this.camera.rotation;
        console.log('x', x, x - (startX - clientX) / 10000);
        console.log('y', y, y - (startY - clientY) / 10000);
        this.camera.rotateY(x - (startX - clientX) / 10000);
        this.camera.rotateX(y - (startY - clientY) / 10000);
      };
      document.ontouchend = (e) => {
        console.log('end', e);
      };
    }
  };

  /**
   * Передвижение камеры при нажатии клавиш
   */
  onDocumentKeyDown = () => {
    const keyW = () => {
      return this.map['w'] || this.map['ц'];
    };
    const keyA = () => {
      return this.map['a'] || this.map['ф'];
    };
    const keyS = () => {
      return this.map['s'] || this.map['ы'];
    };
    const keyD = () => {
      return this.map['d'] || this.map['в'];
    };
    if (keyW() && !keyA() && !keyD() && !keyS()) {
      // Только вперед
      this.controls.moveForward(this.map['shift'] ? Z_SPEED * 2 : Z_SPEED);
      //this.camera.position.z -= Z_SPEED;
    } else if (keyA() && !keyW() && !keyS() && !keyD()) {
      // Только влево
      this.controls.moveRight(-1 * X_SPEED);
    } else if (keyD() && !keyW() && !keyA() && !keyS()) {
      // Только вправо
      this.controls.moveRight(X_SPEED);
    } else if (keyS() && !keyD() && !keyA() && !keyW()) {
      // Только назад
      this.controls.moveForward(-1 * Z_SPEED);
    } else if (keyW() && keyA() && !keyD() && !keyS()) {
      this.controls.moveForward(Z_SPEED);
      this.controls.moveRight(-1 * X_SPEED);
    } else if (keyW() && keyD() && !keyA() && !keyS()) {
      this.controls.moveForward(Z_SPEED);
      this.controls.moveRight(X_SPEED);
    } else if (keyS() && keyD() && !keyA() && !keyW()) {
      this.controls.moveForward(-1 * Z_SPEED);
      this.controls.moveRight(X_SPEED);
    } else if (keyS() && keyA() && !keyD() && !keyW()) {
      this.controls.moveForward(-1 * Z_SPEED);
      this.controls.moveRight(-1 * X_SPEED);
    }
    if (this.camera.position.x < 0.1) {
      this.camera.position.x = 0.1;
    }
    if (this.camera.position.x > BLOCKS / 10 - 0.1) {
      this.camera.position.x = BLOCKS / 10 - 0.1;
    }
    if (this.camera.position.z < 0.1) {
      this.camera.position.z = 0.1;
    }
    if (this.camera.position.z > BLOCKS / 10 - 0.1) {
      this.camera.position.z = BLOCKS / 10 - 0.1;
    }
  };
}
