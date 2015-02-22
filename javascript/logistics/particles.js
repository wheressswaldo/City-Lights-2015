/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// particles.js creates a particle system for each firework

// BASICALLY complete
// To-do:
//      Add comments: Done
//      Efficiency validation/runtime analysis: Not Done

// constructor
var Particles = function(gl, type, force, color, amount) {
    // setup
    this.gl = gl;
    this.buffers = {
	velocity: gl.createBuffer()
    };
    this.color = color;
    this.build(type, force, amount);
};

// prototype function to empty the buffers
Particles.prototype.destroy = function() {
    for (var p in this.buffers) {
	this.gl.deleteBuffer(this.buffers[p]);
    }
    this.buffers = {};
};

// prototype function to create particles according to type
Particles.prototype.build = function(type, force, amount) {
    var gl = this.gl;
    var buffers = this.buffers;
    // set count according to sphere
    //this.count = Math.round((type == "sphere" ? 1000 : 200) * (amount || 1));
    //console.log(amount);
    if (amount > 10 && amount <50){
        this.count = 150; 
    }
    if (amount > 50 && amount < 100){
        this.count = 350;
    }
    if (amount > 100){
        this.count = 900;
    }
    
    if (type === "circle"){
        this.count = Math.round(this.count * 0.65);
    }
    
    var tmp3 = vec3.create();
    var tmp2 = vec2.create();
    var velocity = [];
	
    // random vels
    for (var i=0; i < this.count; i++) {
    	var diff = 1 + (Math.random()-0.5)*0.05;
	if (type === "sphere") {
            vec3.random(tmp3, force + diff);
	}
        else {
            vec2.random(tmp2, force + diff);
            vec2.copy(tmp3, tmp2);
            tmp3[2] = 0;
	}
	velocity.push(tmp3[0], tmp3[1], tmp3[2]);
    }
    
    // bind buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(velocity), gl.STATIC_DRAW);
};

// draw the particles
Particles.prototype.render = function(program) {
    var gl = this.gl;
    var a = program.attributes;
    var u = program.uniforms;
    var buffers = this.buffers;

    gl.uniform3fv(u.uColor, this.color);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.velocity);
    gl.vertexAttribPointer(a.aVelocity, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, this.count);
};

