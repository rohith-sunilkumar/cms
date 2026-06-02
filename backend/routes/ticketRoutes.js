import express from 'express';
import { 
    createTicket, 
    getTickets, 
    getTicketById, 
    updateTicket, 
    addTicketResponse 
} from '../controllers/ticketController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createTicket)
    .get(protect, getTickets);

router.route('/:id')
    .get(protect, getTicketById)
    .put(protect, admin, updateTicket);

router.route('/:id/responses')
    .post(protect, addTicketResponse);

export default router;
