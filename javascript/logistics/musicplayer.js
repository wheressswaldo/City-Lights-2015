/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// musicplayer.js handles anything related to the music, playing/pausing, skipping songs, uploading your own song etc
// it also contains event listeners for the buttons setup in HTML

// BASICALLY complete
// To-do:
//      Add comments: Done
//      Efficiency validation/runtime analysis: Not Done

// constructor
var MusicPlayer = {
    // initializing
    ctx: null,
    // using Audio() for now, but very "bad" since its deprecated, look into using AudioContext() afterwards
    audio: new Audio(),
    paused: false,
    currentVolume: 0.5,
    data: null,
    analyser: null,
    last: {
	ts: 0,
	value: 0
    },
    decay: 300,
    playlistIndex: -1,
    
    // default playlist setup
    playlist: [
	{name:"Taylor Swift &ndash; Blank Space", file:"1.mp3"},
	{name:"Sam Smith &ndash; Lay Me Down", file:"2.mp3"},
	{name:"Mark Ronson &ndash; Uptown Funk", file:"3.mp3"},
	{name:"Beyonce &ndash; Halo", file:"4.mp3"},
	{name:"Caravan Palace &ndash; Rock It For Me", file:"5.ogg"},
        {name:"Jay-Z &ndash; Empire State of Mind", file:"6.mp3"},
    ],
    
    // event handlers for when a buttons are pressed etc.
    handleEvent: function(e) {
	switch (e.type) {
            // initial load case
            case "load":
		this.init();
            break;
            
            // submission case
            case "submit":
		e.preventDefault();
		if (e.target.id != "url") {
                    return; 
                }
		var url = document.querySelector("#url input");
		
                if (!url.value) {
                    return; 
                }
                this._play(url.value);
            break;
                        
            // handling event when the song ends, playing the next song
            case "ended":
                document.querySelector("#song").innerHTML = "";
		if (this.playlistIndex > -1) { this.next(); }
            break;
            
            // case for when you change the song
            case "change":
		// if its an empty string, just return and don't do anything
                if (!e.target.files.length) { 
                    return; 
                }
                var file = e.target.files[0];
		
                // if its the wrong filetype, just return and don't do anything
                if (!this.testType(file.type)) {
                    return; 
                }
                
                // otherwise set up new file and play the song
                var url = URL.createObjectURL(file);
		this.play(url, file.name);
            break;
	
            // handling when a click is made, typically on buttons
            case "click":
                // shameful hard coding for a pause button, will fix later, oh god why
                if (e.target.id == "pauseP" || e.target.id == "pauseC" || e.target.id == "pauseV"){
                    this.pause();
                }
                // otherwise, do whatever
                else{
                    this[e.target.id]();
                }
            break;
                      
        }
    },
	
    init: function() {
        // check if supports webkit audio
	try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            alert("Get a modern browser dude, you don't support Web Audio. What are you using, Internet Explorer 6?");
            return;
	}

        // add the event listener to check if the song ended
	this.audio.addEventListener("ended", this);
		
        // set up an audio analyser to see the frequency graph, values can be adjusted later
        this.analyser = this.ctx.createAnalyser();
	this.analyser.fftSize = 1024;
	this.analyser.maxDecibels = -20;
	this.analyser.smoothingTimeConstant = 0.5
	this.analyser.connect(this.ctx.destination);

        // create a media source and connect an analyser
	var source = this.ctx.createMediaElementSource(this.audio);
	source.connect(this.analyser);
	this.data = new Uint8Array(this.analyser.frequencyBinCount);

        // building
	this.setupEvents();
        this.next();
        this.paused = false;

        // updates used for time management and synchro
        this.update = this.update.bind(this);
	setInterval(this.update, 30);
    },

    // setupEvents basically adds event listeners to all the interactive components
    setupEvents: function() {
        var forms = [].slice.call(document.querySelectorAll("#musicplayer form"));
        
        forms.forEach(function(form) {
            form.addEventListener("submit", this);
	}, this);
                
        document.querySelector("#musicplayer #prev").addEventListener("click", this);
	document.querySelector("#musicplayer #next").addEventListener("click", this);
        document.querySelector("#musicplayer #pauseP").addEventListener("click", this);
        document.querySelector("#musicplayer #pauseC").addEventListener("click", this);
        document.querySelector("#musicplayer #pauseV").addEventListener("click", this);
        document.querySelector("#musicplayer #file input").addEventListener("change", this);
	document.querySelector("#musicplayer #total").innerHTML = this.playlist.length;
    
    },
    
    // testType checks the file to see if webaudio can play it and returns a boolean
    testType: function(type) {
	if (!this.audio.canPlayType(type)) {
            alert("Sorry, this file type(" + type + ") is not supported.");
            return false;
	}
        else {
            return true;
	}
    },

    // play just plays the file
    play: function(url, name) {
	this.audio.src = url;
	this.audio.play();
        // testing logs
        //console.log(this.audio.volume);
        document.querySelector("#song").innerHTML = name || url;
    },
    
    // pauses the file currently played
    pause: function(){
        // testing logs
        //console.log("hi");
        if (this.paused){
            this.audio.play();
            this.paused = false;
        }
        else{
            this.audio.pause();
            this.paused = true;
        }
    },
    
    // goes to the next song by just increasing playlist index
    next: function() {
        // testing logs
        //console.log("next");
	this.playList(this.playlistIndex+1);
    },
    
    // goes to the previous song by just decreasing playlist index
    prev: function() {
        this.playList(this.playlistIndex-1);
    },
    
    // handles displaying the playlist current song as well as playing songs in the playlist
    playList: function(index) {
        // get playlist index
        this.playlistIndex = (index + this.playlist.length) % this.playlist.length;
	// update current song
        document.querySelector("#musicplayer #current").innerHTML = this.playlistIndex+1;
        // select and play the song
        var item = this.playlist[this.playlistIndex];
	this.play("music/" + item.file, item.name);
    },
	
    update: function() {
        // control the slider
        // it should PROBABLY be it's own action listener rather than shoved into an update function...
        var sliderVolume = document.querySelector("#musicplayer #volume input").value/100;
        if (sliderVolume != this.currentVolume){
            this.audio.volume = sliderVolume;
            this.currentVolume = sliderVolume;
        }
                
        this.analyser.getByteFrequencyData(this.data);
	// current values to be used
	var now = Date.now();
        //console.log("now");
	var value = this.data[0];
        
        // byte frequency differences between current and last value
	var delta = value-this.last.value;
        // time differences between current and last time
	var timeDiff = now - this.last.ts;
		
        // set last value to current value after calculating delta
	this.last.value = value;
        if (timeDiff < this.decay) { /* decay */
            this.last.value = value;
            return;
        }
        
        // control fireworks using delta (difference in byte frequency)
        // this need to be HEAVILY adjusted
        if (delta > 15) {
            this.last.ts = now;
            var force = delta / 50;
            Render.scene.push(new Fireworks(Render.gl, force, delta));
            if (force > 3) { 
                Render.scene.push(new Fireworks(Render.gl, 1, delta)); 
            }
        }
    }
};

window.addEventListener("load", MusicPlayer);
