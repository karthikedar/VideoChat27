const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
//For cross server exchange
const cors = require("cors");
const { Server } = require("socket.io");
const io =  new Server(server,{
    cors:{
        origin: "*",
        methods: ["GET","POST"]
    }
});


app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
	res.send('The server is running ');
});

io.on("connection", (socket) => {
	console.log('You are connected');
	socket.emit('me', socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("CallEnded");
		console.log('You are disconnected');
	});

	socket.on('callUser', ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit('callUser', { signal: signalData, from, name });
	});

	socket.on('answerCall', (data) => {
		io.to(data.to).emit('callAccepted', data.signal)
	});
});


server.listen(PORT, () => {
	console.log(`Server is listening on ${PORT}`)}
);
	