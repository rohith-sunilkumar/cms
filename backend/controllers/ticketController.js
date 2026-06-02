import Ticket from '../models/Ticket.js';

// Calculate SLA deadline based on priority
const calculateSLA = (priority) => {
    const now = new Date();
    switch (priority) {
        case 'critical':
            return new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours
        case 'high':
            return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        case 'medium':
            return new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours
        case 'low':
            return new Date(now.getTime() + 72 * 60 * 60 * 1000); // 72 hours
        default:
            return new Date(now.getTime() + 48 * 60 * 60 * 1000);
    }
};

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res) => {
    const { title, description, priority } = req.body;

    try {
        const ticket = new Ticket({
            title,
            description,
            priority,
            creator: req.user._id,
            slaDeadline: calculateSLA(priority)
        });

        const createdTicket = await ticket.save();
        res.status(201).json(createdTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tickets (role based)
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res) => {
    try {
        let tickets;
        if (req.user.role === 'admin' || req.user.role === 'superadmin') {
            // Admins and SuperAdmins see all tickets
            tickets = await Ticket.find({}).populate('creator', 'name email').sort({ createdAt: -1 });
        } else {
            // Users see their own tickets
            tickets = await Ticket.find({ creator: req.user._id }).populate('creator', 'name email').sort({ createdAt: -1 });
        }
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('creator', 'name email')
            .populate('assignedTo', 'name email')
            .populate('responses.sender', 'name email role');

        if (ticket) {
            // Check authorization
            if (req.user.role === 'user' && ticket.creator._id.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to view this ticket' });
            }
            res.json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ticket status/priority
// @route   PUT /api/tickets/:id
// @access  Private/Admin
export const updateTicket = async (req, res) => {
    const { status, priority, assignedTo } = req.body;

    try {
        const ticket = await Ticket.findById(req.params.id);

        if (ticket) {
            if (status) ticket.status = status;
            if (priority) {
                ticket.priority = priority;
                ticket.slaDeadline = calculateSLA(priority);
            }
            if (assignedTo) ticket.assignedTo = assignedTo;

            const updatedTicket = await ticket.save();
            res.json(updatedTicket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add response to ticket
// @route   POST /api/tickets/:id/responses
// @access  Private
export const addTicketResponse = async (req, res) => {
    const { message } = req.body;

    try {
        const ticket = await Ticket.findById(req.params.id);

        if (ticket) {
            // Check authorization
            if (req.user.role === 'user' && ticket.creator.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to respond to this ticket' });
            }

            const response = {
                sender: req.user._id,
                message
            };

            ticket.responses.push(response);

            // Change status to in-progress if admin responds to an open ticket
            if (req.user.role === 'admin' && ticket.status === 'open') {
                ticket.status = 'in-progress';
            }

            await ticket.save();
            res.status(201).json(ticket);
        } else {
            res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
