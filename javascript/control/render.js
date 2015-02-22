/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// render.js controls EVERYTHING about drawing to the screen

// BASICALLY complete
// To-do:
//      Add comments - Done
//      Efficiency validation/runtime analysis - Not done

var Render = {
    // setup
    scene: [],
    gl: null,
    background: null,
    special: false,
    node: null,
    programs: {},
    gravity: vec3.fromValues(0, -1e-7, 0),
    eye: vec3.create(),
    center: vec3.create(),
    up: vec3.fromValues(0, 1, 0),

    // two simple event handlers to load and resize
    handleEvent: function(e) { 
	switch (e.type) {
            case "load":
                this.init();
            break;
			
            case "resize":
                this.sync();
            break;
            
            case "click":
                special = !special;
                this.background.special = !this.background.special;
                this.background.change();
                
                if (document.querySelector("#tracker").value === 0){
                    document.querySelector("#tracker").value = 1;
                    document.querySelector("#song").style.color = "black";
                    document.body.style.backgroundColor = "black";
                }
                else{
                    document.querySelector("#tracker").value = 0;
                    document.querySelector("#song").style.color = "white";
                    document.body.style.backgroundColor = "white";
                }
            break;
	}
    },
    
    // function for initializing
    init: function() {
        // create a canvas
        this.node = document.createElement("canvas");
	var o = {
            alpha: false
	};
	
        // start new gl
        this.gl = this.node.getContext("webgl", o) || this.node.getContext("experimental-webgl", o);
	// catching error
        if (!this.gl) {
            alert("You don't seem to support WebGL. What are you using, Internet Explorer 6?");
            return;
        }

        // add node to the body of the html
	document.body.appendChild(this.node);
	var gl = this.gl;

        // start new background and particle programs
        this.programs.background = new Program.background(gl);
	this.programs.fireworks = new Program.Particles(gl);
	
        // setup camera
        this.camera = new Camera();
        // setup new background
        this.background = new Background(gl);
        // set value
        this.special = false;
        document.querySelector("#tracker").value = 0;

        // check for resize
	window.addEventListener("resize", this);
        document.querySelector("#special").addEventListener("click", this);
	
        // synchronize
        this.sync();
	
	this.update = this.update.bind(this);
	this.update();
    },

    // syncs window resizing
    sync: function() {
        // adjust viewport according to width and height
        var w = this.node.parentNode.offsetWidth;
	var h = this.node.parentNode.offsetHeight;
	this.node.width = w;
	this.node.height = h;
	this.camera.syncPort(this.node);
	this.gl.viewport(0, 0, w, h);
	if (w !== this.gl.drawingBufferWidth || h !== this.gl.drawingBufferHeight) {
            alert("Your WebGL implementation seems to be having troubles with its drawing buffer size."); 
	}
    },

    // draws everything on the screen
    render: function() {
        // setup
    	var gl = this.gl;
	var now = Date.now();
	
        // magic taken from a tutorial
        var t = now / 3e4;
	var R = 20;
	this.eye[0] = R*Math.cos(t);
	this.eye[2] = R*Math.sin(t);
	this.camera.lookAt(this.eye, this.center, this.up);
        
        // clear color
        if (!special){
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
        }
        else{
            gl.clearColor(1.0, 1.0, 1.0, 1.0);
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
              
        // enable blending
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        // setup fireworks
        var program = this.programs.fireworks;
	program.use();
	var u = program.uniforms;

	gl.uniformMatrix4fv(u.uProjection, false, this.camera.pMatrix);
	gl.uniform3fv(u.uGravity, this.gravity);
	gl.uniform1i(u.uCurrentTime, now);
	
        // draw fireworks
	this.scene = this.scene.filter(function(item) {
            return item.render(program, now, this.camera.vMatrix);
	}, this);
                
        gl.disable(gl.BLEND);
        
        // setup background
	var program2 = this.programs.background; 
        program2.use();
        
        // draw background on top of fireworks
	this.background.render(this.programs.background, this.node);
        
    },

    update: function() {
        requestAnimationFrame(this.update);
	this.render();
    }

};

window.addEventListener("load", Render);
