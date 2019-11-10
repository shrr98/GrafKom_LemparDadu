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

    {
        X = [5,3,6,4];
        Y = [5,2,6,1];
        Z = [2,3,1,4];
    }

    objects = [];
    const geometry = new THREE.BoxBufferGeometry(5,5,5);
    
   var materials = [];

    // var fontUsed = null;
    // const loader = new THREE.FontLoader(manager);
    // loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    //     fontUsed = font;
    // });
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
                    if(Math.abs(obj.rotation.x - obj.target.x) <= threshold && Math.abs(obj.rotation.y - obj.target.y) <= threshold && Math.abs(obj.rotation.z - obj.target.z) <= threshold){
                        obj.speed = 0;
                        obj.maxSpeed = 0;
                        obj.inc = 0;
                        obj.rotation.x %= 2*Math.PI;
                        obj.rotation.y %= 2*Math.PI;
                        obj.rotation.z %= 2*Math.PI;
                        angka = 5;
                        isExsist = X.indexOf(angka);
                        if(isExsist>=0){
                            nowIndex = (isExsist + Math.round(obj.rotation.x / Math.PI * 2))%4;
                            angka = X[nowIndex]; 
                        }
                        
                        isExsist = Y.indexOf(angka);
                        if(isExsist>=0){
                            nowIndex = (isExsist + Math.round(obj.rotation.y / Math.PI *2))%4;
                            angka = Y[nowIndex]; 
                        }
                        
                        isExsist = Z.indexOf(angka);
                        if(isExsist>=0){
                            nowIndex = (isExsist + Math.round(obj.rotation.z / Math.PI * 2))%4;
                            angka = Z[nowIndex]; 
                        }

                        scene.remove(obj.label);
                        createLabel(angka, obj);
                        console.log(angka, obj.rotation.x * 180/Math.PI, obj.rotation.y * 180/Math.PI, obj.rotation.z * 180/Math.PI);
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

    function createLabel(num, obj){
        console.log(obj);
        const loader = new THREE.FontLoader();
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        var geometry = new THREE.TextBufferGeometry(num.toString(), {
            font : font,
            size : 5.0,
            height : 1,
            curveSegments : 5,
            bevelEnabled : true,
            bevelThickness : 0.05,
            bevelSize : .01,
            bevelSegments : 1
          });
      
          const material = new THREE.MeshPhongMaterial({color : 0x000000});
          const mesh = new THREE.Mesh(geometry, material);
          mesh.num = num;
          mesh.name = name;
          geometry.computeBoundingBox();
          geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);
        
          mesh.position.set(obj.position.x-2, obj.position.y-10, obj.position.z);
          obj.label = mesh;
          scene.add(obj.label);
        });
    }

    function createDices(){
        var num = document.getElementById("dadu").selectedIndex + 1;
        var obj;
        var skin = 'img/' + document.getElementById('skin').value + '/'; 
        console.log(skin+'1.png');
        {
            var materials = [
                new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load(skin+'1.png')
                }),
                new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load(skin+'2.png')
                }),
                new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load(skin+'3.png')
                }),
                new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load(skin+'4.png')
                }),
                new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load(skin+'5.png')
                }),
                new THREE.MeshLambertMaterial({
                    map: new THREE.TextureLoader().load(skin+'6.png')
                })
             ];
        }
        for(obj of objects) {
            scene.remove(obj.label);
            scene.remove(obj);
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
            createLabel(5, obj);
            objects.push(obj);
            scene.add(obj);
        }
    }

      document.getElementById("lempar").addEventListener("click", lemparDadu);
      document.getElementById("go").addEventListener("click", createDices);
}

main();