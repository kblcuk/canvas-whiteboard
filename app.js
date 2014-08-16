/**
 *
 * Created by kblc on 16/08/14.
 */

var express = require('express');
var app = express();
var server = app.listen(3210, function () {
    console.log('Listening on port %d', server.address().port);
});
var io = require('socket.io')(server);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/canvas.html');
});

var imageData;


// Color palette by Skyblue2u: http://www.colourlovers.com/palette/580974/Adrift_in_Dreams
// Nice one!
var colors = [ "#CFF09E", "#A8DBA8", "#79BD9A", "#3B8686", "#0B486B" ];
var i = 0;

// Each new user gets a different color
io.sockets.on('connection', function (socket) {
    if (i == 5) i = 0;
    socket.emit('setup', colors[i++], imageData);
    // Broadcast all draw clicks.
    socket.on('do-the-draw', function (data) {
        socket.broadcast.emit('draw', data);
        imageData = data.imageData;
    });
// ...and clear clicks as well
    socket.on('clear', function () {
        socket.broadcast.emit('clear');
        imageData = null;
    });
    socket.on('save-data', function (data) {
        imageData = data;
    });
});
