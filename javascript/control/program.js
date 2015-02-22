/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// program.js is mainly used to control the shaders, this allows the shaders to be able to be easily separated
// shaders and shader helpers are in the shaders folder

// BASICALLY complete
// To-do:
//      Add comments - Done
//      Efficiency validation/runtime analysis - Not done

// constructor
var Program = function(gl, helper){
    // setup
    this.gl = gl;
    this.attributes = {};
    this.uniforms = {};
    
    // grab shaders from the helper
    var vs = (helper.vs ? this.shaderFromString(gl.VERTEX_SHADER, helper.vs) : this.shaderFromId(helper.vsId));
    var fs = (helper.fs ? this.shaderFromString(gl.FRAGMENT_SHADER, helper.fs) : this.shaderFromId(helper.fsId));
    
    // start a program and attach the shaders to memory
    this.program = gl.createProgram();
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);

    // throw an error if you couldn't link the shaders
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
	throw new Error("Something went wrong with linking... do you have shaders?");
    }

    // delete used shaders afterwards to free up memory
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    // get attributes from shader and put into this.attributes
    (helper.attributes || []).forEach(function(name) {
        this.attributes[name] = gl.getAttribLocation(this.program, name);
    }, this);

    // get uniforms from shader and put into this.uniforms
    (helper.uniforms || []).forEach(function(name) {
    this.uniforms[name] = gl.getUniformLocation(this.program, name);
        }, this);
};

// prototype function to get shader info from string
Program.prototype.shaderFromString = function(type, str) {
    // set local gl for ease of use
    var gl = this.gl;
        
    // create shader and compile
    var shader = gl.createShader(type);
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
        
    // throw error if you couldn't compile the shader, as well as an info log
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	throw new Error("Couldn't compile shader: " + gl.getShaderInfoLog(shader));
    }
        
    // give back the shader if everything went properly
    return shader;
};

// protype function to get shader info from shader id
Program.prototype.shaderFromId = function(id) {
    // get the node from ID given
    var node = document.querySelector("#" + id);
        
    // throw error if ID was incorrect for some reason or you couldn't find the shader
    if (!node) { 
        throw new Error("Can't find shader for ID '"+id+"'");
    }
        
    // set local gl for ease of use
    var gl = this.gl;

    // setup
    var src = "";
    var child = node.firstChild;

    // while theres a child to the node, check if its text, and add it to the empty string
    // repeat until you run out of children
    while (child) {
	if (child.nodeType === child.TEXT_NODE) { src += child.textContent; }
	child = child.nextSibling;
    }

    // somewhat hardcoding...
    // check if the shader is a fragment shader
    if (node.type === "x-shader/x-fragment") {
	var type = gl.FRAGMENT_SHADER;
    } 
    // check if the shader is a vertex shader
    else if (node.type === "x-shader/x-vertex") {
	var type = gl.VERTEX_SHADER;
    } 
    // this shouldn't happen... but throw an error if you managed to pass in ?garbage?
    else {
	throw new Error("Unknown shader type '" + node.type +"'");
    }

    // grab shader from string if everything went well
    return this._shaderFromString(type, src);
};

// use the program and get vertex attributes
Program.prototype.use = function() {
    this.gl.useProgram(this.program);

    for (var p in this.attributes) { 
        this.gl.enableVertexAttribArray(this.attributes[p]);
    }
};