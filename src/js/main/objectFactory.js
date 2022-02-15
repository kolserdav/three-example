import {
  BoxGeometry,
  MeshBasicMaterial,
  Group,
  Scene,
  Mesh,
  TextureLoader,
  MeshFaceMaterial,
  LatheGeometry,
  CylinderGeometry,
  Vector2,
} from 'three';
import { BLOCKS } from './constants';

/**
 * Класс содержащий методы создающие 3Д-объекты
 */
export default class ObjectFactory {
  /**
   * @type {Scene}
   */
  scene;

  constructor() {
    this.scene = new Scene();
  }

  /**
   * Создание шахматного пола
   */
  createFloor = () => {
    const geometry = new BoxGeometry(0.1, 0.1, 0.1);
    const white = new MeshBasicMaterial({ color: 0xc5c5c5 });
    const black = new MeshBasicMaterial({ color: 0x00000 });
    const board = new Group();
    for (let x = 0; x < BLOCKS; x++) {
      for (let z = 0; z < BLOCKS; z++) {
        let cube;
        if (z % 2 !== 0) {
          cube = new Mesh(geometry, x % 2 === 0 ? black : white);
        } else {
          cube = new Mesh(geometry, x % 2 === 0 ? white : black);
        }
        cube.position.set(x / 10, 0, z / 10);
        board.add(cube);
      }
    }
    board.position.set(0, 0, 0);
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
    const geometry = new BoxGeometry(xWidth, yWidth, zWidth);
    const loader = new TextureLoader();
    const scene = this.scene;
    loader.load(
      texture,
      (texture) => {
        const material = new MeshBasicMaterial({
          map: texture,
        });
        const box = new Mesh(geometry, material);
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
   * Создание стены
   * @param {{
   *  xWidth: number;
   *  yWidth: number;
   *  zWidth: number;
   *  xPos: number;
   *  yPos: number;
   *  zPos: number;
   *  texture: string;
   *  index: number;
   * }} param0
   * @param {boolean} dark
   */
  createBoxWithImage = ({ xWidth, yWidth, zWidth, xPos, yPos, zPos, texture, index }) => {
    const geometry = new BoxGeometry(xWidth, yWidth, zWidth);
    const loader = new TextureLoader();
    const scene = this.scene;
    const wood = loader.load('textures/gold.jpg');
    loader.load(
      texture,
      (texture) => {
        const cubeMaterialArray = [];
        for (let i = 0; i < 6; i++) {
          cubeMaterialArray.push(
            new MeshBasicMaterial(i === index ? { map: texture } : { map: wood })
          );
        }
        const cubeMaterials = new MeshFaceMaterial(cubeMaterialArray);
        const box = new Mesh(geometry, cubeMaterials);
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
    const geometry = new CylinderGeometry(wallWidht / 2, wallWidht / 2, wallHeight, 100);
    const loader = new TextureLoader();
    const scene = this.scene;
    loader.load(
      'textures/marble-black.jpg',
      (texture) => {
        const material = new MeshBasicMaterial({
          map: texture,
        });
        const cylinder = new Mesh(geometry, material);
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
      points.push(new Vector2((Math.sin(i * 0.5233) * 10 + 5) / 10, i - 3));
    }
    const geometry = new LatheGeometry(points, 1000);
    const loader = new TextureLoader();
    const scene = this.scene;
    loader.load(
      'backgrounds/dome.jpg',
      (texture) => {
        const material = new MeshBasicMaterial({
          map: texture,
        });
        const lathe = new Mesh(geometry, material);
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
