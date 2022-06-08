var canvas = document.getElementById("renderCanvas");

        var startRenderLoop = function (engine, canvas) {
            engine.runRenderLoop(function () {
                if (sceneToRender && sceneToRender.activeCamera) {
                    sceneToRender.render();
                }
            });
        }

        var engine = null;
        var scene = null;
        var sceneToRender = null;
        var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };

//----------------------------------------------------------{above this line is basically the universal template code from download function of playground}---------------------------------------------------------------------------------


const createScene = async () => {
  const fps = 144;
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0, 0, 0);
  let go = false;
  let done = false;
  BABYLON.SceneOptimizer.OptimizeAsync(scene);

  //camera
  const camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0,0,0));
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 10;
  delete camera.lowerBetaLimit;
  delete camera.upperBetaLimit;
  camera.angularSensibility = 2000;
  camera.speed = 10;
  
  //ORIGIN
  const playerRootPart = new BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 10});
  const redMaterial = new BABYLON.StandardMaterial("redMaterial");
  redMaterial.diffuseTexture = new BABYLON.Texture("./red.jpg");
  redMaterial.emissiveTexture = new BABYLON.Texture("./white.jpg");
  playerRootPart.material = redMaterial;


  //swordGS
  let grandSlash;
  let swordGS = await new BABYLON.SceneLoader.ImportMeshAsync("", "./", "swordGS.glb");
  grandSlash = swordGS.animationGroups[0];
  console.log(grandSlash);
  grandSlash.stop();
  grandSlash.speed = 0.1;
  
  swordGS.meshes[0].setEnabled(false);

  const gl = new BABYLON.GlowLayer("glow", scene, { 
    mainTextureSamples: 4 
  });
  gl.intensity = 1;

  let GSBBox =  new BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 200});
  GSBBox.visibility = 0; 
  GSBBox.material = redMaterial;
  GSBBox.setEnabled(false);

  //swordT
  let thrust;
  let swordT = await BABYLON.SceneLoader.ImportMeshAsync("", "./", "swordT.glb");
  thrust = swordT.animationGroups[0];
  thrust.stop();
  swordT.meshes[0].setEnabled(false);

  let TBBox =  new BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 20});
  TBBox.visibility = 0; 
  TBBox.material = redMaterial;
  TBBox.setEnabled(false);

    //test obj
    let targetParts = [];
    const chrisMaterial = new BABYLON.StandardMaterial("chrisMaterial");
    chrisMaterial.diffuseTexture = new BABYLON.Texture("./chris.png");
    chrisMaterial.emissiveTexture = new BABYLON.Texture("./white.jpg");
    for (let i = 0; i < 10; i++){
      targetParts.push(BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 10}));
      targetParts[i].material = chrisMaterial;
      targetParts[i].position = new BABYLON.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
      targetParts[i].rotation = new BABYLON.Vector3(Math.random() * 2*Math.PI, Math.random() * 2*Math.PI, Math.random() * 2*Math.PI);
  
    }

  

  //swordP
  // let grow;
  // let swordP = await BABYLON.SceneLoader.ImportMeshAsync("", "./", "swordP.glb");
  // grow = swordP.animationGroups[0];
  // grow.stop();
  // swordP.meshes[0].setEnabled(false);
  // swordP.meshes[0].showBoundingBox = true;

  


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


  //key event arrow function template from https://doc.babylonjs.com/divingDeeper/scene/interactWithScenes
  scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          if (swordGS.meshes[0].isEnabled()){
            grandSlash.start();
            GSBBox.setEnabled(true);
            BABYLON.Animation.CreateAndStartAnimation("hitboxSlashSize", GSBBox, "scaling", fps, 10, new BABYLON.Vector3(0,0,0), GSBBox.scaling, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            BABYLON.Animation.CreateAndStartAnimation("hitboxSlashPos", GSBBox, "position", fps, 10, swordGS.meshes[0].position, swordGS.meshes[0].position, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
          } else {
            thrust.start();
            TBBox.setEnabled(true);
            BABYLON.Animation.CreateAndStartAnimation("hitboxThrust", TBBox, "position", fps, 10, camera.getFrontPosition(100), camera.getFrontPosition(500), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
          }
          break;
        case BABYLON.PointerEventTypes.POINTERUP:
          // GSBBox.setEnabled(false);
          // TBBox.setEnabled(false);
          break;
      }
    });
  scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case BABYLON.KeyboardEventTypes.KEYDOWN:  
          break;
        case BABYLON.KeyboardEventTypes.KEYUP:
          if (kbInfo.event.key == "1"){
            swordGS.meshes[0].setEnabled(true);
            swordT.meshes[0].setEnabled(false);
          }
          else if (kbInfo.event.key == "2"){
            swordT.meshes[0].setEnabled(true);
            swordGS.meshes[0].setEnabled(false);
          }
          break;
      }
    });


    scene.registerBeforeRender(() => {
      swordGS.meshes[0].setAbsolutePosition(camera.getFrontPosition(100));
      swordT.meshes[0].setAbsolutePosition(camera.getFrontPosition(100));
      swordGS.meshes[0].lookAt(camera.getFrontPosition(200));
      swordT.meshes[0].lookAt(camera.getFrontPosition(200));

      for (let i = 0; i < targetParts.length; i++){
        if ((swordGS.meshes[0].intersectsMesh(targetParts[i], true) || GSBBox.intersectsMesh(targetParts[i], true)) && swordGS.meshes[0].isEnabled()){
          targetParts[i].setEnabled(false);
          go = true;
        }
        if ((swordT.meshes[0].intersectsMesh(targetParts[i], true) || TBBox.intersectsMesh(targetParts[i], true))  && swordT.meshes[0].isEnabled()){
          targetParts[i].setEnabled(false);
          go = true;
        }
      }
      done = true;
      for (let i = 0; i < targetParts.length; i++){
        if (targetParts[i].isEnabled()){
          done = false;
        }
      }
      if (done){
        console.log('DONE');
        window.location.replace("https://www.merriam-webster.com/dictionary/bozo#:~:text=%3A%20a%20foolish%20or%20incompetent%20person");
      }
    });

  return scene;
};


//---------------------------------------------------------------{below this line is basically universal template code from download function of playground}-------------------------------------------------------------------------------

window.initFunction = async function() {
                    
                    
  var asyncEngineCreation = async function() {
      try {
      return createDefaultEngine();
      } catch(e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
      return createDefaultEngine();
      }
  }

  window.engine = await asyncEngineCreation();
if (!engine) throw 'engine should not be null.';
startRenderLoop(engine, canvas);
window.scene = createScene();};
initFunction().then(() => {scene.then(returnedScene => { sceneToRender = returnedScene; });
          
});

// Resize
window.addEventListener("resize", function () {
engine.resize();
});