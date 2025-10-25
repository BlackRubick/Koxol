import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDModelViewer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0xffffff, 0);
    mount.innerHTML = ''; // Clear previous content
    mount.appendChild(renderer.domElement);

    // Light setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const textures = {
      diffuse: textureLoader.load('/crema/texture_diffuse.png'),
      metallic: textureLoader.load('/crema/texture_metallic.png'),
      normal: textureLoader.load('/crema/texture_normal.png'),
      roughness: textureLoader.load('/crema/texture_roughness.png'),
      pbr: textureLoader.load('/crema/texture_pbr.png'),
      shaded: textureLoader.load('/crema/shaded.png'),
    };

    // Load 3D model
    const loader = new OBJLoader();
    loader.load(
      '/crema/base.obj',
      (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              map: textures.diffuse,
              metalnessMap: textures.metallic,
              normalMap: textures.normal,
              roughnessMap: textures.roughness,
              envMap: textures.pbr,
            });
          }
        });

        const boundingBox = new THREE.Box3().setFromObject(object);
        const size = boundingBox.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scaleFactor = mount.clientHeight / maxDimension / 2;

        object.scale.set(scaleFactor, scaleFactor, scaleFactor);
        object.position.set(0, size.y * scaleFactor / 2, 0);
        scene.add(object);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.error('Error loading model:', error);
      }
    );

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 2;
    controls.maxDistance = 6;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mount.innerHTML = ''; // Clear content on unmount
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', background: 'none' }}
    />
  );
};

export default ThreeDModelViewer;