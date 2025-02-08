const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(0, 5, 5);
scene.add(pointLight);


const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
const room = new THREE.BoxGeometry(12, 6, 10);
const walls = new THREE.Mesh(room, wallMaterial);
walls.material.side = THREE.BackSide;
scene.add(walls);

const floorGeometry = new THREE.PlaneGeometry(12, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -3;
scene.add(floor);


const loader = new THREE.GLTFLoader();
function loadModel(url, position) {
    console.log("Loading model from:", url); // Debugging
    loader.load(url, function(gltf) {
        const model = gltf.scene;
        model.position.set(position.x, position.y, position.z);
        model.scale.set(1.5, 1.5, 1.5);
        scene.add(model);
        console.log("Model loaded successfully!");
    }, undefined, function(error) {
        console.error("Error loading model:", error);
    });
}


const testCube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({color: 0xff0000}));
testCube.position.set(0, -2, 0);
scene.add(testCube);
console.log("Test cube added!");


const deskPositions = [
    { x: -3, y: -2.5, z: 2 },
    { x: 0, y: -2.5, z: 2 },
    { x: 3, y: -2.5, z: 2 },
    { x: -3, y: -2.5, z: -1 },
    { x: 0, y: -2.5, z: -1 },
    { x: 3, y: -2.5, z: -1 },
];

const deskURL = "https://cdn.jsdelivr.net/gh/KhronosGroup/glTF-Sample-Models/2.0/Box/glTF/Box.gltf";
deskPositions.forEach(pos => loadModel(deskURL, pos));


camera.position.set(0, 2, 10);
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

console.log("Final Fix: Advanced Three.js Classroom Loaded");
