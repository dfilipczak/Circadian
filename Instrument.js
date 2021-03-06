var ac = new(window.AudioContext || window.webkitAudioContext)();

Number.prototype.linlin = function (in_min, in_max, out_min, out_max) {
	//map a linear range to another linear range
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


var Instrument = function(audioContext){

	this.audioCtx = audioContext;
	this.panNode = this.audioCtx.createStereoPanner();
    this.panNode.connect(this.audioCtx.destination);

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.connect(this.panNode);
    this.sampler = new MiniSampler(this.audioCtx, this.gainNode)


}



Instrument.prototype.play = function(nn, when, stop){

	if(nn>this.range.high || nn<this.range.low){
		console.log('the note ' + nn + ' is out of range - this instrument can play from ' + this.range.low + ' to ' + this.range.high);
		// if(this.sampler){this.stop()};
		return;
	}

	if(this.sampler){
		// this.stop();
	}
	var lag = when || 0.1;
	var scale = nn.linlin(this.range.low, this.range.high, 0, this.samples.length-1);
	var index = Math.round(scale);
	var detune = Math.round((scale - index).linlin(0, this.samples.length-1, this.range.low, this.range.high)-this.range.low);
	// var path = 'samples/' + this.samples[index] + '.wav';
	var path = this.samples[index];
	console.log({
		'path':path,
		'index':index,
		'detune':detune,
		'scale':scale
	})

	this.sampler.getData(path, detune, stop);

}



Instrument.prototype.stop = function(when){
	var self = this;
	var lag = when || 0.05;
	this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + lag);
	setTimeout(function(){
		self.gainNode.gain.exponentialRampToValueAtTime(1, self.audioCtx.currentTime + lag + 0.1);
	}, lag);
	self.sampler.stop(lag);
	
}


Instrument.prototype.gain = function(value_, when){

	var lag = when || 0.1;
	var value = value_;

	if(value <= 0){
		value = 0.000000001
	}

	this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
	this.gainNode.gain.exponentialRampToValueAtTime(value, this.audioCtx.currentTime + lag);

}

Instrument.prototype.pan = function(value, when){
	
	var self = this;
	var lag = when || 0.1;
	this.panNode.pan.cancelScheduledValues(this.audioCtx.currentTime);
	self.panNode.pan.linearRampToValueAtTime(value, self.audioCtx.currentTime + lag);

}