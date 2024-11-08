import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 10, 10);
camera.lookAt(scene.position);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1b2a2f);
renderer.shadowMap.enabled = true;
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
ground.receiveShadow = true;
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

[buildingIT, buildingA, buildingB, buildingFofCS].forEach((building) => {
  building.castShadow = true;
  building.receiveShadow = true;
});

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

const pathPoints = [
  new THREE.Vector3(0, 0.5, -4),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(1.5, 0.5, 2.5),
];
const path = new THREE.CatmullRomCurve3(pathPoints);
path.closed = false;

const movingCylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.3, 1, 32),
  new THREE.MeshStandardMaterial({ color: 0xff6347 })
);
movingCylinder.castShadow = true;
scene.add(movingCylinder);

function animateCylinder() {
  const animationDuration = 8;

  gsap.to(
    { progress: 0 },
    {
      progress: 1,
      duration: animationDuration,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      onUpdate: function () {
        const position = path.getPointAt(this.targets()[0].progress);
        movingCylinder.position.set(position.x, position.y, position.z);

        const tangent = path
          .getTangentAt(this.targets()[0].progress)
          .normalize();
        movingCylinder.lookAt(
          position.x + tangent.x,
          position.y + tangent.y,
          position.z + tangent.z
        );
      },
    }
  );
}

animateCylinder();

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;
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
