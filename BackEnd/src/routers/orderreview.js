import express from 'express';
import { createOrderComment, getByIdOrderComment, getOrderComments, removeOrderComment, replyToOrderComment, updateOrderComment } from '../controllers/orderreview.js';

const router = express.Router();

router.get('/ordercomments', getOrderComments);
router.post('/ordercomments', createOrderComment);
router.delete('/ordercomments/:id', removeOrderComment);
router.patch('/ordercomments/:id', updateOrderComment)
router.get('/ordercomments/:id', getByIdOrderComment)
router.post('/comments/:id/reply', replyToOrderComment)





export default router;
