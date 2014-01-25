"use strict";

var fs = require('fs')
var connect = require('connect')

var goProHlsUrl = 'http://10.5.5.9:8080/live/amba.m3u8'

var video = require('./hls-stream')(goProHlsUrl)

var template = fs.readFileSync('./gopro.m3u8')
var indexHtml = fs.readFileSync('./index.html')

var app = connect()

	.use(connect.logger({ format: 'dev' }))

	.use('/gopro.m3u8', function(req, res) {
		var pls = template
			.toString()
			.replace(/__sequence/g, Date.now())

		res.writeHead(200, {
			'Content-Type': 'application/vnd.apple.mpegurl',
			'Content-Length': pls.length
		})

		res.end(pls)
	})

	.use('/gopro.ts', function(req, res) {
		res.writeHead(200, {
			'Content-Type': 'video/ts'
		})

		video.pipe(res)
	})

	.use('/', function(req, res) {
		res.writeHead(200, {
			'Content-Type': 'text/html',
			'Content-Length': indexHtml.length
		})

		res.end(indexHtml);
	})

	.use(connect.errorHandler())
	.listen(8000)

