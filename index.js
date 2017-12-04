const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5687

const app = express()

app.post('/', function (req, res) {
	res.json({'speech': 'bla bla bla', 'displayText': 'bla bla bla'});
	console.log('We did have a request');
})

app.listen(PORT, function () {
	console.log('Example app listening on port zz!');
})