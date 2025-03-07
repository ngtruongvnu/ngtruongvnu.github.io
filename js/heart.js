document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const container = document.getElementById('heart-container');
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Create WebGL renderer with maximum quality settings
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        precision: 'highp'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Balanced quality
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    
    // Create a group to hold all hearts
    const heartsGroup = new THREE.Group();
    scene.add(heartsGroup);
    
    // Create smoother hearts with perfectly pink colors
    function createHeart(x, y, z, scale) {
        // Improved heart shape with smoother bottom point
        const heartShape = new THREE.Shape();
        
        // Start at the bottom point - refined for smoothness
        heartShape.moveTo(0, 0);
        
        // Left curve - improved for smoother transition at bottom point
        heartShape.bezierCurveTo(
            -0.5, -0.8,   // Move control point closer for smoother bottom
            -1.5, -1.8,   // Adjusted for smoother curve
            -2.5, -1.0    // Adjusted endpoint
        );
        
        // Left side continuing up
        heartShape.bezierCurveTo(
            -3.5, 0,      // Adjusted control point
            -3.0, 1.5,    // Adjusted control point
            -1.5, 2.0     // Adjusted endpoint
        );
        
        // Top middle
        heartShape.bezierCurveTo(
            -0.5, 2.5,    // Adjusted control point
            0, 3.0,       // Adjusted control point
            0, 3.5        // Top point
        );
        
        // Right side going down
        heartShape.bezierCurveTo(
            0, 3.0,       // Mirrored control point
            0.5, 2.5,     // Mirrored control point
            1.5, 2.0      // Mirrored endpoint
        );
        
        // Right curve back to bottom
        heartShape.bezierCurveTo(
            3.0, 1.5,     // Mirrored control point
            3.5, 0,       // Mirrored control point
            2.5, -1.0     // Mirrored endpoint
        );
        
        // Complete the heart shape with improved bottom point
        heartShape.bezierCurveTo(
            1.5, -1.8,    // Mirrored control point
            0.5, -0.8,    // Mirrored control point
            0, 0          // Back to start
        );
        
        // Create 3D geometry with ultra-smooth settings
        const geometry = new THREE.ExtrudeGeometry(heartShape, {
            depth: 1.0,
            bevelEnabled: true,
            bevelSegments: 16,     // Increased for smoother edges
            bevelSize: 0.2,        // Smaller bevel for cleaner edges
            bevelThickness: 0.2,
            curveSegments: 32      // Significantly increased for smoother curves
        });
        
        // Center the geometry perfectly
        geometry.center();
        
        // Create consistently lovely pink material
        // Perfect pink colors - no more reddish tones
        const hue = Math.random() * 15 + 325;     // 325-340 range (perfect pink)
        const saturation = Math.random() * 15 + 85; // 85-100% (vibrant)
        const lightness = Math.random() * 15 + 60;  // 60-75% (bright & lovely)
        
        // Create beautiful materials with glow effect
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`),
            shininess: 100,
            specular: new THREE.Color(0xffffff),
            flatShading: false,    // Ensure smooth shading
            emissive: new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness-40}%)`),
            emissiveIntensity: 0.2 // Soft glow
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
        
        // Enhanced animation parameters
        heart.userData = {
            originalScale: scale,
            pulseSpeed: Math.random() * 0.06 + 0.09,  // Even faster pulse
            pulseAmount: Math.random() * 0.12 + 0.18, // Stronger pulse
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
    
    // Enhanced pink lighting for better color display
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Pink-tinted main light
    const directionalLight = new THREE.DirectionalLight(0xffc0cb, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Pink backlight for depth
    const backLight = new THREE.DirectionalLight(0xffe6f0, 0.5);
    backLight.position.set(-1, 0.5, -1);
    scene.add(backLight);
    
    // Soft pink point light at center
    const pointLight = new THREE.PointLight(0xffb6c1, 0.4, 20);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);
    
    // Create multiple hearts
    const hearts = [];
    const numHearts = 11;  // More hearts!
    
    for (let i = 0; i < numHearts; i++) {
        const x = (Math.random() - 0.5) * 20;
        const y = (Math.random() - 0.5) * 20;
        const z = (Math.random() - 0.5) * 10;
        const scale = Math.random() * 0.3 + 0.25;  // Slightly larger
        
        hearts.push(createHeart(x, y, z, scale));
    }
    
    // Animation variables
    let time = 0;
    
    // Animation loop with faster beating
    function animate() {
        requestAnimationFrame(animate);
        
        time += 0.025;  // Even faster time increment
        
        // Rotate the entire heart group
        heartsGroup.rotation.y += 0.003;
        
        // Animate individual hearts with faster, more pronounced beating
        hearts.forEach(heart => {
            const userData = heart.userData;
            
            // Enhanced beating animation with faster, stronger pulse
            const beatPhase = time * userData.pulseSpeed * 18;  // Super fast beat
            
            // Create a heartbeat-like pattern using modified sine wave
            let pulseFactor;
            const normalizedPhase = beatPhase % (2 * Math.PI);
            
            if (normalizedPhase < Math.PI * 0.3) {
                // Quicker contraction (systole)
                pulseFactor = 1 - userData.pulseAmount * Math.sin(normalizedPhase * 3.3);
            } else {
                // Slower expansion (diastole)
                pulseFactor = 1 + userData.pulseAmount * 0.6 * Math.sin((normalizedPhase - Math.PI * 0.3) * 0.5);
            }
            
            heart.scale.set(
                userData.originalScale * pulseFactor,
                userData.originalScale * pulseFactor, 
                userData.originalScale * pulseFactor * 0.95  // Slightly flatter in z-axis
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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    
    // Start animation
    animate();
});