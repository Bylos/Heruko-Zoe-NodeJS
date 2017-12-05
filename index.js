const express = require('express')
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const PORT = process.env.PORT || 5687
const app = express();

app.post('/', function (req, res) {
	res.json({ 'speech': 'bla bla bla', 'displayText': 'bla bla bla' });
	console.log('We did have a request');
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server:server, path:"/ws" });

wss.on('connection', function connection(ws, req) {
	const location = url.parse(req.url, true);
	console.log('New ws connection from  - waiting for info');
	
	ws.on('message', function incoming(message) {
		var jsonContent = JSON.parse(message);
		// check for info content
		if( jsonContent.hasOwnProperty('device') && jsonContent.hasOwnProperty('room')) {
			this.room = jsonContent.device;
			this.device = jsonContent.room;
			console.log('Device', this.device, 'in room', this.room, 'was added, total:', wss.clients.length);
		}
		else {
			console.log('Unknown message from a ws :', message);
		}
	});
	
	ws.on('close', function closing(code, reason) {
		console.log('Device', this.device, 'in room', this.room, 'disconnected with code', code, 'total', wss.clients.length);
	});
});

server.listen(PORT, function listening() {
	console.log('Listening on %d', server.address().port);
});