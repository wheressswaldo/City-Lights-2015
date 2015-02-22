/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// particles.js is used to handle the shaders and obtain their information

// constructor
Program.Particles = function(gl) {
    // get the shader files
    var vs = this._get("shaders/particles.vertex.glsl");
    var fs = this._get("shaders/particles.fragment.glsl");
    
    // obtain the attributes from the shaders
    var attributes = ["aVelocity"];
    var uniforms = ["uModelView", "uProjection", "uStartTime", "uCurrentTime", "uLifetime", "uGravity", "uColor"];
	
    // call the program
    Program.call(this, gl, {
        vs: vs,
	fs: fs,
	attributes: attributes,
	uniforms: uniforms
    });	
};
    
// create an object
Program.Particles.prototype = Object.create(Program.prototype);

// create a request to open the glsl file, deprecated?
Program.Particles.prototype._get = function(url) {
	var xhr = new XMLHttpRequest();
	xhr.open("get", url + "?" + Math.random(), false);
	xhr.send();
	return xhr.responseText;
};
