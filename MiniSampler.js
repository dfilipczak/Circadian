// define variables



var MiniSampler = function(audioContext, gainNode_) {
	this.source;
	// this.path = path_;
	this.audioCtx = audioContext;
	this.gainNode = gainNode_;
	this.source = this.audioCtx.createBufferSource();

	
	// this.detune = detune || 0;



	// this.twelfthRootOfTwo = 0.05946309436;



}

MiniSampler.prototype.getData = function(path_, detune_, stop) {
	var self = this;
	self.path = path_;
	self.detune = detune_;
	// this.source = this.audioCtx.createBufferSource();
	var request = new XMLHttpRequest();
	// console.log([self.path, 'requestpath'])

	request.open('GET', self.path, true);

	request.responseType = 'arraybuffer';


	request.onload = function() {
		var audioData = request.response;

		self.audioCtx.decodeAudioData(audioData, function(buffer) {
				self.source.buffer = buffer;
				// console.log(1 + (self.twelfthRootOfTwo * self.detune))
				self.source.playbackRate.value = midiRatio(self.detune);
				self.source.connect(self.gainNode);
				self.source.loop = true;
				// self.source.loopStart = 1;
				// self.source.loopEnd = 3;
				self.source.onended = function(event){
					console.log('end')
				}
				console.log('decoded')

				self.source.start();
				self.source.stop(self.audioCtx.currentTime+stop);
			},

			function(e) {
				console.log("Error with decoding audio data " + e.err);
			});

	}

	request.send();
}

MiniSampler.prototype.stop = function(when){
	this.source.stop(this.audioCtx.currentTime + when);
}


function midiRatio(nn){
	return Math.pow(Math.pow(2, nn), 1/12);
}


// var source = 1;
// window.onload = function() {


	// source;

	// var pre = document.querySelector('pre');
	// var myScript = document.querySelector('script');
	// var play = document.querySelector('.play');
	// var stop = document.querySelector('.stop');


	// var playbackControl = document.querySelector('.playback-rate-control');
	// var playbackValue = document.querySelector('.playback-rate-value');
	// playbackControl.setAttribute('disabled', 'disabled');
	// var loopstartControl = document.querySelector('.loopstart-control');
	// var loopstartValue = document.querySelector('.loopstart-value');
	// loopstartControl.setAttribute('disabled', 'disabled');
	// var loopendControl = document.querySelector('.loopend-control');
	// var loopendValue = document.querySelector('.loopend-value');
	// loopendControl.setAttribute('disabled', 'disabled');

	// use XHR to load an audio track, and
	// decodeAudioData to decode it and stick it in a buffer.
	// Then we put the buffer into the source



	// wire up buttons to stop and play audio

// 	play.onclick = function() {
// 		getData();
// 		source.start(0);
// 		play.setAttribute('disabled', 'disabled');
// 	}

// 	stop.onclick = function() {
// 		source.stop(0);
// 		play.removeAttribute('disabled');
// 	}



// 	playbackControl.oninput = function() {
// 		source.playbackRate.value = playbackControl.value;
// 		playbackValue.innerHTML = playbackControl.value;
// 	}
// 	loopstartControl.oninput = function() {
// 		source.loopStart = loopstartControl.value;
// 		loopstartValue.innerHTML = loopstartControl.value;
// 	}
// 	loopendControl.oninput = function() {
// 		source.loopEnd = loopendControl.value;
// 		loopendValue.innerHTML = loopendControl.value;
// 	}



// 	// dump script to pre element

// 	pre.innerHTML = myScript.innerHTML;
// }