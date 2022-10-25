const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
	message: { type: String, },
	sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
	reciever: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
	attachment: { type: String },
	status: { type: String, default: "PENDING" },
},
	{
		timestamps: true
	}
)


const Chat = mongoose.model('chat', chatSchema);

module.exports = Chat;