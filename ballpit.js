/**
 * 3D Pastel Ballpit Physics Background - React Bits Integration
 * Uses Three.js for interactive physics particles that bounce and follow cursor
 */

(function () {
  'use strict';

  function initBallpit() {
    const canvas = document.getElementById('ballpitCanvas');
    if (!canvas) return;

    if (typeof THREE === 'undefined') {
      setTimeout(initBallpit, 50);
      return;
    }

    const heroSection = document.getElementById('hero') || canvas.closest('section') || document.body;
    
    function getDimensions() {
      const w = heroSection.clientWidth || window.innerWidth;
      const h = Math.max(heroSection.clientHeight, heroSection.offsetHeight, 650);
      return { width: w, height: h };
    }

    let { width, height } = getDimensions();

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(12, 18, 14);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffd5cc, 1.0);
    dirLight2.position.set(-12, -8, 10);
    scene.add(dirLight2);

    const cursorLight = new THREE.PointLight(0x7fe3dc, 3.0, 20);
    cursorLight.position.set(0, 0, 6);
    scene.add(cursorLight);

    // 3. Official UrbanSitter Color Palette for 3D Ballpit
    const pastelPalette = [
      new THREE.Color('#007a87'), // UrbanSitter Deep Teal
      new THREE.Color('#00b4d8'), // UrbanSitter Bright Aqua
      new THREE.Color('#d4edf2'), // UrbanSitter Ice Mint
      new THREE.Color('#ff6b6b'), // UrbanSitter Coral Pink
      new THREE.Color('#4f46e5'), // UrbanSitter Royal Indigo Purple
      new THREE.Color('#fcd34d'), // UrbanSitter Star Gold
      new THREE.Color('#7fe3dc')  // UrbanSitter Mint Teal
    ];

    // 4. World Limits based on Camera View
    function calcWorldLimits() {
      const vFov = (camera.fov * Math.PI) / 180;
      const wHeight = 2 * Math.tan(vFov / 2) * camera.position.z;
      const wWidth = wHeight * camera.aspect;
      return {
        maxX: wWidth / 2,
        maxY: wHeight / 2,
        maxZ: 3.0
      };
    }

    let limits = calcWorldLimits();

    // 5. Balls setup
    const COUNT = 85;
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      roughness: 0.15,
      metalness: 0.05,
      wireframe: false
    });

    const instancedMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, COUNT);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(instancedMesh);

    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    const dummy = new THREE.Object3D();

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * limits.maxX * 1.9;
      positions[i3 + 1] = (Math.random() - 0.5) * limits.maxY * 1.9;
      positions[i3 + 2] = (Math.random() - 0.5) * limits.maxZ * 1.6;

      velocities[i3] = (Math.random() - 0.5) * 0.035;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.035;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.015;

      sizes[i] = 0.55 + Math.random() * 0.55; // Visible radius

      const col = pastelPalette[i % pastelPalette.length];
      instancedMesh.setColorAt(i, col);

      dummy.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      dummy.scale.setScalar(sizes[i]);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true;
    }
    instancedMesh.instanceMatrix.needsUpdate = true;

    // 6. Interactive Cursor Tracking
    const targetCursorPos = new THREE.Vector3(999, 999, 0);
    const currentCursorPos = new THREE.Vector3(999, 999, 0);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouse = new THREE.Vector2(-999, -999);
    const intersection = new THREE.Vector3();

    function onPointerMove(e) {
      const rect = heroSection.getBoundingClientRect();
      if (
        e.clientY >= rect.top - 50 &&
        e.clientY <= rect.bottom + 50 &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      ) {
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        if (raycaster.ray.intersectPlane(plane, intersection)) {
          targetCursorPos.copy(intersection);
        }
      } else {
        targetCursorPos.set(999, 999, 0);
      }
    }

    function onPointerLeave() {
      targetCursorPos.set(999, 999, 0);
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) onPointerMove(e.touches[0]);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) onPointerMove(e.touches[0]);
    }, { passive: true });

    // 7. Resize Handling
    function onResize() {
      const dims = getDimensions();
      width = dims.width;
      height = dims.height;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      limits = calcWorldLimits();
    }

    window.addEventListener('resize', onResize);

    // 8. Physics & Render Loop
    const gravity = 0.0006;
    const friction = 0.995;
    const bounce = 0.85;

    function animate() {
      requestAnimationFrame(animate);

      // Smooth cursor follower
      currentCursorPos.lerp(targetCursorPos, 0.12);
      if (currentCursorPos.x < 900) {
        cursorLight.position.set(currentCursorPos.x, currentCursorPos.y, 4);
      }

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const radius = sizes[i];

        // Slight buoyant floating physics
        velocities[i3 + 1] -= gravity * radius;
        velocities[i3] *= friction;
        velocities[i3 + 1] *= friction;
        velocities[i3 + 2] *= friction;

        // Gentle constant wandering float
        velocities[i3] += Math.sin(Date.now() * 0.001 + i) * 0.0004;
        velocities[i3 + 1] += Math.cos(Date.now() * 0.0012 + i) * 0.0004;

        // Cursor push repulsion
        if (currentCursorPos.x < 900) {
          const dx = positions[i3] - currentCursorPos.x;
          const dy = positions[i3 + 1] - currentCursorPos.y;
          const distSq = dx * dx + dy * dy;
          const minDist = radius + 2.4;
          if (distSq < minDist * minDist && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const force = (minDist - dist) * 0.08;
            velocities[i3] += (dx / dist) * force;
            velocities[i3 + 1] += (dy / dist) * force;
          }
        }

        // Apply velocities to positions
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        // Boundary walls bounce
        if (positions[i3] + radius > limits.maxX) {
          positions[i3] = limits.maxX - radius;
          velocities[i3] = -Math.abs(velocities[i3]) * bounce;
        } else if (positions[i3] - radius < -limits.maxX) {
          positions[i3] = -limits.maxX + radius;
          velocities[i3] = Math.abs(velocities[i3]) * bounce;
        }

        if (positions[i3 + 1] + radius > limits.maxY) {
          positions[i3 + 1] = limits.maxY - radius;
          velocities[i3 + 1] = -Math.abs(velocities[i3 + 1]) * bounce;
        } else if (positions[i3 + 1] - radius < -limits.maxY) {
          positions[i3 + 1] = -limits.maxY + radius;
          velocities[i3 + 1] = Math.abs(velocities[i3 + 1]) * bounce;
        }

        if (Math.abs(positions[i3 + 2]) + radius > limits.maxZ) {
          positions[i3 + 2] = Math.sign(positions[i3 + 2]) * (limits.maxZ - radius);
          velocities[i3 + 2] = -velocities[i3 + 2] * bounce;
        }

        // Particle-to-particle collisions (optimized neighbor window)
        for (let j = i + 1; j < Math.min(i + 12, COUNT); j++) {
          const j3 = j * 3;
          const dx = positions[j3] - positions[i3];
          const dy = positions[j3 + 1] - positions[i3 + 1];
          const dz = positions[j3 + 2] - positions[i3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;
          const minDist = radius + sizes[j];

          if (distSq < minDist * minDist && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const overlap = (minDist - dist) * 0.5;
            const nx = dx / dist;
            const ny = dy / dist;
            const nz = dz / dist;

            positions[i3] -= nx * overlap;
            positions[i3 + 1] -= ny * overlap;
            positions[i3 + 2] -= nz * overlap;

            positions[j3] += nx * overlap;
            positions[j3 + 1] += ny * overlap;
            positions[j3 + 2] += nz * overlap;

            velocities[i3] -= nx * 0.008;
            velocities[i3 + 1] -= ny * 0.008;
            velocities[j3] += nx * 0.008;
            velocities[j3 + 1] += ny * 0.008;
          }
        }

        // Update instance matrix
        dummy.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
        dummy.scale.setScalar(radius);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    }

    animate();
    setTimeout(onResize, 200);
    setTimeout(onResize, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBallpit);
  } else {
    initBallpit();
  }
})();
