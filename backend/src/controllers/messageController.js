import Message from "../models/messageModel.js";

// POST send message
const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id; 
    const role = "user";

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const message = await Message.create({ userId, content, role});
    return res.status(201).json({message});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: "Server error"});
  }
};

// GET all message user
const getMessages = async(req,res) => {
    try {
        const userId = req.user.id;
        const messages = await Message.find({userId}).sort({createAt: 1});
        res.json({messages});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Server error"});
    }
}

export {sendMessage, getMessages};
