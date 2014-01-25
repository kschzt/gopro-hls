# gopro-hls

Simple thingy to read the GoPro video HLS stream and wrap it into a constant stream for streaming to multiple clients.

## why?

Exposing the multi-file, M3U8-rotation based GoPro HLS stream to the world doesn't work, because the clients need to constantly reconnect to the stream and the GoPro can't handle multiple clients. 

This takes the multi-file, segmented GoPro HLS stream and wraps it into a constant stream that can be **properly buffered and proxied**.

## how?

1. Camera WiFi must be in GoPro App mode
1. First, check that http://10.5.5.9:8080/live/amba.m3u8 works in VLC
1. ```node server```
1. Open in Safari: http://localhost:8000/
1. Set up nginx to proxy and buffer it

### nginx

        location /camera/ {
                proxy_pass http://localhost:8000/;
                proxy_buffering on;
                proxy_buffers 8 64k;
        }

