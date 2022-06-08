const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// Add your code here matching the playground format

//----------------------------------------------------------{above this line is basically the universal template code}---------------------------------------------------------------------------------


const createScene = () => {
  const fps = 144;
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0, 0, 0);

  //camera
  const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0,0,0));
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 10;
  delete camera.lowerBetaLimit;
  delete camera.upperBetaLimit;
  
  //ORIGIN
  const playerRootPart = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2});
  const redMaterial = new BABYLON.StandardMaterial("redMaterial");
  redMaterial.diffuseTexture = new BABYLON.Texture("./red.jpg");
  redMaterial.emissiveTexture = new BABYLON.Texture("./white.jpg");
  playerRootPart.material = redMaterial;



  //swordGS
  let grandSlash;
  let swordGS = BABYLON.SceneLoader.ImportMeshAsync("", "./", "swordGS.glb").then((newMeshes, _particleSystems, _skeletons, animationGroups) => { //took 3 morbillion years to find out that swordGS would be set properly after async but if I did something like let activeSword = swordGS; right after outside the async it wouldn't work beacuse activeSword would be holding a promise object ;-;
    swordGS = newMeshes.meshes[0]; //took 3 morbillion years to find out
    grandSlash = scene.getAnimationGroupByName("grandSlash");
    console.log(swordGS);
    grandSlash.stop();
    //BABYLON.Animation.CreateAndStartAnimation("moveW", swordGS, "position", 144, 1, camera.position.add(camera.getFrontPosition(10)), camera.position.add(camera.getFrontPosition(10)), BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  });
  const gl = new BABYLON.GlowLayer("glow", scene, { 
    mainTextureSamples: 4 
  });
  gl.intensity = 0.4;


  //swordT
  let thrust;
  let swordT = BABYLON.SceneLoader.ImportMeshAsync("", "./", "swordT.glb").then((newMeshes, _particleSystems, _skeletons, animationGroups) => {
    swordT = newMeshes.meshes[0]; //took 3 morbillion years to find out
    thrust = scene.getAnimationGroupByName("thrust");
    thrust.stop();
    swordT.setEnabled(false);

  });

  //active sword
  
  
  //sword autoTarget & auto 


  //test obj
  let targetParts = [];
  const chrisMaterial = new BABYLON.StandardMaterial("chrisMaterial");
  chrisMaterial.diffuseTexture = new BABYLON.Texture("./chris.png");
  chrisMaterial.emissiveTexture = new BABYLON.Texture("./white.jpg");
  for (let i = 0; i < 10; i++){
    targetParts.push(BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 50}));
    targetParts[i].material = chrisMaterial;
    targetParts[i].position = new BABYLON.Vector3(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50);
    targetParts[i].rotation = new BABYLON.Vector3(Math.random() * 2*Math.PI, Math.random() * 2*Math.PI, Math.random() * 2*Math.PI);

  }
  


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

  //position sword correctly
  //BABYLON.Animation.CreateAndStartAnimation("moveW", activeSword, "position.x", 144, 144, 0, 200, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  //key event arrow function template from https://doc.babylonjs.com/divingDeeper/scene/interactWithScenes
  scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          console.log("POINTER DOWN");
          grandSlash.start();
          thrust.start();
          break;
      }
    });
  scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case BABYLON.KeyboardEventTypes.KEYDOWN:  
          break;
        case BABYLON.KeyboardEventTypes.KEYUP:
          if (kbInfo.event.key == "1"){
            swordGS.setEnabled(true);
            swordT.setEnabled(false);
            activeSword = swordGS;
          }
          else if (kbInfo.event.key == "2"){
            swordT.setEnabled(true);
            swordGS.setEnabled(false);
            activeSword = swordT;
          }
          break;
      }
    });

    scene.registerAfterRender(() => {
      swordGS.setAbsolutePosition(camera.getFrontPosition(100));
      swordT.setAbsolutePosition(camera.getFrontPosition(100));
      swordGS.lookAt(camera.getFrontPosition(200));
      swordT.lookAt(camera.getFrontPosition(200));
      swordGS.rotation.x = swordGS.rotation.x + Math.PI/2;
      swordT.rotation.x = swordT.rotation.x + Math.PI/2;
    });

  return scene;
};


//---------------------------------------------------------------{below this line is basically universal template code}-------------------------------------------------------------------------------

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