/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// camera.js makes a simple camera system to add depth to fireworks
// 2D is boring, even though webGL is a primarily 2D system

// BASICALLY complete
// To-do:
//      Add comments: Done
//      Efficiency validation/runtime analysis: Not Done

// constructor
var Camera = function(options) {
    // camera options, make this into a interactable javascript object later?
    this.options = {
        // defaults
	fov: 45 * Math.PI/180,
	aspect: 1,
	near: 0.1,
	far: 3000
    }
    // set up two matrices for perspective and view
    this.pMatrix = mat4.create();
    this.vMatrix = mat4.create();
    
    // configure options given
    this.configure(options);
}

// protype function to configure the options
Camera.prototype.configure = function(options) {
    // simple for loop replacement
    for (var p in options) { 
        this.options[p] = options[p]; 
    }
    // set perspective
    mat4.perspective(this.pMatrix, this.options.fov, this.options.aspect, this.options.near, this.options.far);
}

// prototype function to look at (change) camera view
Camera.prototype.lookAt = function(eye, center, up) {
    // simple mat4 function using givens
    mat4.lookAt(this.vMatrix, eye, center, up);
}

// change where you're looking FROM, aka where the camera is, so the camera can be simply rotated
Camera.prototype.lookFrom = function(eye, rotX, rotY, rotZ) {
    // set a translation according to scale
    var translation = vec3.scale(vec3.create(), eye, -1);
        
    // identity matrix for setup
    mat4.identity(this.vMatrix);
        
    // apply x y z rotations
    mat4.rotateX(this.vMatrix, this.vMatrix, rotX);
    mat4.rotateY(this.vMatrix, this.vMatrix, rotY);
    mat4.rotateZ(this.vMatrix, this.vMatrix, rotZ);
        
    // apply translation
    mat4.translate(this.vMatrix, this.vMatrix, translation);
}

// helper function to sync camera when the window is resized
Camera.prototype.syncPort = function(node) {
    // set up according to node
    this.configure({aspect: node.width/node.height});
    return this;
}

