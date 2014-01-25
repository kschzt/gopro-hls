"use strict";

var fs = require('fs')

var goProHlsUrl = 'http://anode/gopro/amba.m3u8'
var stream = require('./hls-stream')(goProHlsUrl);

stream.pipe(fs.createWriteStream('out.mp4'))

