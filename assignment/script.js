import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { gsap } from "gsap";

function init() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,

    window.innerWidth / window.innerHeight,

    1,

    1000
  );

  camera.position.set(0, 20, 30);

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const sphereGeo = new THREE.SphereGeometry(10, 32, 32);

  const sphereMat = new THREE.PointsMaterial({
    color: "rgb(255, 255, 255)",

    size: 0.25,
  });

  // Combine geo and mat

  const particleSystem = new THREE.Points(sphereGeo, sphereMat);

  particleSystem.name = "particleSystem";

  // Adding sphere to the scene

  scene.add(particleSystem);

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.setClearColor("rgb(20, 20, 20)");

  // Adding OrbitControls

  const controls = new OrbitControls(camera, renderer.domElement);

  document.getElementById("webgl").appendChild(renderer.domElement);

  gsap.to(particleSystem.rotation, {
    y: Math.PI * 2,

    duration: 10,

    repeat: -1,

    ease: "none",
  });

  update(camera, scene, renderer, controls);
}

function update(camera, scene, renderer, controls) {
  controls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(() => {
    update(camera, scene, renderer, controls);
  });
}

init();
