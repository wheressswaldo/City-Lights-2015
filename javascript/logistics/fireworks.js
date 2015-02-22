/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// fireworks.js controls the fireworks logic and rendering
// not as badly hardcoded as the background but still pretty hardcoded

// BASICALLY complete
// To-do:
//      Add comments: Done
//      Efficiency validation/runtime analysis: Not Done

// constructor
var Fireworks = function(gl, force, delta) {
    // setup
    this.gl = gl;
    this.ts = Date.now();

    // set force
    force = force || 0.5;
    force = 0.1 + force + 0.3*Math.random();
    
    // set lifetime according to delta
    if (delta > 10 && delta <30){
        this.lifetime = 600;
    }
    if (delta > 30 && delta <50){
        this.lifetime = 800;
    }
    if (delta > 50 && delta < 70){
        this.lifetime = 1000;
    }
    if (delta > 70 && delta <100){
        this.lifetime = 1200;
    }
    if (delta > 100){
        this.lifetime = 1750;
    }
    // set position
    this.position = mat4.create();
    
    // location
    var center = vec3.create();
    center[0] = 20 * (Math.random()-0.5);
    // slight adjustment to y so it doesn't spawn on a building (still does sometimes....)
    center[1] = 10 * (Math.random()-0.2);
    center[2] = 15 * (Math.random()-0.5);

    mat4.translate(this.position, this.position, center);
    mat4.rotateX(this.position, this.position, Math.random()*Math.PI);
    mat4.rotateY(this.position, this.position, Math.random()*Math.PI);
	
    this.particleSystems = [];
    
    // random shape generation
    var r = Math.random();
    switch (true) {
	case (r > 0.7):
            this.buildSet("sphere", force, delta);
            this.buildSet("sphere", force, delta);
	break;

	case (r > 0.4):
            this.buildSet("sphere", force, delta);
        break;

        case (r > 0.35):
            this.buildSet("circle", force, delta*0.5);
            this.buildSet("circle", force, delta*0.5);
	break;

	case (r > 0.3):
            this.buildSet("circle", force, delta);
	break;

	case (r > 0.2):
            this.buildSet("circle", force*0.7, delta*0.5);
            this.buildSet("circle", force*1.2, delta*0.5);
	break;

	case (r > 0.1):
            this.buildSet("circle", force*0.7, delta*0.3);
            this.buildSet("circle", force*1, delta*0.3);
            this.buildSet("circle", force*1.3, delta*0.3);
	break;

        case (r > 0.05):
            this.buildSet("sphere", force*0.7, delta);
            this.buildSet("circle", force*1, delta*0.5);
            this.buildSet("circle", force*1.3, delta*0.5);
	break;

	default:
            this.buildSet("sphere", force*0.7, delta);
            this.buildSet("circle", force*1.2, delta);
	break;
    }
};

// builds a particle system
Fireworks.prototype.buildSet = function(type, force, amount) {
    var color = vec3.create();
    var r = Math.random();
    
    // choose between blue, red, or green; default should never happen
    switch (true) {
	case (r > 0.7):
            color[0] = 1.0;
            color[1] = 0.0;
            color[2] = 0.0;
	break;
		
	case (r > 0.4):
            color[0] = 0.0;
            color[1] = 1.0;
            color[2] = 0.0;
	break;
		
	case (r > 0):
            color[0] = 0.0;
            color[1] = 0.0;
            color[2] = 1.0;
	break;

	default:
            color[0] = 1.0;
            color[1] = 1.0;
            color[2] = 1.0;
	break;
    }
    // push to the list of systems
    this.particleSystems.push(new Particles(this.gl, type, force, color, amount));
};

// draw the firework particles
Fireworks.prototype.render = function(program, now, vMatrix) {
    // use time for age
    var age = now - this.ts;
    // if its over a certain lifetime, destroy the particles (you don`t want thousands of invisible particles to populate the screen)
    if (age > this.lifetime) { 
        this.particleSystems.forEach(function(ps) {
            ps.destroy();
        });
	return false;
    }
    
    // setup
    var gl = this.gl;
    var a = program.attributes;
    var u = program.uniforms;
    
    // set modelview matrix
    var modelView = mat4.multiply(mat4.create(), vMatrix, this.position);

    gl.uniform1i(u.uStartTime, this.ts);
    gl.uniform1f(u.uLifetime, this.lifetime);
    gl.uniformMatrix4fv(u.uModelView, false, modelView);

    // render each particle
    this.particleSystems.forEach(function(ps) {
    	ps.render(program);
    });
    
    return true;
};
