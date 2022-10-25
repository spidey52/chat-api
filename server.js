require('dotenv').config()
const express = require("express");
const { createServer } = require("http");
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const { Server } = require("socket.io");
const { CLIENT_SENT_MESSAGE, SERVER_SENT_MESSAGE } = require("./events/message.event");
const Chat = require("./models/chat.model");

const app = express();
const httpServer = createServer(app);
app.use(morgan('dev'));
app.use(express.json())
app.use(require('cors')())
const io = new Server(httpServer, {
	cors: {
		origin: "*",
		methods: "*"
	}
});
const userRouter = require('./routes/user.routes');
const msgRouter = require('./routes/chat.routes');
const onlineUsers = require("./store/users");

app.use('/users', userRouter)
app.use('/messages', msgRouter)

let count = 0;

app.get('/online-users', (req, res) => {
	return res.send(onlineUsers)
})

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId
	count++;
	onlineUsers[userId] = socket.id;

	socket.on(CLIENT_SENT_MESSAGE, async ({ sender, reciever, message }) => {
		const isOnline = onlineUsers[reciever];
		const chat = await Chat.create({ sender, reciever, message, status: isOnline ? "DELIEVERED" : "PENDING" });
		const recievers = [socket.id]
		if (isOnline) recievers.push(isOnline)
		io.to(recievers).emit(SERVER_SENT_MESSAGE, chat);

		// if (isOnline) io.to(isOnline).emit(SERVER_SENT_MESSAGE, chat);
	})

	socket.on('disconnect', () => {
		delete onlineUsers[userId];
		count--;
	})
});

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
	console.log('MONGODB_URI is required in env variables.')
	process.exit(1)
}
mongoose.connect(MONGODB_URI).then(res => console.log('connected')).catch(err => console.log(err.message))

const PORT = process.env.PORT || 4000

httpServer.listen(PORT, () => {
	console.log('server is listening on port ', PORT);
});
