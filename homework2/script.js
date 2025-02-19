// Import dependencies using ES modules.
import * as THREE from "https://esm.sh/three@0.173.0";
import { OrbitControls } from "https://esm.sh/three@0.173.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://esm.sh/three@0.173.0/examples/jsm/loaders/GLTFLoader.js";

// Listen for the pageshow event to handle back/forward cache (bfcache) restoration.
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    console.log("Page restored from bfcache. Reinitializing if necessary.");
    // Reinitialize any messaging or state as needed.
  }
});

// Scene, Camera, and Renderer Setup
const scene = new THREE.Scene();

// Skybox using CubeTextureLoader with your cubemap images.
const cubeTextureLoader = new THREE.CubeTextureLoader();
const skyboxTexture = cubeTextureLoader.load([
  "/textures/CubeSkybox/px.jpg",
  "/textures/CubeSkybox/nx.jpg",
  "/textures/CubeSkybox/py.jpg",
  "/textures/CubeSkybox/ny.jpg",
  "/textures/CubeSkybox/pz.jpg",
  "/textures/CubeSkybox/nz.jpg",
]);
scene.background = skyboxTexture;

// Room Dimensions
const roomWidth = 30;
const roomHeight = 15;
const roomDepth = 30;

// Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const overheadLight = new THREE.PointLight(0xffffff, 0.8, 100, 0.5);
overheadLight.position.set(0, roomHeight / 2, 0);
scene.add(overheadLight);

// Additional lights placed at the four corners of the room.
const additionalLight1 = new THREE.PointLight(0xffffff, 0.6, 100, 0.5);
additionalLight1.position.set(roomWidth / 4, roomHeight / 2, roomDepth / 4);
scene.add(additionalLight1);

const additionalLight2 = new THREE.PointLight(0xffffff, 0.6, 100, 0.5);
additionalLight2.position.set(-roomWidth / 4, roomHeight / 2, roomDepth / 4);
scene.add(additionalLight2);

const additionalLight3 = new THREE.PointLight(0xffffff, 0.6, 100, 0.5);
additionalLight3.position.set(roomWidth / 4, roomHeight / 2, -roomDepth / 4);
scene.add(additionalLight3);

const additionalLight4 = new THREE.PointLight(0xffffff, 0.6, 100, 0.5);
additionalLight4.position.set(-roomWidth / 4, roomHeight / 2, -roomDepth / 4);
scene.add(additionalLight4);

// Texture Loader for Floor and Wall textures.
const textureLoader = new THREE.TextureLoader();

// Floor Material with custom textures.
const floorMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load("/textures/FloorTextures/FloorBaseColor.png"),
  normalMap: textureLoader.load("/textures/FloorTextures/FloorNormal.png"),
  roughnessMap: textureLoader.load("/textures/FloorTextures/FloorRoughnes.png"),
  metalnessMap: textureLoader.load("/textures/FloorTextures/FloorMetalic.png"),
  roughness: 1,
});

// Wall Material with custom textures.
const wallMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load("/textures/WallTextures/WallBaseColor.png"),
  normalMap: textureLoader.load("/textures/WallTextures/WallNormal.png"),
  roughnessMap: textureLoader.load("/textures/WallTextures/WallRoughness.png"),
  roughness: 0.5,
});

// Room Geometry
// Create Floor
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(roomWidth, roomDepth),
  floorMaterial
);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.position.y = -roomHeight / 2;
scene.add(floorMesh);

// Create Ceiling using the wall texture.
const ceilingMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(roomWidth, roomDepth),
  wallMaterial
);
ceilingMesh.rotation.x = Math.PI / 2;
ceilingMesh.position.y = roomHeight / 2;
scene.add(ceilingMesh);

// Create Back Wall (remains unchanged)
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomWidth, roomHeight),
  wallMaterial
);
backWall.position.z = roomDepth / 2;
backWall.position.y = 0;
backWall.rotation.y = Math.PI;
scene.add(backWall);

// Create Left Wall
const leftWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomDepth, roomHeight),
  wallMaterial
);
leftWall.position.x = -roomWidth / 2;
leftWall.position.y = 0;
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

// Create Right Wall
const rightWall = new THREE.Mesh(
  new THREE.PlaneGeometry(roomDepth, roomHeight),
  wallMaterial
);
rightWall.position.x = roomWidth / 2;
rightWall.position.y = 0;
rightWall.rotation.y = -Math.PI / 2;
scene.add(rightWall);

// FRONT WALL with Window (using 5 panels)
// Remove the single front wall and instead add 5 panels for a window effect.

// Define dimensions for the window panels.
const topPanelHeight = 3;
const bottomPanelHeight = 3;
const middlePanelHeight = roomHeight - topPanelHeight - bottomPanelHeight;
const windowGapTotal = 6;     // Total gap width for the window
const centerDividerWidth = 0.5; // Width of the center divider
const sidePanelWidth = (windowGapTotal - centerDividerWidth) / 2; // Each side panel width

// Top Panel (spans full width)
const topPanelGeometry = new THREE.PlaneGeometry(roomWidth, topPanelHeight);
const topPanel = new THREE.Mesh(topPanelGeometry, wallMaterial);
topPanel.position.set(0, roomHeight / 2 - topPanelHeight / 2, -roomDepth / 2);
scene.add(topPanel);

// Bottom Panel (spans full width)
const bottomPanelGeometry = new THREE.PlaneGeometry(roomWidth, bottomPanelHeight);
const bottomPanel = new THREE.Mesh(bottomPanelGeometry, wallMaterial);
bottomPanel.position.set(0, -roomHeight / 2 + bottomPanelHeight / 2, -roomDepth / 2);
scene.add(bottomPanel);

// Left Middle Panel (covers left side of the window gap)
// The window gap spans from -3 to 3. The left panel covers from -3 to -0.25.
const leftMiddleGeometry = new THREE.PlaneGeometry(sidePanelWidth, middlePanelHeight);
const leftMiddlePanel = new THREE.Mesh(leftMiddleGeometry, wallMaterial);
const leftPanelCenterX = -3 + sidePanelWidth / 2; // center ≈ -1.625
leftMiddlePanel.position.set(leftPanelCenterX, 0, -roomDepth / 2);
scene.add(leftMiddlePanel);

// Right Middle Panel (covers right side of the window gap)
// It covers from 0.25 to 3.
const rightMiddleGeometry = new THREE.PlaneGeometry(sidePanelWidth, middlePanelHeight);
const rightMiddlePanel = new THREE.Mesh(rightMiddleGeometry, wallMaterial);
const rightPanelCenterX = 3 - sidePanelWidth / 2; // center ≈ 1.625
rightMiddlePanel.position.set(rightPanelCenterX, 0, -roomDepth / 2);
scene.add(rightMiddlePanel);

// Middle Divider Panel (a narrow divider in the center)
const middlePanelGeometry = new THREE.PlaneGeometry(centerDividerWidth, middlePanelHeight);
const middlePanel = new THREE.Mesh(middlePanelGeometry, wallMaterial);
middlePanel.position.set(0, 0, -roomDepth / 2);
scene.add(middlePanel);

// GLTF Model Loader Function
function loadGLTFModel(url, options) {
  const loader = new GLTFLoader();
  loader.load(
    url,
    (gltf) => {
      const model = gltf.scene;
      if (options.position)
        model.position.set(options.position.x, options.position.y, options.position.z);
      if (options.scale)
        model.scale.set(options.scale, options.scale, options.scale);
      if (options.rotation)
        model.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z);
      scene.add(model);
    },
    undefined,
    (error) => console.error("Error loading model:", url, error)
  );
}

// Load the school desk & chair model in a 3x3 grid, centered at (0,0,0)
const gridRows = 3;
const gridCols = 3;
const gridSpacing = 8; // Adjust spacing as needed.
const gridOffsetX = 40;
const gridOffsetZ = 31;

for (let row = 0; row < gridRows; row++) {
  for (let col = 0; col < gridCols; col++) {
    const xPos = gridOffsetX + (col - (gridCols - 1) / 2) * gridSpacing;
    const zPos = gridOffsetZ + (row - (gridRows - 1) / 2) * gridSpacing;
    loadGLTFModel("/models/school_desk_and_chair/scene.gltf", {
      position: { x: xPos, y: -roomHeight / 2 + 1, z: zPos },
      scale: 1,
      rotation: { x: 0, y: 0, z: 0 },
    });
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Example: Handle extension messaging error gracefully.
