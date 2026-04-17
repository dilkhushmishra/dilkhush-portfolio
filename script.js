// Shooting Stars with Animation
function createShootingStar() {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * (window.innerHeight * 0.4);
    star.style.left = startX + 'px';
    star.style.top = startY + 'px';
    const duration = 1.5 + Math.random() * 1.5;
    star.style.animationDuration = duration + 's';
    star.style.animationDelay = Math.random() * 0.3 + 's';
    document.getElementById('stars-container').appendChild(star);
    setTimeout(() => star.remove(), (duration + 1) * 1000);
}

setInterval(createShootingStar, 600);

// Jump Scare Easter Egg
let clickCount = 0;
const brandIcon = document.querySelector('.brand-icon');

brandIcon.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        triggerJumpScare();
        clickCount = 0;
    }
});

function triggerJumpScare() {
    const jumpScare = document.createElement('div');
    jumpScare.className = 'jump-scare';
    jumpScare.textContent = '👻';
    document.body.appendChild(jumpScare);
    
    // Sound effect (optional)
    playScareSound();
    
    setTimeout(() => jumpScare.remove(), 3000);
}

function playScareSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Three.js Floating Bubbles
const canvas = document.getElementById("three-canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1200);
camera.position.set(0, 0, 18);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

const particleCount = 140;
const group = new THREE.Group();
const geometry = new THREE.SphereGeometry(0.22, 16, 16);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x6c8cff, 
    roughness: 0.25, 
    metalness: 0.7, 
    transparent: true, 
    opacity: 0.75 
});

for (let i = 0; i < particleCount; i++) {
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.position.set(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18
    );
    mesh.scale.setScalar(0.35 + Math.random() * 0.8);
    mesh.material.color.setHSL(0.6 + Math.random() * 0.12, 0.75, 0.65);
    mesh.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.0025,
        (Math.random() - 0.5) * 0.0025,
        (Math.random() - 0.5) * 0.0025
    );
    group.add(mesh);
}

scene.add(group);

const light1 = new THREE.PointLight(0x9dc1ff, 1.8, 180);
light1.position.set(12, 12, 20);
scene.add(light1);

const light2 = new THREE.PointLight(0xff6eb4, 1, 120);
light2.position.set(-15, -10, 10);
scene.add(light2);

const light3 = new THREE.AmbientLight(0xffffff, 0.3);
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
        if (distance < 4) {
            particle.userData.velocity.multiplyScalar(-2.5);
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

// Scroll Animations with GSAP
gsap.registerPlugin(ScrollTrigger);

// Animate skill progress bars on scroll
gsap.utils.toArray(".skill-progress").forEach(bar => {
    const width = bar.style.width;
    bar.style.width = "0%";
    
    gsap.to(bar, {
        width: width,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: bar,
            start: "top 80%",
            once: true
        }
    });
});

// Animate project cards on scroll
gsap.utils.toArray(".project-card").forEach((card, index) => {
    gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        delay: index * 0.12,
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            once: true
        }
    });
});

// Animate achievement items
gsap.utils.toArray(".achievement-item").forEach((item, index) => {
    gsap.from(item, {
        opacity: 0,
        scale: 0.7,
        duration: 0.8,
        delay: index * 0.12,
        scrollTrigger: {
            trigger: item,
            start: "top 80%",
            once: true
        }
    });
});

// Scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.topbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 30;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Message sent! Thank you for reaching out.');
    this.reset();
});

// Add scroll animation to navbar
const topbar = document.querySelector('.topbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    if (scrollTop > 50) {
        topbar.style.boxShadow = '0 12px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
    } else {
        topbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});