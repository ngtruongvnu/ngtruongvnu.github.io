document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const container = document.getElementById('heart-container');
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Create WebGL renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    
    // Create a group to hold all hearts
    const heartsGroup = new THREE.Group();
    scene.add(heartsGroup);
    
    // Create multiple hearts
    function createHeart(x, y, z, scale) {
        const heartShape = new THREE.Shape();
        
        // Heart shape coordinates
        heartShape.moveTo(0, 0);
        heartShape.bezierCurveTo(0, -1, -1, -1.5, -2, -1);
        heartShape.bezierCurveTo(-3, -0.5, -3, 0.5, -2, 1);
        heartShape.bezierCurveTo(-1, 1.5, 0, 2, 0, 3);
        heartShape.bezierCurveTo(0, 2, 1, 1.5, 2, 1);
        heartShape.bezierCurveTo(3, 0.5, 3, -0.5, 2, -1);
        heartShape.bezierCurveTo(1, -1.5, 0, -1, 0, 0);
        
        // Create 3D geometry from the 2D shape
        const geometry = new THREE.ExtrudeGeometry(heartShape, {
            depth: 0.5,
            bevelEnabled: true,
            bevelSegments: 3,
            bevelSize: 0.3,
            bevelThickness: 0.2
        });
        
        // Create material with random pink/red color
        const hue = Math.random() * 30 + 330; // 330-360 (red/pink)
        const saturation = Math.random() * 40 + 60; // 60-100%
        const lightness = Math.random() * 30 + 40; // 40-70%
        
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`),
            shininess: 100,
            specular: 0xffffff
        });
        
        // Create mesh
        const heart = new THREE.Mesh(geometry, material);
        heart.scale.set(scale, scale, scale);
        heart.position.set(x, y, z);
        heart.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        // Store original values for animation
        heart.userData = {
            originalScale: scale,
            pulseSpeed: Math.random() * 0.03 + 0.01,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            }
        };
        
        heartsGroup.add(heart);
        return heart;
    }
    
    // Position camera
    camera.position.z = 15;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create multiple hearts
    const hearts = [];
    const numHearts = 7;
    
    for (let i = 0; i < numHearts; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 10;
        const scale = Math.random() * 0.3 + 0.2;
        
        hearts.push(createHeart(x, y, z, scale));
    }
    
    // Animation variables
    let time = 0;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        time += 0.01;
        
        // Rotate the entire heart group
        heartsGroup.rotation.y += 0.002;
        
        // Animate individual hearts
        hearts.forEach(heart => {
            const userData = heart.userData;
            
            // Beating animation
            const pulseFactor = Math.sin(time * userData.pulseSpeed * 10) * 0.1 + 1;
            heart.scale.set(
                userData.originalScale * pulseFactor,
                userData.originalScale * pulseFactor,
                userData.originalScale * pulseFactor
            );
            
            // Slight rotation
            heart.rotation.x += userData.rotationSpeed.x;
            heart.rotation.y += userData.rotationSpeed.y;
            heart.rotation.z += userData.rotationSpeed.z;
        });
        
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Start animation
    animate();
});