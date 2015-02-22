/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// background.js handles all the background operations
// almost everything in here is SHAMEFULLY hardcoded

// BASICALLY complete
// To-do:
//      Add comments - Done
//      Efficiency validation/runtime analysis - Not done

// constructor
var Background = function(gl) {
    this.gl = gl;
    this.load();
    this.texCoordBuffer = gl.createBuffer();
    this.rectBuffer = gl.createBuffer();
    this.texture = gl.createTexture();
};

// prototype function to load an image
Background.prototype.load = function() {
    this.image = new Image();
    this.image.src = "images/city.png";
};

// prototype function to draw the background
Background.prototype.render = function(program, canvas) {
    // setup
    var gl = this.gl;
    var a = program.attributes;
    var u = program.uniforms;
       
    var positionLocation = a.aPosition;
    var texCoordLocation = a.aTexCoord;
 
    // provide texture coordinates for the rectangle.
    // var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Create a texture.
    //var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        
    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
    // lookup uniforms
    var resolutionLocation = u.uResolution;

    // set the resolution
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

    // Create a buffer for the position of the rectangle corners.
    //var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set a rectangle the same size as the image.
    var x1 = 0;
    var x2 = x1 + this.image.width;
    var y1 = (canvas.height - this.image.height);
    var y2 = y1 + this.image.height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2]), gl.STATIC_DRAW);

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    
};
