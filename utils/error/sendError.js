const sendError = (res, error) => {
	return res.status(500).send({message: error.message})
}

module.exports = sendError