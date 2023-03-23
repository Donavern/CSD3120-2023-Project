# CSD3120 2023 IPA 1
 
Name: Sanford Donavern Ang Rui Xian

SiT ID: 2001635

DigiPen ID: s.ruixian
#
IPA-B Info:

1. Information on the application itself
- VR application developed using typescript and babylonjs, tested with WebXR browser extension emulator
- Chemistry lesson in a classroom themed environment that teaches users how to balance a simple equation
- You can spawn H & O atoms, combine them to form molecules, combine the correct atoms/molecules to form H2, O2 and H2O
- A hint will be displayed if the atoms/molecules can be combined
- A circle will appear at where the user is intending to teleport to
- There are many sounds and effects as feedback.
- User can use either the keyboard & mouse or the oculus quest vr controllers. (Need to have 2 controllers)
<br></br> 

2. Mouse & Keyboard controls
- Left Click (Select/Grab objects) (Hold for teleport)
- Q/E (z-axis rotation)
- W/S (x-axis rotation)
- A/D (y-axis rotation)
- T (Toggle Scale/Translation/Rotation Mode)
- Scroll wheel (Scale object)
<br></br>

3. Oculus Quest controls (Important to have 2 working controllers)
- Left Controller Trigger (Select/Grab Objects) (Hold for teleport)
- Right Controller Trigger (Interact with Gizmos)
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
     - Lastly, hold left click on the floor to teleport

 - For Oculus Quest Controller:
     - Use LEFT trigger on the H and O atoms to spawn more instances
     - Spawn a total of 4 H atoms and 2 O atoms
     - Combine 1 H atom to another (Resulting in 2 H2 molecules)
     - Combine 1 O atom to another (Resulting in 1 O2 molecule)
     - In any order, move the 3 molecules such that they overlap each other to combine them.
     - Toggle the scale/translation/rotation mode with RIGHT controller's thumbstick
     - Hold 1 of the H2O molecule with LEFT trigger
     - Use RIGHT trigger to interact with the gizmos for rotation & scaling
     - Lastly, hold LEFT trigger on the floor to teleport
<br></br>

 5. Extra
  - More details can be found in the comments in the code. Function-level comments are provided.
#
IPA-A Info:
XR Experience using babylonjs and XRAuthor

1. Have a stable version of JS and NPM installed

2. get node_modules, an run the command 

   ```npm install```

3. Uncomment the last line in "index.ts"

   ```//createXRScene('renderCanvas',null);```

4. Run webpack to build and run the application

   ```npm run build```
  
   ```npm run serve```


5. Open ```http://localhost:3000/``` on browser

6. Alternatively, you can just call my function "createXRScene" in your own code file somewhere else.


Code Snippet: You will need the index.ts file located within "hello-xr\src". 
You can then use "import {createXRScene} from './index'", do note the the './index', depending on where you put this file at relative to your main.js, can be different. 
Afterwards, you can call the function using "createXRScene('renderCanvas',null);".

Link: 
https://youtu.be/4zZ8FJPciN4 (Link to the outputted video lesson I made using XRAuthor)

video file is within xrauthor-uploads/assets/videos

direct link: https://github.com/Donavern/CSD3120-2023-IPA-1/blob/main/xrauthor-uploads/assets/videos/0.webm
