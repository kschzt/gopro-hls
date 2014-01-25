var request = require('request')
var through = require('through')
var m3u8 = require('m3u8')

module.exports = function hlsStream(url) {
	var dirname = url.substring(0, url.lastIndexOf('/') + 1)

	var stream = through(function write(d) {
		this.emit('data', d)
	})

	var thisItem, previousItem

	// get m3u8, get next ts item; loop
	// only ever considers the last ts item in the m3u8
	function pull() {
		var parser = m3u8.createStream()

		request(url).pipe(parser)

		parser.on('item', function(item) {
			thisItem = item.get('uri')
		})

		parser.on('end', function() {
			if (thisItem === previousItem)
				return pull()

			previousItem = thisItem

			request(dirname + thisItem)
				.on('end', pull)
				.pipe(stream, { end: false })
		})
	}

	pull()

	return stream
}


