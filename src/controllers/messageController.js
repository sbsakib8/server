import { Message, Conversation } from '../models/Message.js';

// @desc    Start/Get a conversation
// @route   POST /api/messages/conversation
// @access  Private
export const startConversation = async (req, res) => {
    try {
        const { recipientId } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, recipientId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user._id, recipientId]
            });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
    try {
        const { conversationId, text } = req.body;

        const message = await Message.create({
            conversation: conversationId,
            sender: req.user._id,
            text
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text,
            lastSender: req.user._id
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get messages for a conversation
// @route   GET /api/messages/:conversationId
// @access  Private
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ conversation: req.params.conversationId })
            .populate('sender', 'name profile')
            .sort('createdAt');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all user conversations
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user._id] }
        }).populate('participants', 'name email profile')
            .sort('-updatedAt');
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
