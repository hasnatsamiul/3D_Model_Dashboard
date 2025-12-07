import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

import { Lattice } from "../types";

interface Props {
  lattice: Lattice | null;
  colorMode: string;
  onSelectNode: (node: any) => void;
}

const LatticeViewer: React.FC<Props> = ({ lattice, colorMode, onSelectNode }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lattice || !mountRef.current) return;

    const mount = mountRef.current;
    mount.innerHTML = "";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    const camera = new THREE.PerspectiveCamera(
      60,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    lattice.nodes.forEach((node) => {
      const geo = new THREE.SphereGeometry(0.15, 16, 16);

      let value = 0.5;
      if (node.data?.recommended_aluminium_mass) {
        value = node.data.recommended_aluminium_mass;
      }

      const color = new THREE.Color().setHSL(0.6 - value * 0.6, 1, 0.5);

      const mat = new THREE.MeshBasicMaterial({ color });
      const sphere = new THREE.Mesh(geo, mat);

      sphere.position.set(node.x, node.y, node.z);
      sphere.userData = node;

      scene.add(sphere);
    });

    lattice.edges.forEach((e) => {
      const a = lattice.nodes[e.start];
      const b = lattice.nodes[e.end];

      const material = new THREE.LineBasicMaterial({ color: 0x444444 });
      const points = [new THREE.Vector3(a.x, a.y, a.z), new THREE.Vector3(b.x, b.y, b.z)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener("click", (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const n = intersects[0].object.userData;
        if (n) onSelectNode(n);
      }
    });

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      renderer.dispose();
    };
  }, [lattice, colorMode]);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "100%", background: "#111" }}
    />
  );
};

export default LatticeViewer;
