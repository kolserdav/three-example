// @ts-check
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import '../../scss/styles.scss';
import { BLOCKS, WALL_HEIGHT_COEFF, MENTION_COEFFS } from './constants';
import Animation from './animation';
import ObjectFactory from './objectFactory';

const wallHeight = (BLOCKS / 10) * WALL_HEIGHT_COEFF;
const wallLenght = BLOCKS / 10;
const wallShift = BLOCKS / 10 / 2;
const wallWidht = 0.1;
/**
 * Класс управляющий канвасом и кнопкой захвата мыши
 */
class Main extends ObjectFactory {
  constructor() {
    super();
    this.createFloor();
    this.createWalls();
    this.createRafters();
    this.createColumns();
    this.createDome({ wallHeight, wallShift });
    this.renderHandler();

    //this.loadFBX();

    this.createBoxWithImage({
      texture: 'mentions/1.png',
      xWidth: wallLenght / 2,
      yWidth: wallHeight / 3 / MENTION_COEFFS[1],
      zWidth: wallWidht + 0.03,
      xPos: wallShift,
      yPos: wallHeight / 2 - wallHeight / MENTION_COEFFS[1],
      zPos: 0,
      index: 4,
    });
  }

  /**
   * Обработчик рендеринга
   */
  renderHandler = () => {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const stats = Stats();
    const animation = new Animation();
    const scene = this.scene;

    const windowResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    windowResize();
    window.addEventListener('resize', windowResize);

    document.body.appendChild(renderer.domElement);
    document.body.appendChild(stats.dom);

    /**
     * Рекурсивный рендер анимации
     */
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, animation.camera);
      stats.update();
    }

    animate();
  };

  /**
   * Создание балок перекрытий
   */
  createRafters = () => {
    const texture = 'textures/wall-marble.jpg';
    this.createBoxWithTexture({
      texture,
      xWidth: wallLenght,
      yWidth: wallWidht,
      zWidth: wallWidht * 6,
      xPos: wallShift,
      yPos: wallHeight / 2,
      zPos: 0,
    });
    this.createBoxWithTexture({
      texture,
      xWidth: wallLenght,
      yWidth: wallWidht,
      zWidth: wallWidht * 6,
      xPos: wallShift,
      yPos: wallHeight / 2,
      zPos: wallShift * 2,
    });
    this.createBoxWithTexture({
      texture,
      xWidth: wallWidht * 6,
      yWidth: wallWidht,
      zWidth: wallLenght,
      xPos: wallShift * 2,
      yPos: wallHeight / 2,
      zPos: wallShift,
    });
    this.createBoxWithTexture({
      texture,
      xWidth: wallWidht * 6,
      yWidth: wallWidht,
      zWidth: wallLenght,
      xPos: 0,
      yPos: wallHeight / 2,
      zPos: wallShift,
    });
  };

  /**
   * Создание колонн
   */
  createColumns = () => {
    this.createCylinder({
      wallHeight,
      wallWidht,
      xPos: wallWidht * 2,
      yPos: 0,
      zPos: wallWidht * 2,
    });
    this.createCylinder({
      wallHeight,
      wallWidht,
      xPos: wallLenght - wallWidht * 2,
      yPos: 0,
      zPos: wallWidht * 2,
    });
    this.createCylinder({
      wallHeight,
      wallWidht,
      xPos: wallWidht * 2,
      yPos: 0,
      zPos: wallLenght - wallWidht * 2,
    });
    this.createCylinder({
      wallHeight,
      wallWidht,
      xPos: wallLenght - wallWidht * 2,
      yPos: 0,
      zPos: wallLenght - wallWidht * 2,
    });
  };

  /**
   * Создание стен
   */
  createWalls = () => {
    const texture = 'textures/wall-white.jpg';
    this.createBoxWithTexture({
      texture,
      xWidth: wallWidht,
      yWidth: wallHeight,
      zWidth: wallLenght,
      xPos: 0,
      yPos: 0,
      zPos: wallShift,
    });
    this.createBoxWithTexture({
      texture,
      xWidth: wallWidht,
      yWidth: wallHeight,
      zWidth: wallLenght,
      xPos: wallLenght,
      yPos: 0,
      zPos: wallShift,
    });
    this.createBoxWithTexture({
      texture,
      xWidth: wallLenght,
      yWidth: wallHeight,
      zWidth: wallWidht,
      xPos: wallShift,
      yPos: 0,
      zPos: wallLenght,
    });
    this.createBoxWithTexture({
      texture,
      xWidth: wallLenght,
      yWidth: wallHeight,
      zWidth: wallWidht,
      xPos: wallShift,
      yPos: 0,
      zPos: 0,
    });
  };
}

new Main();
