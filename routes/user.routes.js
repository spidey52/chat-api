const { Router } = require('express')
const User = require('../models/user.model');
const sendError = require('../utils/error/sendError');

const router = Router()

router.get('/', async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	try {
		const users = await User.find({}).limit(limit).skip(+limit * (page - 1));
		return res.send(users);
	} catch (error) {
		sendError(res, error)
	}
})

router.post('/', async (req, res) => {
	try {
		const { username } = req.body;
		const user = await User.create({ username })
		return res.send(user)
	} catch (error) {
		sendError(res, error);
	}
})

router.post('/login', async (req, res) => {
	try {
		const { username } = req.body;
		const user = await User.findOne({ username });
		if (!user) return res.status(404).send({ message: 'user not found with username ' + username })
		return res.send({ user, token: `user._id:user.username` });
	} catch (error) {
		sendError(res, error);
	}
})


module.exports = router;