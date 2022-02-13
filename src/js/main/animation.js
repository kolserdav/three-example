// @ts-check

/**
 *
 * @param {{
 *  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>
 *  renderer: THREE.WebGLRenderer
 *  scene: THREE.Scene
 *  camera: THREE.PerspectiveCamera
 * }} args
 * @returns {(time: number) => void}
 */
export function rotation({ mesh, renderer, scene, camera }) {
  return (time) => {
    mesh.rotation.x = time / 1000;
    mesh.rotation.y = time / 2000;

    renderer.render(scene, camera);
  };
}
