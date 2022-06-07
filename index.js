const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// Add your code here matching the playground format

//-------------------------------------------------------------------------------------------------------------------------------------------


const createScene = () => {
    const fps = 144;
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    
    //player root part
    const playerRootPart = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.1});

    //sword
    let sword = BABYLON.SceneLoader.ImportMeshAsync("", "./", "sword.glb");
    let grandSlash;
    sword.then((newMeshes, _particleSystems, _skeletons, animationGroups) => {
      sword = newMeshes.meshes[0]; //took 3 morbillion years to find out

      grandSlash = scene.getAnimationGroupByName("grandSlash");
      console.log(grandSlash);
      grandSlash.stop();
    });
    const gl = new BABYLON.GlowLayer("glow", scene, { 
      mainTextureSamples: 4 
    });
    gl.intensity = 0.4;

    //test obj
    const targetPart = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 10});
    targetPart.position = new BABYLON.Vector3(20,20,20);
    


    //camera
    const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 0, playerRootPart.position);
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 10;
    delete camera.lowerBetaLimit;
    delete camera.upperBetaLimit;

    //pointerlock check code snippet from https://www.babylonjs-playground.com/#52LP1L#34
    let isLocked = false;
    scene.onPointerDown = function (evt) {
      if (!isLocked) {
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock || false;
        if (canvas.requestPointerLock) {
          canvas.requestPointerLock();
        }
      }
    };
    let pointerlockchange = function () {
      let controlEnabled = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || false;
      if (!controlEnabled) {
        camera.detachControl(canvas);
        isLocked = false;
      } else {
        camera.attachControl(canvas);
        isLocked = true;
      }
    }

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    //key event arrow function template from https://doc.babylonjs.com/divingDeeper/scene/interactWithScenes
    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
          case BABYLON.PointerEventTypes.POINTERDOWN:
            console.log("POINTER DOWN");
            break;
          case BABYLON.PointerEventTypes.POINTERUP:
            console.log("POINTER UP");
            break;
          case BABYLON.PointerEventTypes.POINTERMOVE:
            console.log("POINTER MOVE");
            break;
          case BABYLON.PointerEventTypes.POINTERWHEEL:
            console.log("POINTER WHEEL");
            break;
          case BABYLON.PointerEventTypes.POINTERPICK:
            console.log("POINTER PICK");
            break;
          case BABYLON.PointerEventTypes.POINTERTAP:
            console.log("POINTER TAP");
            break;
          case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
            console.log("POINTER DOUBLE-TAP");
            break;
        }
      });
    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
          case BABYLON.KeyboardEventTypes.KEYDOWN:  
            console.log("KEY DOWN: ", kbInfo.event.key);
            grandSlash.start();
            break;
          case BABYLON.KeyboardEventTypes.KEYUP:
            console.log("KEY UP: ", kbInfo.event.code);
            break;
        }
      });

    return scene;
};


//-------------------------------------------------------------------------------------------------------------------------------------------

const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
if (scene){
    scene.render();
}
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
engine.resize();
});