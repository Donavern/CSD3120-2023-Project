# CSD3120 2023 Team 12 Project📑

# 👨‍🎓

Names (SiT ID) (DigiPen ID): 

- Sanford Donavern Ang Rui Xian (2001635) (s.ruixian)

- Shaun Keck (2000795) (shaun.keck)

- Fu Shao Wei (2000666) (shaowei.fu)

- Loh Yong Zheng (2000975) (yongzheng.loh)

- Tan Wei Han Reuven (2001846) (t.weihanreuven)

- Lim Yi Shan Jonathan (2001521) (yishanjonathan.lim)

# 📒

Wiki: https://github.com/Donavern/CSD3120-2023-Project/wiki

User Evaluation Report: https://github.com/Donavern/CSD3120-2023-Project/wiki/%F0%9F%93%96User-Evaluation-Report

Project Application Information: https://github.com/Donavern/CSD3120-2023-Project/wiki/%F0%9F%96%A5Project-Application-Information

How to build & execute the project by itself: https://github.com/Donavern/CSD3120-2023-Project/wiki/%F0%9F%94%A7How-to-build-&-execute-the-project-by-itself

Directory Tree: https://github.com/Donavern/CSD3120-2023-Project/wiki/%F0%9F%8C%B2Directory-Tree

The sections below contain information that can also be found in the wiki links
#
Team 12 Project Info

1. Information on the application itself 🤔
   - VR application developed using typescript and babylonjs, tested with WebXR browser extension emulator
   - Chemistry lesson in a classroom themed environment that teaches users how to balance a simple equation
   - You can spawn H & O atoms, combine them to form molecules, combine the correct atoms/molecules to form H2, O2 and H2O
   - A hint will be displayed if the atoms/molecules can be combined (Move valid atoms/molecules together to combine)
   - There will be objectives to follow
   - You can walk with W/A/S/D
   - A circle will appear at where the user is intending to teleport to
   - There are many sounds and effects as feedback.
   - User can use either the keyboard & mouse or the oculus quest vr controllers. (Need to have 2 controllers, left & right)
<br></br> 

2. Mouse & Keyboard controls 🖱⌨
   - Left Click (Select/Grab objects) (Hold for teleport)
   - Q/E (z-axis rotation)
   - W/S (x-axis rotation)
   - A/D (y-axis rotation)
   - T (Toggle Scale/Translation/Rotation Mode)
   - Scroll wheel (Scale object)
   - W/A/S/D (Movement keys)
<br></br>

3. Oculus Quest controls (Important to have 2 working controllers) 🕹
   - Left Controller Trigger (Select/Grab Objects) (Hold for teleport)
   - Right Controller Trigger (Interact with Gizmos, left trigger needs to be held down)
   - Right Controller Thumbstick (Toggle Scale/Translation/Rotation Mode)
<br></br>

4. How I expect my app to be assessed

   Externally, the professor should call my createXRScene function with correct parameters like createXRScene('renderCanvas',null);
 - For mouse & keyboard: 
     - Click on the H and O atoms to spawn more instances
     - Spawn a total of 4 H atoms and 2 O atoms
     - Combine 1 H atom to another (Resulting in 2 H2 molecules)
     - Combine 1 O atom to another (Resulting in 1 O2 molecule)
     - In any order, move the 3 molecules such that they overlap each other to combine them.
     - Toggle the scale/translation/rotation mode with T
     - Select 1 of the H2O molecule, use the mentioned keyboard controls for rotation and scaling
     - Lastly, hold left click on the floor to teleport & use W/A/S/D to walk

 - For Oculus Quest Controller:
     - Use LEFT trigger on the H and O atoms to spawn more instances
     - Spawn a total of 4 H atoms and 2 O atoms
     - Combine 1 H atom to another (Resulting in 2 H2 molecules)
     - Combine 1 O atom to another (Resulting in 1 O2 molecule)
     - In any order, move the 3 molecules such that they overlap each other to combine them.
     - Toggle the scale/translation/rotation mode with RIGHT controller's thumbstick
     - Hold 1 of the H2O molecule with LEFT trigger
     - Use RIGHT trigger to interact with the gizmos for rotation & scaling
     - Lastly, hold LEFT trigger on the floor to teleport & use W/A/S/D to walk
<br></br>

 5. Extra
     - User Testing, Virtual Reality Sickness Questionnaire results: https://github.com/Donavern/CSD3120-2023-Project/issues/5
     - More details can be found in the comments in the code. Function-level comments are provided.
#
XR Experience using babylonjs and XRAuthor 🔧

1. Have a stable version of JS and NPM installed 

2. get node_modules, run the command 

   ```npm install```

3. Uncomment the last line in "index.ts" (if it is commented)

   ```//createXRScene('renderCanvas',null);```

4. Run webpack to build and run the application

   ```npm run build```
  
   ```npm run serve```


5. Open ```http://localhost:3000/``` on browser

6. Alternatively, you can just call my function "createXRScene" in your own code file somewhere else.


Code Snippet: You will need the index.ts file located within "hello-xr\src". 
You can then use "import {createXRScene} from './index'", do note the the './index', depending on where you put this file at relative to your main.js, can be different. 
Afterwards, you can call the function using "createXRScene('renderCanvas',null);".
#
Directory Tree 🌲

```
.
├── README.md
├── hello-xr (The folder for this team project)
│   ├── README.md
│   ├── dist 
│   │   ├── assets
│   │   │   ├── models
│   │   │   │   ├── H.glb
│   │   │   │   ├── H2.glb
│   │   │   │   ├── H2O.glb
│   │   │   │   ├── O.glb
│   │   │   │   ├── O2.glb
│   │   │   │   └── school.glb
│   │   │   ├── sounds
│   │   │   │   ├── Boop.mp3
│   │   │   │   ├── ClassroomBG.mp3
│   │   │   │   ├── Ding.mp3
│   │   │   │   ├── FootstepBackwards.mp3
│   │   │   │   ├── FootstepForwards.mp3
│   │   │   │   ├── Teleported.mp3
│   │   │   │   └── Teleporting.mp3
│   │   │   └── textures
│   │   │       ├── 360classroom1.jpg
│   │   │       ├── circle.png
│   │   │       ├── progressbarBar.png
│   │   │       ├── progressbarFill.png
│   │   │       └── table.jpg
│   │   ├── index.html
│   │   └── index.js
│   ├── index.html
│   ├── package-lock.json (Information about the packages used)
│   ├── package.json (Information on the dependencies used)
│   ├── postcss.config.js
│   ├── public
│   │   └── assets
│   │       ├── models (The models that will loaded into the scene that the user will interact with)
│   │       │   ├── H.glb
│   │       │   ├── H2.glb
│   │       │   ├── H2O.glb
│   │       │   ├── O.glb
│   │       │   ├── O2.glb
│   │       │   └── school.glb
│   │       ├── sounds (Used as feedback for when user perform actions like walking and more)
│   │       │   ├── Boop.mp3
│   │       │   ├── ClassroomBG.mp3
│   │       │   ├── Ding.mp3
│   │       │   ├── FootstepBackwards.mp3
│   │       │   ├── FootstepForwards.mp3
│   │       │   ├── Teleported.mp3
│   │       │   └── Teleporting.mp3
│   │       └── textures (Used for photodome, creating a more immersive environment) 
│   │           ├── 360classroom1.jpg
│   │           ├── circle.png
│   │           ├── progressbarBar.png
│   │           ├── progressbarFill.png
│   │           └── table.jpg

│   ├── src
│   │   ├── app.d.ts (Declare the Application class to be used elsewhere) 
│   │   ├── app.ts
│   │   ├── index.d.ts (Declare the createXRScene function to be used elsewhere)
│   │   ├── index.html
│   │   ├── index.js
│   │   └── index.ts (Contains all the main code for the application, interaction etc)
│   ├── tsconfig.json
│   └── webpack.config.js
└── xrauthor-uploads
    ├── assets
    │   ├── editorSessions
    │   │   └── 0.json
    │   ├── meta
    │   │   └── meta.json
    │   ├── models
    │   │   ├── H2.glb
    │   │   ├── H2O.glb
    │   │   └── O2.glb
    │   ├── recordingData
    │   │   └── 0.json
    │   └── videos
    │       └── 0.webm
    ├── extensions
    ├── glTF-models
    │   ├── H2.glb
    │   ├── H2O.glb
    │   └── O2.glb
    └── run command in powershell.txt

21 directories, 71 files
```
