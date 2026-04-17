 // Shooting Stars
        function createShootingStar() {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight * 0.5;
            star.style.left = startX + 'px';
            star.style.top = startY + 'px';
            const duration = 1 + Math.random() * 1.5;
            star.style.animationDuration = duration + 's';
            star.style.animationDelay = Math.random() * 0.5 + 's';
            document.getElementById('stars-container').appendChild(star);
            setTimeout(() => star.remove(), (duration + 1) * 1000);
        }

        setInterval(createShootingStar, 600);

        // Three.js Floating Bubbles
        const canvas = document.getElementById("three-canvas");
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1200);
        camera.position.set(0, 0, 18);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        const particleCount = 100;
        const group = new THREE.Group();
        const geometry = new THREE.SphereGeometry(0.22, 16, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0x6c8cff, roughness: 0.25, metalness: 0.7, transparent: true, opacity: 0.85 });

        for (let i = 0; i < particleCount; i++) {
            const mesh = new THREE.Mesh(geometry, material.clone());
            mesh.position.set(
                (Math.random() - 0.5) * 28,
                (Math.random() - 0.5) * 18,
                (Math.random() - 0.5) * 18
            );
            mesh.scale.setScalar(0.45 + Math.random() * 0.9);
            mesh.material.color.setHSL(0.6 + Math.random() * 0.12, 0.75, 0.65);
            mesh.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.0025,
                (Math.random() - 0.5) * 0.0025,
                (Math.random() - 0.5) * 0.0025
            );
            group.add(mesh);
        }

        scene.add(group);

        const light1 = new THREE.PointLight(0x9dc1ff, 1.5, 140);
        light1.position.set(12, 12, 20);
        scene.add(light1);

        const light2 = new THREE.PointLight(0xff6eb4, 0.8, 100);
        light2.position.set(-15, -10, 10);
        scene.add(light2);

        const light3 = new THREE.AmbientLight(0xffffff, 0.35);
        scene.add(light3);

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        const pointer = { x: 0, y: 0 };

        window.addEventListener("pointermove", (event) => {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        document.addEventListener("click", (event) => {
            group.children.forEach(particle => {
                const distance = particle.position.distanceTo(new THREE.Vector3(pointer.x * 10, pointer.y * 5, 0));
                if (distance < 3) {
                    particle.userData.velocity.multiplyScalar(-2);
                }
            });
        });

        function animate() {
            requestAnimationFrame(animate);
            group.rotation.y += 0.0012;
            group.rotation.x += 0.0008;
            group.children.forEach(particle => {
                particle.position.add(particle.userData.velocity);
                if (particle.position.x > 18 || particle.position.x < -18) particle.userData.velocity.x *= -1;
                if (particle.position.y > 12 || particle.position.y < -12) particle.userData.velocity.y *= -1;
                if (particle.position.z > 16 || particle.position.z < -16) particle.userData.velocity.z *= -1;
            });
            group.position.x += (pointer.x * 3 - group.position.x) * 0.04;
            group.position.y += (pointer.y * 2 - group.position.y) * 0.04;
            renderer.render(scene, camera);
        }

        animate();

        document.getElementById("theme-toggle").addEventListener("click", function() {
            document.documentElement.style.colorScheme = document.documentElement.style.colorScheme === "light" ? "dark" : "light";
            this.textContent = document.documentElement.style.colorScheme === "light" ? "Light Mode" : "Dark Mode";
        });