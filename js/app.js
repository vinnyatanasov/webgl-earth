var app = (function (){
    
    "use strict";
    
    var scene = new THREE.Scene(),
        renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(),
        lightA,
        light,
        camera,
        controls,
        axes,
        stats;
    
    var earth, pivot, moon;
    
    function init(){
        renderer.setSize(window.innerWidth, window.innerHeight);
        // enable shadows
        renderer.shadowMap.enabled = true;
        document.getElementById("webgl-container").appendChild(renderer.domElement);
        
        // add camera
        camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth/window.innerHeight,
            1,
            1000
        );
        // reposition camera slightly (x, y, z)
        camera.position.set(50, 100, 300);
        scene.add(camera);
        
        // add ambient light
        lightA = new THREE.AmbientLight();
        scene.add(lightA);
        
        // add point light
        light = new THREE.DirectionalLight(0xffffff);
        light.position.set(-500, 0, 0);
        light.castShadow = true;
        scene.add(light);
        
        // add earth sphere
        var earthSize = 50;
        earth = new THREE.Mesh(
            new THREE.SphereGeometry(earthSize, 50, 50),
            new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture("assets/earthmap.jpg")
            })
        );
        earth.name = "earth";
        earth.receiveShadow = true;
        earth.castShadow = true;
        
        scene.add(earth);
        
        // add pivot for simple moon orbit
        pivot = new THREE.Object3D();
        scene.add(pivot);
        
        // add moon sphere
        // calculate rough moon size and position compared to earth
        var sizeRatio = 7917/2160;
        var moonSize = earthSize/sizeRatio;
        moon = new THREE.Mesh(
            new THREE.SphereGeometry(moonSize, 50, 50),
            new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture("assets/moonmap.jpg")
            })
        );
        moon.name = "moon";
        moon.position.x = 150;
        moon.receiveShadow = true;
        moon.castShadow = true;
        
        pivot.add(moon);
        
        // monitor performance with stats.js
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = "absolute";
        stats.domElement.style.left = "0px";
        stats.domElement.style.top = "0px";
        document.body.appendChild(stats.domElement);
        
        controls = new THREE.OrbitControls(camera);
        //controls.addEventListener("change", render);
        
        // add visible axes
        axes = new THREE.AxisHelper(300);
        scene.add(axes);
        
        render();
    }
    
    function render(){
        // adjust rotations on each render
        earth.rotation.y -= 0.001;
        pivot.rotation.y += 0.01;
        
        renderer.render(scene, camera);
        requestAnimationFrame(render);
        stats.update();
    }
    
    // handle events
    window.onload = init;
    
    // keep output as full screen on resize
    window.onresize = function(){
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    };
    
    //return {
    //    scene: scene
    //}
    
})();