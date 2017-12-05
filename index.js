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
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws, req) {
	const location = url.parse(req.url, true);
	
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	};
	
	ws.send('something');
});

server.listen(PORT, function listening() {
	console.log('Listening on %d', server.address().port);
});