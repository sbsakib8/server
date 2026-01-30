import express from 'express';
import {
    startConversation,
    sendMessage,
    getMessages,
    getConversations
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/conversation', startConversation);
router.get('/conversations', getConversations);
router.route('/')
    .post(sendMessage);
router.get('/:conversationId', getMessages);

export default router;
