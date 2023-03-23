/**
 * @file index.ts
 * @brief main file with 99% of the code needed to work
 *        this creates a webxr application that has keyboard & mouse & vr support.
 *        this application provides a classroom theme whereby the user can learn
 *        how to balance a simple chemistry equation. You can combine atoms/molecules.
 */
import {AdvancedDynamicTexture, TextBlock} from 'babylonjs-gui';
import { Engine, MeshBuilder,Scene, Color3,Vector3, UniversalCamera, HemisphericLight, 
    SceneLoader,AbstractMesh,Sound, PhotoDome, TransformNode, Space, AxisDragGizmo, RotationGizmo, ScaleGizmo, WebXRInput, WebXRInputSource, WebXRAbstractMotionController, WebXRControllerComponent, Ray, PickingInfo, WebXRSessionManager, Axis, Texture, StandardMaterial, Mesh, TextureSampler, Effect, ShaderMaterial} from 'babylonjs';
import 'babylonjs-loaders';

//#region Helper Functions
/**
 * @param {number} number - the value in degrees to convert to radians 
 */
function convertDegToRad(number : number) : number
{
    return number * Math.PI / 180;
}

type Gizmos = {
    translationXGizmo: AxisDragGizmo,
    translationYGizmo: AxisDragGizmo,
    translationZGizmo: AxisDragGizmo,
    rotationGizmo: RotationGizmo,
    scalingGizmo: ScaleGizmo
  };
//#endregion

//#region Main setup functions
/**
 * @param {Scene} scene - the scene to create the photodome for 
 * @brief This function creates a photodome using a picture from the assets's textures folder
 */
function createClassRoomPhotoDome(scene : Scene)
{
    const dome = new PhotoDome
    (
        'classroomPhotoDome',
        'assets/textures/360classroom1.jpg',
        {
        },
        scene
    )
    dome.mesh.isPickable=false;
}

/**
 * @param {Scene} scene - the scene to create the camera for
 * @param {HTMLCanvasElement} canvas - the canvas to attach the camera to  
 * @brief Create a universal camera 
 */
function createCamera(scene: Scene,canvas : HTMLCanvasElement)
{
    const camera = new UniversalCamera('uniCamera',new Vector3(0,0,-7),scene);
    camera.attachControl(canvas,true);
}

/**
 * @param {Scene} scene - the scene to create lights in
 * @brief creates just 1 hemisphericlight
 */
function createLights(scene:Scene)
{
    const hemiLight = new HemisphericLight('hemLight',new Vector3(-1,1,0),scene);
    hemiLight.intensity=1;
    hemiLight.diffuse = new Color3(1,1,1);
}

/**
 * @param {Scene} scene - the scene to load all the models in
 * @param {} attachMeshesHint - object storing the created model to be used as hints 
 * @brief Load the H, O, H2, O2, H2O, floor, table models
 */
function loadModels(scene : Scene,attachMeshesHint)
{
    //Floor
    SceneLoader.ImportMeshAsync('','assets/models/','cube.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'floor';
            root.name = 'floor';

            //Move lower & further
            root.position.y = -7.8; 
            root.position.z = 4; 

            //Make bigger
            root.scaling.x = 15;
            root.scaling.y = 1;
            root.scaling.z = 15;
            result.meshes.forEach((mesh)=>{
                mesh.isPickable=true;
                mesh.name ="Floor";
            })
        }
    );

    //Invisible surrounding cube for picking
    SceneLoader.ImportMeshAsync('','assets/models/','cubeInvis.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'cubeInvis';
            root.name = 'cubeInvis';

            //Move lower & further
            root.position.y = -2; 
            root.position.z = 4; 

            //Make bigger
            root.scaling.x = 10.1;
            root.scaling.y = 5;
            root.scaling.z = 15;
            result.meshes.forEach((mesh)=>{
                mesh.isPickable=true;
                mesh.visibility=0;
                mesh.name = "CubeInvis"
            })
        }
    );

    //Table
    SceneLoader.ImportMeshAsync('','assets/models/','hologramtable.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'table';
            root.name = 'table';

            //Move lower & further
            root.position.y = -7; 
            root.position.z = 4; 

            //Make bigger
            root.scaling.x = 3;
            root.scaling.y = 1;
            root.scaling.z = 3;
            result.meshes.forEach((mesh)=>{
                mesh.isPickable=true;
                mesh.name ="Table";
            })
        }
    );

    //Display molecules
    SceneLoader.ImportMeshAsync('','assets/models/','H2.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'firstH2';
            root.name = 'firstH2';
            root.position.x = -3.6;
            root.position.y = -6;
            root.position.z = 18.5;
            result.meshes.forEach((mesh)=>{
                mesh.isPickable=false;
            });
        }
    );

    SceneLoader.ImportMeshAsync('','assets/models/','O2.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'firstO2';
            root.name = 'firstO2';
            root.position.y = -6;
            root.position.z = 18.5;
            result.meshes.forEach((mesh)=>{
                mesh.isPickable=false;
            });
        }
    );

    SceneLoader.ImportMeshAsync('','assets/models/','H2O.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'firstH2O';
            root.name = 'firstH2O';
            root.position.x = 3.5;
            root.position.y = -6;
            root.position.z = 18.5;

            result.meshes.forEach((mesh)=>{
                mesh.isPickable=false;
            });
        }
    );

    //Actually pickable molecules
    SceneLoader.ImportMeshAsync('','assets/models/','H.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'H';
            root.name = 'H';
            root.position.x = -2;
            root.position.y = -6;
            root.position.z = 9;
            root.isPickable=true;
        }
    );

    SceneLoader.ImportMeshAsync('','assets/models/','O.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'O';
            root.name = 'O';
            root.position.x = 2;
            root.position.y = -6;
            root.position.z = 9;
            root.isPickable=true;
        }
    );

    //For attaching hint
    SceneLoader.ImportMeshAsync('','assets/models/','H2.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'H2Hint';
            root.name = 'H2Hint';
            attachMeshesHint.H2 = root;
            result.meshes.forEach((mesh)=>{
                mesh.isPickable=false;
                mesh.isVisible=false;
                mesh.visibility=0.5;
            });
        }
    );

    SceneLoader.ImportMeshAsync('','assets/models/','O2.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'O2Hint';
            root.name = 'O2Hint';
            attachMeshesHint.O2=root;
            result.meshes.forEach((mesh)=>{
                mesh.isPickable=false;
                mesh.isVisible=false;
                mesh.visibility=0.5;
            });
        }
    );

    SceneLoader.ImportMeshAsync('','assets/models/','H2O.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'H2OHintfirst';
            root.name = 'H2OHintfirst';
            attachMeshesHint.H2O=root;
            result.meshes.forEach((mesh)=>{
                mesh.isPickable=false;
                mesh.isVisible=false;
                mesh.visibility=0.5;
            });
        }
    );

    SceneLoader.ImportMeshAsync('','assets/models/','H2O.glb',scene).then(
        result=>{
            const root = result.meshes[0];
            root.id = 'H2OHintsecond';
            root.name = 'H2OHintsecond';
            attachMeshesHint.H2Osecond=root;
            result.meshes.forEach((mesh)=>{
                mesh.isPickable=false;
                mesh.isVisible=false;
                mesh.visibility=0.5;
            });
        }
    );
}

/**
 * @param {} srtMode - object storing the edit mode (scale/translation/rotation) and the text for display
 * @brief Create a bunch of text that displays helpful information to the user, like instructions
 */
function createText(srtMode)
{
    //Create title text
    const titlePlane = MeshBuilder.CreatePlane('Title Plane',{size:15});
    titlePlane.position.z = 18.5;
    titlePlane.isPickable=false;

    const titleTexture = AdvancedDynamicTexture.CreateForMesh(titlePlane);
    const titleText = new TextBlock('TitleText');
    titleText.text = 'Donavern\'s XR Chemistry Playground';
    titleText.color = 'white';
    titleText.fontSize = 50;
    titleText.outlineColor = 'black';
    titleText.outlineWidth = 5;
    titleTexture.addControl(titleText);

    //Sub title text
    const subTitlePlane = MeshBuilder.CreatePlane('SubTitle Plane',{size:15});
    subTitlePlane.position.y = -2;
    subTitlePlane.position.z = 18.5;
    subTitlePlane.isPickable=false;

    const subTitleTexture = AdvancedDynamicTexture.CreateForMesh(subTitlePlane);
    const subTitleText = new TextBlock('SubTitleText');
    subTitleText.text = 'Lesson: \n 2H\u2082 + O\u2082 = 2H\u2082O';
    subTitleText.color = 'white';
    subTitleText.fontSize = 40;
    subTitleText.outlineColor = 'black';
    subTitleText.outlineWidth = 5;
    subTitleTexture.addControl(subTitleText);

    //teleport info
    const teleportInfoPlane = MeshBuilder.CreatePlane('SubTitle Plane',{size:15});
    teleportInfoPlane.position.x = -5;
    teleportInfoPlane.position.y = -2;
    teleportInfoPlane.position.z = 18.5;
    teleportInfoPlane.isPickable=false;

    const teleportInfoTexture = AdvancedDynamicTexture.CreateForMesh(teleportInfoPlane);
    const teleportInfoText = new TextBlock('teleportInfoText');
    teleportInfoText.text = 'To Teleport:\nHold Left\nMouse Button/Trigger';
    teleportInfoText.color = 'white';
    teleportInfoText.fontSize = 30;
    teleportInfoText.outlineColor = 'black';
    teleportInfoText.outlineWidth = 5;
    teleportInfoTexture.addControl(teleportInfoText);

    //Turn right text
    const leftPlane = MeshBuilder.CreatePlane('Left Plane',{size:15});
    leftPlane.position.x = -10;
    leftPlane.position.z = -5;
    leftPlane.rotation = new Vector3(0,Math.PI*-0.5,0);
    leftPlane.isPickable=false;

    const leftTexture = AdvancedDynamicTexture.CreateForMesh(leftPlane);
    const leftText = new TextBlock('LeftText');
    leftText.text = 'Look Right';
    leftText.color = 'white';
    leftText.fontSize = 50;
    leftText.outlineColor = 'black';
    leftText.outlineWidth = 5;
    leftTexture.addControl(leftText);

    //turn left text
    const rightPlane = MeshBuilder.CreatePlane('Right Plane',{size:15});
    rightPlane.position.x = 10;
    rightPlane.position.z = -5;
    rightPlane.rotation = new Vector3(0,Math.PI*0.5,0);
    rightPlane.isPickable=false;

    const rightTexture = AdvancedDynamicTexture.CreateForMesh(rightPlane);
    const rightText = new TextBlock('RightText');
    rightText.text = 'Look Left';
    rightText.color = 'white';
    rightText.fontSize = 50;
    rightText.outlineColor = 'black';
    rightText.outlineWidth = 5;
    rightTexture.addControl(rightText);

    //Turn behind
    const backPlane = MeshBuilder.CreatePlane('Back Plane',{size:15});
    backPlane.position.z = -10;
    backPlane.rotation = new Vector3(0,Math.PI * 1,0);
    backPlane.isPickable=false;

    const backTexture = AdvancedDynamicTexture.CreateForMesh(backPlane);
    const backText = new TextBlock('BackText');
    backText.text = 'Look Behind';
    backText.color = 'white';
    backText.fontSize = 50;
    backText.outlineColor = 'black';
    backText.outlineWidth = 5;
    backTexture.addControl(backText);

    //Static molecules display test
    const displayTextPlane = MeshBuilder.CreatePlane('Display Plane',{size:15});
    displayTextPlane.position.y = -4;
    displayTextPlane.position.z = 18.5;
    displayTextPlane.isPickable=false;

    const displayTexture = AdvancedDynamicTexture.CreateForMesh(displayTextPlane);
    const displayText = new TextBlock('displayText');
    displayText.text = 'Static Display Example';
    displayText.color = 'white';
    displayText.fontSize = 30;
    displayText.outlineColor = 'black';
    displayText.outlineWidth = 5;
    displayTexture.addControl(displayText);

    //H2
    const H2TitlePlane = MeshBuilder.CreatePlane('H2 Title Plane',{size:15});
    H2TitlePlane.position.x = -3.5;
    H2TitlePlane.position.y = -5;
    H2TitlePlane.position.z = 18.5;
    H2TitlePlane.isPickable=false;

    const H2TitleTexture = AdvancedDynamicTexture.CreateForMesh(H2TitlePlane);
    const H2TitleText = new TextBlock('H2TitleText');
    H2TitleText.text = 'H\u2082';
    H2TitleText.color = 'white';
    H2TitleText.fontSize = 35;
    H2TitleText.outlineColor = 'black';
    H2TitleText.outlineWidth = 5;
    H2TitleTexture.addControl(H2TitleText);

    //O2
    const O2TitlePlane = MeshBuilder.CreatePlane('O2 Title Plane',{size:15});
    O2TitlePlane.position.x = 0;
    O2TitlePlane.position.y = -5;
    O2TitlePlane.position.z = 18.5;
    O2TitlePlane.isPickable=false;

    const O2TitleTexture = AdvancedDynamicTexture.CreateForMesh(O2TitlePlane);
    const O2TitleText = new TextBlock('O2TitleText');
    O2TitleText.text = 'O\u2082';
    O2TitleText.color = 'red';
    O2TitleText.fontSize = 35;
    O2TitleText.outlineColor = 'black';
    O2TitleText.outlineWidth = 5;
    O2TitleTexture.addControl(O2TitleText);

    //H2O
    const H2OTitlePlane = MeshBuilder.CreatePlane('H2O Title Plane',{size:15});
    H2OTitlePlane.position.x = 3.5;
    H2OTitlePlane.position.y = -5;
    H2OTitlePlane.position.z = 18.5;
    H2OTitlePlane.isPickable=false;

    const H2OTitleTexture = AdvancedDynamicTexture.CreateForMesh(H2OTitlePlane);
    const H2OTitleText = new TextBlock('H2OTitleText');
    H2OTitleText.text = 'H\u2082O';
    H2OTitleText.color = 'white';
    H2OTitleText.fontSize = 35;
    H2OTitleText.outlineColor = 'black';
    H2OTitleText.outlineWidth = 5;
    H2OTitleTexture.addControl(H2OTitleText);

    //Instruction
    const instructionPlane = MeshBuilder.CreatePlane('Instruction Plane',{size:15});
    instructionPlane.position.y = -4.5;
    instructionPlane.position.z = 9;
    instructionPlane.isPickable=false;

    const instructionTexture = AdvancedDynamicTexture.CreateForMesh(instructionPlane);
    const instructionText = new TextBlock('InstructionText');
    instructionText.text = 'Make yours here!';
    instructionText.color = 'white';
    instructionText.fontSize = 35;
    instructionText.outlineColor = 'black';
    instructionText.outlineWidth = 5;
    instructionTexture.addControl(instructionText);

    const subInstructionPlane = MeshBuilder.CreatePlane('subInstruction Plane',{size:15});
    subInstructionPlane.position.y = -5;
    subInstructionPlane.position.z = 9;
    subInstructionPlane.isPickable=false;

    const subInstructionTexture = AdvancedDynamicTexture.CreateForMesh(subInstructionPlane);
    const subInstructionText = new TextBlock('subInstructionText');
    subInstructionText.text = 'Left Click/Trigger to spawn, then take it away';
    subInstructionText.color = 'white';
    subInstructionText.fontSize = 15;
    subInstructionText.outlineColor = 'black';
    subInstructionText.outlineWidth = 5;
    subInstructionTexture.addControl(subInstructionText);

    //H
    const HTitlePlane = MeshBuilder.CreatePlane('H Title Plane',{size:15});
    HTitlePlane.position.x = -2;
    HTitlePlane.position.y = -5.5;
    HTitlePlane.position.z = 9;
    HTitlePlane.isPickable=false;

    const HTitleTexture = AdvancedDynamicTexture.CreateForMesh(HTitlePlane);
    const HTitleText = new TextBlock('HTitleText');
    HTitleText.text = 'H';
    HTitleText.color = 'white';
    HTitleText.fontSize = 25;
    HTitleText.outlineColor = 'black';
    HTitleText.outlineWidth = 5;
    HTitleTexture.addControl(HTitleText);

    //O
    const OTitlePlane = MeshBuilder.CreatePlane('O Title Plane',{size:15});
    OTitlePlane.position.x = 2;
    OTitlePlane.position.y = -5.5;
    OTitlePlane.position.z = 9;
    OTitlePlane.isPickable=false;

    const OitleTexture = AdvancedDynamicTexture.CreateForMesh(OTitlePlane);
    const OTitleText = new TextBlock('OTitleText');
    OTitleText.text = 'O';
    OTitleText.color = 'red';
    OTitleText.fontSize = 25;
    OTitleText.outlineColor = 'black';
    OTitleText.outlineWidth = 5;
    OitleTexture.addControl(OTitleText);

    //Sub title text for scale/rotate/translation mode text display
    const srtModePlane = MeshBuilder.CreatePlane('SRT Mode Plane',{size:15});
    srtModePlane.position.x = 5;
    srtModePlane.position.y = -2;
    srtModePlane.position.z = 18.5;
    srtModePlane.isPickable=false;

    const srtModeTexture = AdvancedDynamicTexture.CreateForMesh(srtModePlane);
    srtMode.text = new TextBlock('srtModeText');
    srtMode.text.text = 'Current Mode:\nTranslate';
    srtMode.text.color = 'white';
    srtMode.text.fontSize = 30;
    srtMode.text.outlineColor = 'black';
    srtMode.text.outlineWidth = 5;
    srtModeTexture.addControl(srtMode.text);
}

/**
 * @param {Scene} scene - scene to load sounds in
 * @param {} SFX - to store the sound to be used back in the main function
 * @brief load a bunch of sounds used either as background ambience or sound effects
 */
function addSound(scene : Scene,SFX)
{
    const welcomeVoice = new Sound('welcomeVoice','assets/sounds/WelcomeXR.mp3',scene,()=>{welcomeVoice.play()},{loop:false,autoplay:true});
    const classroomBG = new Sound('classroomBG','assets/sounds/ClassroomBG.mp3',scene,()=>{classroomBG.play()},{loop:true});
    SFX.boop = new Sound('boopSFX','assets/sounds/Boop.mp3',scene,null,{loop:false});
    SFX.teleporting = new Sound('teleportingSFX','assets/sounds/Teleporting.mp3',scene,null,{loop:false});
    SFX.teleported = new Sound('teleportedSFX','assets/sounds/Teleported.mp3',scene,null,{loop:false});
}

/**
 * @param {Scene} scene - scene to create event listeners in
 * @param {} mouseDeltaY - object storing the mouse scroll wheel direction
 * @param {} rotateDelta - object storing which x/y/z should be rotated based on key presses
 * @param {} srtMode  - object storing the edit mode (scale/translation/rotation) and the text for display
 * @brief register a bunch of keypresses or mouse scrolling as actions, like rotation controls, scaling
 */
function addWindowEventListeners(scene : Scene, engine,mouseDeltaY,rotateDelta,srtMode)
{
    window.addEventListener('resize',()=>
    {
        engine.resize();
    });

    window.addEventListener('keydown',event=>
    {
        if(event.ctrlKey && event.key === 'i')
        {
            if(scene.debugLayer.isVisible())
            {
                scene.debugLayer.hide();
            }
            else
            {
                scene.debugLayer.show();
            }
        }

        //For rotation
        if(event.key ==='w')
        {
            rotateDelta.wValue = 3;
        }
        if(event.key ==='s')
        {
            rotateDelta.wValue = -3;
        }

        if(event.key ==='a')
        {
            rotateDelta.aValue = 3;
        }
        if(event.key ==='d')
        {
            rotateDelta.aValue = -3;
        }

        if(event.key ==='q')
        {
            rotateDelta.qValue = 3;
        }
        if(event.key ==='e')
        {
            rotateDelta.qValue = -3;
        }

        //For changing srt mode
        if(event.key==='t')
        {
            if(srtMode.value == 2)
            {
                srtMode.value = 0;
            }
            else
            {
                srtMode.value++;
            }
        }
    });
    
    window.addEventListener('wheel', event => {
        mouseDeltaY.value = event.deltaY; //>0 is down, <0 is up
    });
}

/**
 * @param {number} number - value of the srtMode to decide which text should be display 
 * @brief calculate the text to display for the user to know the current mode (scale/rotation/translation)
 */
function updateModeText(number : number) : string
{
    if(number===0)
        return "Current Mode:\nTranslate\n(Mouse&Wheel)";
    else if(number === 1)
        return "Current Mode:\nRotate\n(WASD & QE)";
    else if(number === 2)
        return "Current Mode:\nScale\n(Wheel)";
}

/**
 * @param {PickingInfo} pickResult - store results of first mesh picked
 * @param {Scene} scene - scene to use
 * @param {} selectedMesh - object storing the mesh that is currently picked / being held
 * @param {} teleportInfo - object storing location to teleport to, if user is holding right click, timer before teleporting, teleport threshold 
 * @brief function called when a mouse is clicked or a controller trigger is pressed, to decide if an object should be picked or start teleporting
 */
function pointerDownGivenPickingInfo(pickResult : PickingInfo, scene : Scene, selectedMesh,teleportInfo)
{
    if (pickResult?.hit && pickResult?.pickedMesh) 
    {
        //If user wants to get a new H atom
        if(pickResult.pickedMesh.name === "H" && pickResult.pickedMesh.parent instanceof TransformNode)
        {
            SceneLoader.ImportMeshAsync('','assets/models/','H.glb',scene).then(
                result=>{
                    const meshToCameraDir = pickResult.pickedPoint.subtract(scene.activeCamera.position).normalize();
                    const root = result.meshes[0];
                    root.id = 'Hinstance';
                    root.name = 'Hinstance';
                    root.position = pickResult.pickedPoint.subtract(meshToCameraDir);
                    root.isPickable=true;

                    result.meshes.forEach(mesh=>{
                        mesh.id = "Hinstance";
                        mesh.name = "Hinstance";
                    });
                }
            );
        }
        //if user wants to get a new O atom
        else if(pickResult.pickedMesh.name === "O")
        {
            SceneLoader.ImportMeshAsync('','assets/models/','O.glb',scene).then(
                result=>{
                    const meshToCameraDir = pickResult.pickedPoint.subtract(scene.activeCamera.position).normalize();
                    const root = result.meshes[0];
                    root.id = 'Oinstance';
                    root.name = 'Oinstance';
                    root.position = pickResult.pickedPoint.subtract(meshToCameraDir);
                    root.isPickable=true;

                    result.meshes.forEach(mesh=>{
                        mesh.id = "Oinstance";
                        mesh.name = "Oinstance";
                    });
                }
            );
        }
        //Pick anything else but floor, table and invis cube
        else if(pickResult.pickedMesh.name !== "Floor" &&pickResult.pickedMesh.name !== "Table" && pickResult.pickedMesh.name !== "CubeInvis")
        {
            selectedMesh.mesh = pickResult.pickedMesh;
            scene.activeCamera.detachControl();
        }

        //Did not pick up anything
        if(selectedMesh.mesh === null && (pickResult.pickedMesh.name === "Floor" || pickResult.pickedMesh.name === "Table"))
        {
            //Using this to increment timer before user can teleport
            teleportInfo.rightClickHeld=true;
        }
    }
}

/**
 * @param {PickingInfo} pickResult - store results of first mesh picked
 * @param {PickingInfo[]} pickResultMultiple - store results of all meshes picked
 * @param {Scene} scene - scene to use
 * @param {} selectedMesh - object storing the mesh that is currently picked / being held
 * @param {} teleportInfo - object storing location to teleport to, if user is holding right click, timer before teleporting, teleport threshold 
 * @param {} attachMeshesHint - object storing the meshes used as hint when combining
 * @brief function called when mouse moves, or constantly in VR mode. To update teleport position. To decide if hint should be showed for atom/molecule combination
 */
function pointerMoveGivenPickingInfo(pickResult : PickingInfo, pickResultMultiple : PickingInfo[],scene : Scene,selectedMesh,teleportInfo,attachMeshesHint)
{
    if (pickResult.hit && pickResult.pickedMesh) 
    {
        //As long as the pointer is moving, find latest position to teleport to
        if(pickResult.pickedMesh.name ==="Floor" || pickResult.pickedMesh.name ==="Table")
        {
            teleportInfo.lastSavedPickedPosition = pickResult.pickedPoint;
        }
        
        if(selectedMesh.mesh)
        {
            //Only allow user to move objects within the invisible cube or on the table
            if((pickResult.pickedMesh.name ==="CubeInvis" || pickResult.pickedMesh.name === "Table") && selectedMesh.mesh.parent)
            {
                //Transform x,y,z
                //Update the position of the selected mesh
                if (selectedMesh.mesh.parent instanceof TransformNode) 
                {
                    selectedMesh.mesh.parent.position.copyFrom(pickResult.pickedPoint);

                    if(pickResult.pickedMesh.name === "Table")
                        selectedMesh.mesh.parent.position.y += 0.5;
                }
            }
            //Check if user trying to combine H atoms to form H2 molecule
            else if(pickResult.pickedMesh.name ==="Hinstance" && selectedMesh.mesh.name === "Hinstance" && pickResult.pickedMesh !== selectedMesh.mesh)//collide with other molecules
            {
                if (attachMeshesHint.H2 !== null) 
                {
                    const temp = attachMeshesHint.H2 as AbstractMesh;
                    temp.position = pickResult.pickedPoint;

                    temp.getChildren().forEach((mesh)=>{
                        const temp2 = mesh as AbstractMesh;
                        temp2.isVisible=true;
                    });
                }
            }
            //Check if user trying to combine O atoms to form O2 molecule
            else if(pickResult.pickedMesh.name ==="Oinstance" && selectedMesh.mesh.name === "Oinstance" && pickResult.pickedMesh !== selectedMesh.mesh)//collide with other molecules
            {
                if (attachMeshesHint.O2 !== null) 
                {
                    const temp = attachMeshesHint.O2 as AbstractMesh;
                    temp.position = pickResult.pickedPoint;

                    temp.getChildren().forEach((mesh)=>{
                        const temp2 = mesh as AbstractMesh;
                        temp2.isVisible=true;
                    });
                }
            }
        }
    }
    
    //As long as I am holding a H2 or O2
    if(selectedMesh.mesh && (selectedMesh.mesh.name === "H2instance" || selectedMesh.mesh.name ==="O2instance"))
    {
        let firstH2Mesh : AbstractMesh = null;
        let secondH2Mesh: AbstractMesh = null;
        let O2Mesh : AbstractMesh = null;
        
        //Make sure 2 H2 and 1 O2 molecules are together
        pickResultMultiple.forEach(info=>{
            if(info.pickedMesh.name=="H2instance")
            {
                if(firstH2Mesh===null)
                {
                    firstH2Mesh = info.pickedMesh;
                }
                else if(secondH2Mesh === null)
                {
                    secondH2Mesh = info.pickedMesh;
                }
            }
            else if(info.pickedMesh.name=="O2instance")
            {
                if(O2Mesh === null)
                {
                    O2Mesh = info.pickedMesh;
                }
            }
        });

        if(firstH2Mesh && secondH2Mesh && O2Mesh && selectedMesh.mesh.parent instanceof TransformNode)
        {
            //Spawn in the hint that shows it can bond
            if (attachMeshesHint.H2O && attachMeshesHint.H2Osecond) 
            {
                const temp = attachMeshesHint.H2O as AbstractMesh;
                temp.position = selectedMesh.mesh.parent.position;

                temp.getChildren().forEach((mesh)=>{
                    const temp2 = mesh as AbstractMesh;
                    temp2.isVisible=true;
                });

                const temp3 = attachMeshesHint.H2Osecond as AbstractMesh;
                const meshToCameraDir = selectedMesh.mesh.parent.position.subtract(scene.activeCamera.position).normalize();
                temp3.position = selectedMesh.mesh.parent.position.subtract(meshToCameraDir);

                temp3.getChildren().forEach((mesh)=>{
                    const temp2 = mesh as AbstractMesh;
                    temp2.isVisible=true;
                });
            }
        }
    }
}

/**
 * @param {PickingInfo} pickResult - store results of first mesh picked
 * @param {PickingInfo[]} pickResultMultiple - store results of all meshes picked
 * @param {Scene} scene - scene to use
 * @param {} selectedMesh - object storing the mesh that is currently picked / being held
 * @param {} attachMeshesHint - object storing the meshes used as hint when combining
 * @param {string} canvasID - string name of the canvas
 * @param {} teleportInfo - object storing location to teleport to, if user is holding right click, timer before teleporting, teleport threshold 
 * @param {} SFX - to store the sound to be used back in the main function
 * @brief function called when mouse releases the left click or when vr controller trigger is released. To decide if atom/molecule should bond, to release object.
 */
function pointerUpGivenPickingInfo(pickResult : PickingInfo,pickResultMultiple : PickingInfo[],scene : Scene,selectedMesh,attachMeshesHint,canvasID : string,teleportInfo,SFX)
{
    if(selectedMesh.mesh)
    {
        //Check if user is trying to combine H atoms, if so, spawn in H2 molecule and destroy the 2 atom meshes
        if(pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.name ==="Hinstance" && selectedMesh.mesh.name === "Hinstance" && pickResult.pickedMesh !== selectedMesh.mesh)//collide with other molecules
        {
            SceneLoader.ImportMeshAsync('','assets/models/','H2.glb',scene).then(
                result=>{
                    const root = result.meshes[0];
                    root.id = 'H2instance';
                    root.name = 'H2instance';
                    root.position = pickResult.pickedPoint;
                    root.scaling = new Vector3(1.0,1.0,1.0);
                    root.isPickable=true;

                    result.meshes.forEach(mesh=>{
                        mesh.id = "H2instance";
                        mesh.name = "H2instance";
                    });
                }
            );

            pickResult.pickedMesh.dispose();
            selectedMesh.mesh.dispose();

            if(SFX.boop instanceof Sound)
                SFX.boop.play();
        }
        //Check if user is trying to combine O atoms, if so, spawn in O2 molecule and destroy the 2 atom meshes
        else if(pickResult.hit && pickResult.pickedMesh && pickResult.pickedMesh.name ==="Oinstance" && selectedMesh.mesh.name === "Oinstance" && pickResult.pickedMesh !== selectedMesh.mesh)//collide with other molecules
        {
            SceneLoader.ImportMeshAsync('','assets/models/','O2.glb',scene).then(
                result=>{
                    const root = result.meshes[0];
                    root.id = 'O2instance';
                    root.name = 'O2instance';
                    root.position = pickResult.pickedPoint;
                    root.scaling = new Vector3(1.0,1.0,1.0);
                    root.isPickable=true;

                    result.meshes.forEach(mesh=>{
                        mesh.id = "O2instance";
                        mesh.name = "O2instance";
                    });
                }
            );

            pickResult.pickedMesh.dispose();
            selectedMesh.mesh.dispose();

            if(SFX.boop instanceof Sound)
                SFX.boop.play();
        }
        //As long as I am holding a H2 or O2 molecule
        else if(selectedMesh.mesh.name === "H2instance" || selectedMesh.mesh.name ==="O2instance")
        {
            let firstH2Mesh : AbstractMesh = null;
            let secondH2Mesh: AbstractMesh = null;
            let O2Mesh : AbstractMesh = null;

            //Check that I have enough to bond into 2H2O
            pickResultMultiple.forEach(info=>{
                if(info.pickedMesh.name=="H2instance")
                {
                    if(firstH2Mesh===null)
                    {
                        firstH2Mesh = info.pickedMesh;
                    }
                    else if(secondH2Mesh === null)
                    {
                        secondH2Mesh = info.pickedMesh;
                    }
                }
                else if(info.pickedMesh.name=="O2instance")
                {
                    if(O2Mesh === null)
                    {
                        O2Mesh = info.pickedMesh;
                    }
                }
            });

            if(firstH2Mesh && secondH2Mesh && O2Mesh)
            {
                if (attachMeshesHint.H2O && attachMeshesHint.H2Osecond) 
                {
                    SceneLoader.ImportMeshAsync('','assets/models/','H2O.glb',scene).then(
                        result=>{
                            const root = result.meshes[0];
                            root.id = 'H2Oinstancefirst';
                            root.name = 'H2Oinstancefirst';
                            root.position = pickResult.pickedPoint;
                            result.meshes.forEach((mesh)=>{
                                mesh.isPickable=true;
                            });
                        }
                    );

                    SceneLoader.ImportMeshAsync('','assets/models/','H2O.glb',scene).then(
                        result=>{
                            const meshToCameraDir = pickResult.pickedPoint.subtract(scene.activeCamera.position).normalize();
                            const root = result.meshes[0];
                            root.id = 'H2Oinstancesecond';
                            root.name = 'H2Oinstancesecond';
                            root.position = pickResult.pickedPoint.subtract(meshToCameraDir);
                            result.meshes.forEach((mesh)=>{
                                mesh.isPickable=true;
                            });
                        }
                    );
                    firstH2Mesh.dispose();
                    secondH2Mesh.dispose();
                    O2Mesh.dispose();

                    if(SFX.boop instanceof Sound)
                        SFX.boop.play();
                        SFX.boop.play();
                }
            }
        }

        //As long as the hint meshes exist, disable it since no longer picking anything
        if (attachMeshesHint.H2 !== null) 
        {
            const temp = attachMeshesHint.H2 as AbstractMesh;
            temp.getChildren().forEach((mesh)=>{
                const temp2 = mesh as AbstractMesh;
                temp2.isVisible=false;
            });
        }
        if (attachMeshesHint.O2 !== null) 
        {
            const temp = attachMeshesHint.O2 as AbstractMesh;
            temp.getChildren().forEach((mesh)=>{
                const temp2 = mesh as AbstractMesh;
                temp2.isVisible=false;
            });
        }
        if (attachMeshesHint.H2O !== null) 
        {
            const temp = attachMeshesHint.H2O as AbstractMesh;
            temp.getChildren().forEach((mesh)=>{
                const temp2 = mesh as AbstractMesh;
                temp2.isVisible=false;
            });
        }
        if (attachMeshesHint.H2Osecond !== null) 
        {
            const temp = attachMeshesHint.H2Osecond as AbstractMesh;
            temp.getChildren().forEach((mesh)=>{
                const temp2 = mesh as AbstractMesh;
                temp2.isVisible=false;
            });
        }

        selectedMesh.mesh = null;
    }
    
    teleportInfo.rightClickHeld = false;
    scene.activeCamera.attachControl(<HTMLCanvasElement>document.getElementById(canvasID),true);
}

/**
 * @param {} selectedMesh - object storing the mesh that is currently picked / being held
 * @param {} mouseDeltaY - object storing the mouse scroll wheel direction
 * @param {} srtMode  - object storing the edit mode (scale/translation/rotation) and the text for display
 * @param {Gizmos} gizmos - a defined  type at the top of this file, contains the xyz translation, rotation, scaling gizmo
 * @param {} rotateDelta - object storing which x/y/z should be rotated based on key presses
 * @param {Scene} scene - scene to use
 * @brief updates the translation, rotation, scaling  gizmos' position and if they should be displayed
 */
function updateGizmo(selectedMesh, mouseDeltaY, srtMode,gizmos : Gizmos,rotateDelta,scene : Scene)
{
    if(selectedMesh.mesh && selectedMesh.mesh instanceof AbstractMesh && selectedMesh.mesh.parent instanceof TransformNode)
    {   
        const scrollFactor = mouseDeltaY.value/100.0;
        
        if(gizmos.translationXGizmo instanceof AxisDragGizmo)
        {
            gizmos.translationXGizmo.isEnabled = false;
            gizmos.translationYGizmo.isEnabled = false;
            gizmos.translationZGizmo.isEnabled = false;
            gizmos.rotationGizmo.scaleRatio = 0;
            gizmos.scalingGizmo.scaleRatio = 0;
        }


        //Depending on the mode, create the appropriate gizmos
        if(srtMode.value == 0)
        {
            gizmos.translationXGizmo.attachedMesh = selectedMesh.mesh;
            gizmos.translationYGizmo.attachedMesh = selectedMesh.mesh;
            gizmos.translationZGizmo.attachedMesh = selectedMesh.mesh;

            if(scrollFactor)
            {
                const meshToCameraDir = selectedMesh.mesh.parent.position.subtract(scene.activeCamera.position).normalize();

                selectedMesh.mesh.parent.position.x += meshToCameraDir.x * scrollFactor;
                selectedMesh.mesh.parent.position.y += meshToCameraDir.y * scrollFactor;
                selectedMesh.mesh.parent.position.z += meshToCameraDir.z * scrollFactor;
            }
            
            gizmos.translationXGizmo.isEnabled = true;
            gizmos.translationYGizmo.isEnabled = true;
            gizmos.translationZGizmo.isEnabled = true;
        }
        //If in rotate mode, as long as any of the rotational keys are pressed
        else if(srtMode.value == 1 )
        {
            gizmos.rotationGizmo.attachedMesh=selectedMesh.mesh;

            if(rotateDelta.wValue || rotateDelta.aValue || rotateDelta.qValue)
            {
                selectedMesh.mesh.parent.rotate(new Vector3(1, 0, 0),convertDegToRad(rotateDelta.wValue),Space.WORLD);
                selectedMesh.mesh.parent.rotate(new Vector3(0, 1, 0),convertDegToRad(rotateDelta.aValue),Space.WORLD);
                selectedMesh.mesh.parent.rotate(new Vector3(0, 0, 1),convertDegToRad(rotateDelta.qValue),Space.WORLD);
            }
            gizmos.rotationGizmo.scaleRatio = 1;
        }
        else if(srtMode.value == 2)
        {
            gizmos.scalingGizmo.attachedMesh=selectedMesh.mesh;
        
            if(scrollFactor)
            {
                selectedMesh.mesh.parent.scaling.scaleInPlace(scrollFactor >= 1? 1.1 : 0.9);
            }
            gizmos.scalingGizmo.scaleRatio=1;
        }
    }
    else
    {
        gizmos.translationXGizmo.isEnabled = false;
        gizmos.translationYGizmo.isEnabled = false;
        gizmos.translationZGizmo.isEnabled = false;
        gizmos.rotationGizmo.scaleRatio = 0;
        gizmos.scalingGizmo.scaleRatio = 0;
    }
}

/**
 * @param {Scene} scene - scene to use
 * @param {} teleportInfo - object storing location to teleport to, if user is holding right click, timer before teleporting, teleport threshold 
 * @param {number} deltaTime - to increment the teleport counter
 * @brief Decides if the user should teleport after incrementing the timer, checking if it hit the threshold time for teleporting
 */
function updateTeleportTimer(scene : Scene,teleportInfo,deltaTime : number,shader, SFX)
{
    if(teleportInfo.rightClickHeld)
    {
        SFX.teleporting.isPlaying ? null: SFX.teleporting.play();

        teleportInfo.timer+=deltaTime;
        
        teleportInfo.circlePlane.position.x = teleportInfo.lastSavedPickedPosition.x;
        teleportInfo.circlePlane.position.y = teleportInfo.lastSavedPickedPosition.y + 0.01;
        teleportInfo.circlePlane.position.z = teleportInfo.lastSavedPickedPosition.z;

        teleportInfo.circlePlane.isVisible=true;

        if(teleportInfo.timer >= teleportInfo.threshold)
        {
            teleportInfo.timer = 0;
            scene.activeCamera.position.x = teleportInfo.lastSavedPickedPosition.x;
            scene.activeCamera.position.z = teleportInfo.lastSavedPickedPosition.z;
            SFX.teleporting.stop();
            SFX.teleported.play();
        }
    }
    else
    {
        teleportInfo.timer = 0;
        teleportInfo.circlePlane.isVisible=false;
        SFX.teleporting.stop();
    }
    
    let value = teleportInfo.timer/teleportInfo.threshold;
    if(value<0.0)
    {
        value = 0.0;
    }
    else if(value >1.0)
    {
        value = 1.0;
    }
    shader.shader.setFloat("progress",value);
}

/**
 * @param {} mouseDeltaY - object storing the mouse scroll wheel direction
 * @param {} rotateDelta - object storing which x/y/z should be rotated based on key presses
 * @brief Resets the rotation value that was changed by keypress, also the mouse scroll
 */
function resetVariablesForNextFrame(mouseDeltaY,rotateDelta)
{
    rotateDelta.wValue = 0;
    rotateDelta.aValue = 0;
    rotateDelta.qValue = 0;
    mouseDeltaY.value=0;
}

/**
 * @param {Scene} scene - scene to load into
 * @param {} shader - object to store the teleporting bar
 * @param {} teleportInfo - object storing location to teleport to, if user is holding right click, timer before teleporting, teleport threshold 
 * @brief load textures that shows user the teleport location, teleporting progress bar
 */
function loadTextures(scene : Scene, shader, teleportInfo)
{
    const fill = new Texture("assets/textures/progressbarFill.png", scene);
    const fillMaterial = new StandardMaterial("fillMaterial",scene);
    fillMaterial.diffuseTexture = fill;

    const fillPlane = MeshBuilder.CreatePlane("fillPlane", { size: 1 });
    fillPlane.isPickable = false;
    fillPlane.alwaysSelectAsActiveMesh = true;

    Effect.ShadersStore["customVertexShader"] =
    "\r\n" +
    "precision highp float;\r\n" +
    "// Attributes\r\n" +
    "attribute vec3 position;\r\n" +
    "attribute vec2 uv;\r\n" +
    "// Varying\r\n" +
    "varying vec2 vUV;\r\n" +
    "void main(void) {\r\n" +
    "    gl_Position = vec4((position.x/4.0),(position.y)/14.0 - 0.1,0.0, 1.0);\r\n" +
    "    vUV = uv;\r\n" +
    "}\r\n";
  
    Effect.ShadersStore["customFragmentShader"] = 
    "\r\n" + 
    "precision highp float;\r\n" + 
    "varying vec2 vUV;\r\n" + 
    "uniform sampler2D textureSampler;\r\n" + 
    "uniform float progress;\r\n"+
    "void main(void) {\r\n" + 
    "if(vUV.x >= progress-0.01) {\r\n"+
    "    discard;\r\n"+
    "}\r\n"+
    "else{\r\n" +
    "    gl_FragColor = texture2D(textureSampler, vUV);\r\n" +
     "}}\r\n";

    shader.shader = new ShaderMaterial(
        "shader",
        scene,
        {
          vertex: "custom",
          fragment: "custom",
        },
        {
          attributes: ["position", "normal", "uv"],
          uniforms: ["world", "worldView", "worldViewProjection", "view", "projection","progress"],
        },
      );
    shader.shader.setFloat("progress",0.0);
    shader.shader.setTexture("textureSampler",fill);
    fillPlane.material = shader.shader;

    const circle = new Texture("assets/textures/circle.png", scene);
    circle.hasAlpha = true;

    const circleMaterial = new StandardMaterial("circleMaterial",scene);
    circleMaterial.diffuseTexture = circle;

    teleportInfo.circlePlane = MeshBuilder.CreatePlane("circlePlane", { size: 1 });
    teleportInfo.circlePlane.rotation = new Vector3(convertDegToRad(90.0),0.0,0.0);
    teleportInfo.circlePlane.isPickable = false;
    teleportInfo.circlePlane.material=circleMaterial;
    teleportInfo.circlePlane.isVisible=false;
}
//#endregion

/**
 * @param {string} canvasID - name of the canvas
 * @param {[dataType:string]:{[key:string]:any}} authoringData - not used
 * @brief VR application developed using typescript and babylonjs, tested with WebXR browser extension emulator
    Chemistry lesson in a classroom theme environment that teaches users how to balance a simple equation
    You can spawn H & O atoms, combine them to form molecules, combine the correct atoms/molecules to form H2, O2 and H2O
    A hint will be displayed if the atoms/molecules can be combined
    A circle will appear at where the user is intending to teleport to
    There is ambient classroom sounds as well as sound for successful combination
    User can use either the keyboard & mouse or the oculus quest vr controllers. (Need to have 2 controllers)
 */
export function createXRScene(canvasID : string, authoringData:{[dataType:string]:{[key:string]:any}})
{
    //#region Main setup for web
    const engine = new Engine(<HTMLCanvasElement>document.getElementById(canvasID),true);
    const scene = new Scene(engine);

    let selectedMesh  = {mesh: AbstractMesh};
    let mouseDeltaY = {value:0};
    let rotateDelta = {wValue:0,aValue:0,qValue:0};
    let srtMode = {value: 0,text : TextBlock};
    let teleportInfo = {rightClickHeld:false,timer:0,threshold:2,lastSavedPickedPosition:new Vector3(0,0,0),circlePlane : AbstractMesh};
    let gizmos = {translationXGizmo : new AxisDragGizmo(new Vector3(1,0,0),Color3.Red()),
        translationYGizmo: new AxisDragGizmo(new Vector3(0,1,0),Color3.Green()), translationZGizmo: new AxisDragGizmo(new Vector3(0,0,1),Color3.Blue()),
    rotationGizmo:new RotationGizmo(),scalingGizmo : new ScaleGizmo()};
    let attachMeshesHint = {H2:null,O2:null,H2O:null,H2Osecond:null};
    let SFX = {boop: Sound, teleporting: Sound, teleported:Sound};
    let shader = {shader:ShaderMaterial};

    createClassRoomPhotoDome(scene);
    createCamera(scene,<HTMLCanvasElement>document.getElementById(canvasID));
    createLights(scene);
    createText(srtMode);
    loadModels(scene,attachMeshesHint);
    loadTextures(scene,shader,teleportInfo);
    addSound(scene,SFX);
    addWindowEventListeners(scene,engine,mouseDeltaY,rotateDelta,srtMode);
    //#endregion
    
    //#region Main setup for VR controller
    let firstController : WebXRInputSource = null;
    let secondController : WebXRInputSource = null;
    let firstTrigger : WebXRControllerComponent = null;
    let secondTrigger : WebXRControllerComponent = null;
    let secondControllerThumbStick : WebXRControllerComponent = null;
    let firstTriggerStatus : number = 0; //0 nothing, 1 - triggered, 2 - held, 3 - released
    let secondTriggerStatus : number = 0; //0 nothing, 1 - triggered, 2 - held, 3 - released
    let secondControllerThumbStickStatus : number =0; //0 nothing, 1 - triggered
    let sessionManager :WebXRSessionManager= null;

    const xr = scene.createDefaultXRExperienceAsync({
        uiOptions:{
            sessionMode:'immersive-vr'
        }
    }).then((result)=>{
        sessionManager = result.baseExperience.sessionManager;

        const WebXRInput = result.input;
        WebXRInput.onControllerAddedObservable.add((newXRController)=>{
            newXRController.onMotionControllerInitObservable.add((newMotionController)=>{
                //Left controller always first, right controller always second
                if (newMotionController.handness === 'left') 
                {
                    firstController = newXRController;
                    firstTrigger = newMotionController.getMainComponent();

                    firstTrigger?.onButtonStateChangedObservable.add((event)=>{
                        if(event.changes.pressed)
                        {
                            //Triggered
                            if(firstTriggerStatus === 0 && event.changes.pressed.current)
                            {
                                firstTriggerStatus = 1;
                            }
                            //Just released
                            else if(firstTriggerStatus === 2 && event.changes.pressed.current === false)
                            {
                                firstTriggerStatus = 3;
                            }
                        }
                    });
                } 
                else if (newMotionController.handness === 'right') 
                {
                    secondController = newXRController;
                    secondTrigger = newMotionController.getMainComponent();

                    secondTrigger?.onButtonStateChangedObservable.add((event)=>{
                        if(event.changes.pressed)
                        {
                            //Triggered
                            if(secondTriggerStatus === 0 && event.changes.pressed.current)
                            {
                                secondTriggerStatus = 1;
                            }
                            //Just released
                            else if(secondTriggerStatus === 2 && event.changes.pressed.current === false)
                            {
                                secondTriggerStatus = 3;
                            }
                        }
                    });

                    secondControllerThumbStick = newMotionController.getComponent("xr-standard-thumbstick");
                    secondControllerThumbStick?.onButtonStateChangedObservable.add((event)=>{
                        if(event.changes.pressed)
                        {
                            if(secondControllerThumbStickStatus === 0 && event.changes.pressed.current)
                            {
                                secondControllerThumbStickStatus = 1;
                            }
                        }
                    });
                }
            })
        });
    });
    //#endregion
    
    //#region Main loop
    let lastTime = performance.now();
    engine.runRenderLoop(()=>{
        //Delta time
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 1000; // convert to seconds
        lastTime = currentTime;

        srtMode.text instanceof TextBlock? srtMode.text.text = updateModeText(srtMode.value) : null;

        //#region Input handling mouse & keyboard
        if(sessionManager?.sessionMode !== "immersive-vr")
        {
            scene.onPointerDown = function(event){
                if(event.pointerType !== "xr" && event.button === 0) //Left mouse button
                {   
                    const pickResult = scene.pick(scene.pointerX, scene.pointerY);
                    pointerDownGivenPickingInfo(pickResult,scene,selectedMesh,teleportInfo);
                }
            };

            scene.onPointerMove = function(event){
                if(event.pointerType !== "xr")
                {
                    //Update position to teleport to using floor only
                    const pickResult = scene.pick(scene.pointerX, scene.pointerY);
                    const pickResultMultiple = scene.multiPick(scene.pointerX,scene.pointerY);
                    pointerMoveGivenPickingInfo(pickResult,pickResultMultiple,scene,selectedMesh,teleportInfo,attachMeshesHint);
                }
            };

            scene.onPointerUp = function(event){
                if(event.pointerType !== "xr" && event.button === 0) //Left mouse button
                {
                    const pickResult = scene.pick(scene.pointerX, scene.pointerY);
                    const pickResultMultiple = scene.multiPick(scene.pointerX, scene.pointerY);
                    pointerUpGivenPickingInfo(pickResult,pickResultMultiple,scene,selectedMesh,attachMeshesHint,canvasID,teleportInfo,SFX);
                }
            };
        }
        //#endregion

        //#region Input handling VR controller
        if(firstController && secondController)
        {
            let pickResult : PickingInfo = null;
            let pickResultMultiple: PickingInfo[] = null;
            const firstTriggerRay = new Ray(firstController.pointer.getAbsolutePosition(),firstController.pointer.forward,100000);
            
            //LEFT CONTROLLER - for almost everything
            if(firstTriggerStatus === 1) //onPointerDown
            {
                pickResult = scene.pickWithRay(firstTriggerRay);

                pointerDownGivenPickingInfo(pickResult,scene,selectedMesh,teleportInfo);

                firstTriggerStatus = 2;
            }
            else if(firstTriggerStatus===2) //Held
            {
                pickResult = scene.pickWithRay(firstTriggerRay);
                pickResultMultiple = scene.multiPickWithRay(firstTriggerRay);

                pointerMoveGivenPickingInfo(pickResult,pickResultMultiple,scene,selectedMesh,teleportInfo,attachMeshesHint);
            }
            else if(firstTriggerStatus===3) //on pointer up
            {
                pickResult = scene.pickWithRay(firstTriggerRay);
                pickResultMultiple = scene.multiPickWithRay(firstTriggerRay);

                pointerUpGivenPickingInfo(pickResult,pickResultMultiple,scene,selectedMesh,attachMeshesHint,canvasID,teleportInfo,SFX);

                firstTriggerStatus=0;
            }

            //RIGHT CONTROLLER - Just to interact with gizmos
            if(secondTriggerStatus === 1) //onPointerDown
            {
                secondTriggerStatus = 2;
            }
            else if(secondTriggerStatus===2) //Held
            {
            }
            else if(secondTriggerStatus===3) //on pointer up
            {
                secondTriggerStatus=0;
            }

            if(secondControllerThumbStickStatus) //Triggered
            {
                if(srtMode.value === 2)
                {
                    srtMode.value = 0;
                }
                else
                {
                    srtMode.value++;
                }
                secondControllerThumbStickStatus = 0;
            }
        }
        //#endregion

        //#region Updates (Gizmo, teleport timer, render, resetting variables)
        updateGizmo(selectedMesh,mouseDeltaY,srtMode,gizmos,rotateDelta,scene);
        updateTeleportTimer(scene,teleportInfo,deltaTime,shader,SFX);

        scene.render();

        resetVariablesForNextFrame(mouseDeltaY,rotateDelta);
        //#endregion
    });
    //#endregion
}

//For testing
createXRScene('renderCanvas',null);