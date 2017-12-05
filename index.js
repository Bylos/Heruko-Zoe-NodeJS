const express = require('express')
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const PORT = process.env.PORT || 5687
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server:server, path:"/ws", clientTracking:true });

// manage new websocket server connections here and add methods
wss.on('connection', function connection(ws, req) {
	// url parsing could serve later to authenticate devices
	const location = url.parse(req.url, true);
	console.log('New ws connection from  - waiting for info', this.clients.size);
	
	// message received from an active connection
	ws.on('message', function incoming(message) {
		var jsonContent = JSON.parse(message);
		// check for info content
		if( jsonContent.hasOwnProperty('device') && jsonContent.hasOwnProperty('room')) {
			this.room = jsonContent.device;
			this.device = jsonContent.room;
			console.log('Device', this.device, 'in room', this.room, 'was added, total:', wss.clients.size);
		}
		// check for command or state response here
		// default is unknown
		else {
			console.log('Unknown message from a ws :', message);
		}
	});
	
	// log disconnection for debug
	ws.on('close', function closing(code, reason) {
		console.log('Device', this.device, 'in room', this.room, 'disconnected with code', code, 'total', wss.clients.size);
	});
});

server.post('/', function (req, res) {
	res.json({ 'speech': 'bla bla bla', 'displayText': 'bla bla bla' });
	console.log('We did have a request');
});

server.listen(PORT, function listening() {
	console.log('Listening on %d', server.address().port);
});