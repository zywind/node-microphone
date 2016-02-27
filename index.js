var isMacOrWin = require('os').type() == 'Darwin' || require('os').type().indexOf('Windows') > -1;
var spawn = require('child_process').spawn;
var PassThrough = require('stream').PassThrough;

var ps = null;

var audio = new PassThrough;
var info = new PassThrough;

var start = function(options) {    
    if(ps == null) {
        ps = isMacOrWin
        // Must use -q option to hide the sox progress, otherwise the info stream
        // is clogged and somehow stops the audio stream after 84 seconds.
        ? spawn('rec', options || ['-t', 's16', '-r', '44100', '-c', '2', '-q', '-'])
        : spawn('arecord', options || ['-D', 'plughw:0,0', '-f', 'cd']);

        ps.stdout.pipe(audio);
        ps.stderr.pipe(info);
    }
};

var stop = function() {
    if(ps) {
        ps.kill();
        ps = null;
    }
};

exports.audioStream = audio;
exports.infoStream = info;
exports.startCapture = start;
exports.stopCapture = stop;
