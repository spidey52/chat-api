const { Router } = require('express')
const Chat = require('../models/chat.model')
const sendError = require('../utils/error/sendError')

const router = Router()

router.get('/', async (req, res) => {
	const { limit = 10, page = 1, sender, reciever } = req.query
	console.log(sender, reciever);

	try {
		const searchQuery = { $or: [{ sender, reciever }, { sender: reciever, reciever: sender }] }


		// const chats = await Chat.find({ sender: { $in: [sender, reciever] }, reciever: { $in: [sender, reciever] } }).limit(limit).skip(+limit * (page - 1)).sort({createdAt: -1});
		const chats = await Chat.find(searchQuery).limit(limit).skip(+limit * (page - 1)).sort({ createdAt: -1 });
		return res.send(chats.reverse());
	} catch (error) {
		sendError(res, error);
	}
})

router.post('/', async (req, res) => {
	try {
		const { sender, reciever, message } = req.body;
		const chat = await Chat.create({ sender, reciever, message });
		return res.send(chat);
	} catch (error) {
		sendError(res, error);
	}
})



module.exports = router




