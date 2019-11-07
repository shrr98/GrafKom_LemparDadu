function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, antialias : true});
    
    
    const fov = 40;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 40;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xAAAAAA);

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(1, -2, -4);
        scene.add(light);
    }

    objects = [];
    const geometry = new THREE.BoxBufferGeometry(5,5,5);
    
    {
        var materials = [
            new THREE.MeshLambertMaterial({
                color : 0xffffff,
                map: new THREE.TextureLoader().load('img/inverted-dice-1.png')
            }),
            new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load('img/inverted-dice-2.png')
            }),
            new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load('img/inverted-dice-3.png')
            }),
            new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load('img/inverted-dice-4.png')
            }),
            new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load('img/inverted-dice-5.png')
            }),
            new THREE.MeshLambertMaterial({
                map: new THREE.TextureLoader().load('img/inverted-dice-6.png')
            })
         ];
    }
    
    const material = new THREE.MeshPhongMaterial({color: 0x0f0fff});
    const threshold = 0.01;

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }

      function render(time) {
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
        if(objects.length > 0)
            for(obj of objects){
                if(obj.inc==1){
                    console.log("lempar " + obj.maxSpeed);
                    obj.speed += 1;
                    if(obj.speed>obj.maxSpeed){
                        obj.inc = 0;
                    }
                        
                    obj.rotation.x += obj.speed*0.001;
                    obj.rotation.y += obj.speed*0.002;
                    obj.rotation.z += obj.speed*0.003;
                }
                else if(obj.inc==0 && obj.speed>1){
                    obj.speed -= 1;
                    
                    obj.rotation.x += obj.speed*0.001;
                    obj.rotation.y += obj.speed*0.002;
                    obj.rotation.z += obj.speed*0.003;
                }
                else if(obj.inc==0 && obj.speed == 1){
                    round = {};
                    round.x = obj.rotation.x / (Math.PI/2);
                    round.y = obj.rotation.y / (Math.PI/2);
                    round.z = obj.rotation.z / (Math.PI/2);
                    obj.target.x = (Math.ceil(round.x))*(Math.PI/2);
                    obj.target.z = (Math.ceil(round.z))*(Math.PI/2);
                    obj.target.y = (Math.ceil(round.y))*(Math.PI/2);

                    obj.inc = -1;
                }
                else if(obj.inc==-1){
                    console.log('masuk lambat');
                    if(Math.abs(obj.rotation.x - obj.target.x) <= threshold && Math.abs(obj.rotation.y - obj.target.y) <= threshold && Math.abs(obj.rotation.z - obj.target.z) <= threshold){
                        obj.speed = 0;
                        obj.maxSpeed = 0;
                        obj.inc = 0;
                        console.log("selesai");
                        continue;
                    }
                    
                    if(Math.abs(obj.rotation.x - obj.target.x) > threshold)
                        obj.rotation.x += (Math.PI/2) * threshold;
                    
                        
                    if(Math.abs(obj.rotation.y - obj.target.y) > threshold)
                        obj.rotation.y += (Math.PI/2) * threshold;
                
                    if(Math.abs(obj.rotation.z - obj.target.z) > threshold)
                        obj.rotation.z += (Math.PI/2) * threshold;
                    
                }               
            }

        renderer.render(scene, camera);
        requestAnimationFrame(render);

      }
    
      requestAnimationFrame(render);

    function lemparDadu(){
        for(obj of objects){
            obj.speed = 1;
            obj.maxSpeed = (Math.random()+1) * 100;
            obj.inc = 1;
        }
    }

    function createDices(){
        var num = document.getElementById("dadu").selectedIndex + 1;
        var obj;
        for(obj of objects) {
            scene.remove(obj)
        }
        objects = [];
        for(i=0; i<num; i++){
            obj = new THREE.Mesh(geometry, materials);
            obj.position.x = (i-(num-1)/2) / num * 50;
            obj.speed = 0;
            obj.maxSpeed = 0;
            obj.inc = 0;
            obj.round = {x:0, y:0};
            obj.target = {x:0, y:0};
            objects.push(obj);
            scene.add(obj);
        }
    }

      document.getElementById("lempar").addEventListener("click", lemparDadu);
      document.getElementById("go").addEventListener("click", createDices);
}

main();