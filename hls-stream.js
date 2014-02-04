"use strict";

var request = require('request')
var through = require('through')

var ITEM_TIMEOUT_MS = 1000
var CAMERA_TIMEOUT_MS = 10 * 1000

module.exports = function hlsStream(url) {
	var dirname = url.substring(0, url.lastIndexOf('/') + 1)

	var stream = through(function write(d) {
		this.emit('data', d)
	})

	var previousItem

	// get m3u8, get next ts item; loop
	// only ever considers the last ts item in the m3u8
	function pull() {
		request({
			url: url,
			timeout: CAMERA_TIMEOUT_MS
		}, function(err, _res, body) {
			if (err) {
				console.warn('err:', err.toString())
				return setTimeout(pull, CAMERA_TIMEOUT_MS)
			}

			var thisItem = body.trim().split('\n').pop()

			if (thisItem === previousItem)
				return pull()

			previousItem = thisItem

			request({
				url: dirname + thisItem,
				timeout: ITEM_TIMEOUT_MS
			})
				.on('end', pull)
				.pipe(stream, { end: false })
		})
	}

	pull()

	return stream
}


