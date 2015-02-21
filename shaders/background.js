/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// background.js is used to handle the shaders and obtain their information

// constructor
Program.background = function(gl) {
    // get the shader files
    var vs = this.get("shaders/background.vertex.glsl");
    var fs = this.get("shaders/background.fragment.glsl");

    // obtain the attributes from the shaders
    var attributes = ["aPosition", "aTexCoord"];
    var uniforms = ["uResolution", "vTexCoord"];

    // call the program
    Program.call(this, gl, {
	vs: vs,
	fs: fs,
	attributes: attributes,
	uniforms: uniforms
    });	
}
// create an object
Program.background.prototype = Object.create(Program.prototype);

// create a request to open the glsl file, deprecated?
Program.background.prototype.get = function(url) { 
    var xhr = new XMLHttpRequest();
    xhr.open("get", url + "?" + Math.random(), false);
    xhr.send();
    return xhr.responseText;
}
