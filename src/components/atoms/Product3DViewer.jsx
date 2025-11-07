import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Product3DViewer() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f0);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create bottle group
    const bottleGroup = new THREE.Group();

    // Bottle body (cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 0.8, 3.5, 64);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5dc,
      roughness: 0.5,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = -1.5; // Lowered the body to center it in the container
    bottleGroup.add(body);

    // Bottle neck
    const neckGeometry = new THREE.CylinderGeometry(0.35, 0.45, 0.8, 64);
    const neckMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5dc,
      roughness: 0.5,
      metalness: 0.1
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 0.85; // Adjusted neck position relative to the body
    bottleGroup.add(neck);

    // Spray cap base
    const capBaseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 64);
    const capMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.8
    });
    const capBase = new THREE.Mesh(capBaseGeometry, capMaterial);
    capBase.position.y = 1.65; // Adjusted cap base position relative to the neck
    bottleGroup.add(capBase);

    // Spray nozzle
    const nozzleGeometry = new THREE.CylinderGeometry(0.25, 0.35, 0.6, 64);
    const nozzle = new THREE.Mesh(nozzleGeometry, capMaterial);
    nozzle.position.y = 2.15; // Adjusted nozzle position relative to the cap base
    bottleGroup.add(nozzle);

    // Liquid inside
    const liquidGeometry = new THREE.CylinderGeometry(0.75, 0.75, 3.3, 64);
    const liquidMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffcc,
      transparent: true,
      opacity: 0.6,
      roughness: 0.2,
      metalness: 0.1
    });
    const liquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
    liquid.position.y = -1.5; // Centered the liquid inside the body
    bottleGroup.add(liquid);

    scene.add(bottleGroup);

    // Animation
    const animate = () => {
      bottleGroup.rotation.y += 0.01; // Ensure rotation is applied
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  // Updated the container style to ensure proper rendering
  return <div ref={mountRef} style={{ width: '100%', height: '300px' }} />;
}