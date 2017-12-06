const express = require('express')
const bodyParser = require('body-parser')
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

const PORT = process.env.PORT || 5687
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server:server, path:"/ws", clientTracking:true });

// manage websocket connections from devices
wss.on('connection', function connection(ws, req) {
	// url parsing could serve later to authenticate devices
	const location = url.parse(req.url, true);
	console.log('New ws connection from  - waiting for info', this.clients.size);
	
	// message received from an active connection
	ws.on('message', function incoming(message) {
		var jsonContent = JSON.parse(message);
		// check for info content
		if (jsonContent.hasOwnProperty('device') && jsonContent.hasOwnProperty('room')) {
			this.room = jsonContent.device;
			this.device = jsonContent.room;
			this.registered = true;
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

// manage requests from dialogflow
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.post('/', function (req, res) {
	var found = false;
	var parameters = req.body.result.parameters;
	if (parameters !== undefined) {
		var device = parameters.device;
		var room = parameters.room;
		var action = parameters.action;
		if (device !== undefined && room !== undefined && action !== undefined) {
			for (let client of wss.clients) {
				if (client.hasOwnProperty('registered')) {
					if (client.room == room && client.device == device) {
						client.send(JSON.stringify(parameters));
						found = true;
					}
				}
			}
			if (found == true) {
				res.json({ 'speech': 'C\'est fait', 'displayText': 'C\'est fait' });
			}
			else {
				res.json({ 'speech': 'Je n\'ai pas trouvé cet objet', 'displayText': 'Je n\'ai pas trouvé cet objet' });
			}
		}
	}
	else {
		console.log('Unhandled HTTP POST request');
	}
});

server.listen(PORT, function listening() {
	console.log('Listening on %d', server.address().port);
});