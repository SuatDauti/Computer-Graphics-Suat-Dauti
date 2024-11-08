import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 0);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1b2a2f);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 4;

const buildingGeoSmall = new THREE.BoxGeometry(1, 2, 1);
const buildingGeoLarge = new THREE.BoxGeometry(3, 2, 2);
const roadGeometry = new THREE.PlaneGeometry(1, 6.5);
const terrainGeometry = new THREE.PlaneGeometry(10, 12);
const roundaboutGeometry = new THREE.CircleGeometry(1, 20);

const grayBuilding = new THREE.MeshStandardMaterial({ color: 0xdbd3d3 });
const cyanBuilding = new THREE.MeshStandardMaterial({ color: 0x0ce1e8 });
const grassMaterial = new THREE.MeshStandardMaterial({ color: 0x027812 });
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x353835 });

const ground = new THREE.Mesh(terrainGeometry, grassMaterial);
const buildingIT = new THREE.Mesh(buildingGeoLarge, grayBuilding);
const buildingA = new THREE.Mesh(buildingGeoSmall, cyanBuilding);
const buildingB = new THREE.Mesh(buildingGeoSmall, cyanBuilding);
const centerCircle = new THREE.Mesh(roundaboutGeometry, roadMaterial);
const buildingFofCS = new THREE.Mesh(buildingGeoLarge, grayBuilding);
const roadA = new THREE.Mesh(roadGeometry, roadMaterial);
const roadB = new THREE.Mesh(roadGeometry, roadMaterial);

ground.rotation.x = -Math.PI / 2;
buildingIT.position.set(3.2, 1, 2);
buildingIT.rotation.z = 2.1;
centerCircle.position.set(0, 0.001, 0);
roadA.position.set(0, 0.001, -2.5);
roadB.position.set(1.5, 0.001, 2.5);
roadB.rotation.z = 0.5;
buildingFofCS.position.set(-2.5, 1, 2);
buildingFofCS.rotation.z = -1.6;
buildingA.position.set(-1.5, 0.5, -2);
buildingB.position.set(-1.5, 0.5, -4.5);

scene.add(
  ground,
  centerCircle,
  buildingFofCS,
  buildingA,
  buildingB,
  roadA,
  roadB,
  buildingIT
);

[
  buildingIT,
  buildingA,
  buildingB,
  buildingFofCS,
  roadA,
  roadB,
  centerCircle,
].forEach((mesh) => {
  mesh.rotation.x = -Math.PI / 2;
});

scene.traverse((object) => {
  if (object instanceof THREE.Mesh) {
    const outlineMaterial = object.material.clone();
    outlineMaterial.color = new THREE.Color(object.material.color).offsetHSL(
      0,
      0,
      -0.25
    );
    outlineMaterial.side = THREE.BackSide;

    const outlineMesh = object.clone();
    outlineMesh.material = outlineMaterial;
    outlineMesh.scale.multiplyScalar(1.05);
    scene.add(outlineMesh);
  }
});

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 10);
scene.add(ambientLight, directionalLight);

function renderLoop() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(renderLoop);
}

renderLoop();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
