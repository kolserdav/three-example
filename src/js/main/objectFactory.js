import * as THREE from 'three';
import { BLOCKS } from './constants';

/**
 * Класс содержащий методы создающие 3Д-объекты
 */
export default class ObjectFactory {
  /**
   * @type {THREE.Scene}
   */
  scene;

  constructor() {
    this.scene = new THREE.Scene();
  }

  /**
   * Создание шахматного пола
   */
  createFloor = () => {
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
    this.scene.add(board);
  };

  /**
   * Создание стены
   * @param {{
   *  xWidth: number;
   *  yWidth: number;
   *  zWidth: number;
   *  xPos: number;
   *  yPos: number;
   *  zPos: number;
   *  texture: string;
   * }} param0
   * @param {boolean} dark
   */
  createBoxWithTexture = ({ xWidth, yWidth, zWidth, xPos, yPos, zPos, texture }) => {
    const geometry = new THREE.BoxGeometry(xWidth, yWidth, zWidth);
    const loader = new THREE.TextureLoader();
    const scene = this.scene;
    loader.load(
      texture,
      (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
        });
        const box = new THREE.Mesh(geometry, material);
        box.position.set(xPos, yPos, zPos);
        scene.add(box);
      },
      undefined,
      (err) => {
        console.error('Error create box with texture', err);
      }
    );
  };

  /**
   * Создание колонны
   * @param {{
   *  wallWidht: number;
   *  wallHeight: number;
   *  xPos: number;
   *  yPos: number;
   *  zPos: number
   * }} param0
   */
  createCylinder = ({ wallWidht, wallHeight, xPos, yPos, zPos }) => {
    const geometry = new THREE.CylinderGeometry(wallWidht / 2, wallWidht / 2, wallHeight, 100);
    const loader = new THREE.TextureLoader();
    const scene = this.scene;
    loader.load(
      'textures/marble-black.jpg',
      (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(xPos, yPos, zPos);
        scene.add(cylinder);
      },
      undefined,
      (err) => {
        console.error('Error create cylinder', err);
      }
    );
  };

  /**
   * Создание купола
   * @param {{
   *  wallHeight: number;
   *  wallShift: number;
   * }}
   */
  createDome = ({ wallShift, wallHeight }) => {
    const points = [];
    for (let i = 7; i > 0; i--) {
      points.push(new THREE.Vector2((Math.sin(i * 0.5233) * 10 + 5) / 10, i - 3));
    }
    const geometry = new THREE.LatheGeometry(points, 1000);
    const loader = new THREE.TextureLoader();
    const scene = this.scene;
    loader.load(
      'textures/dome.jpg',
      (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
        });
        const lathe = new THREE.Mesh(geometry, material);
        lathe.position.set(wallShift, wallHeight * 2.3, wallShift);
        scene.add(lathe);
      },
      undefined,
      (err) => {
        console.error('Error create dome', err);
      }
    );
  };
}
