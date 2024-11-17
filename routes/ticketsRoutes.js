import express from 'express';
import Ticket from '../models/Ticket.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
import pagination from '../middlewares/pagination.js';
import buildFilter from '../middlewares/filter.js';
import ticketSchema from '../validations/ticketValidation.js';

const router = express.Router();
// GET api/tickets?page=1&pageSize=10$search=filtro&status=open&priority=high
router.get('/', buildFilter, pagination(Ticket), async (req, res) => {
    res.status(200).json(req.paginationResults);
});
// POST api/tickets
router.post('/', auth, async (req, res) => {
    const {error} = ticketSchema.validate(req.body);
    if(error)
        return res.status(400).json({message: error.details[0].message});
    const ticket = new Ticket({
        user: req.user._id,
        title: req.body.title,
        description: req.body.description,
        priority: req.body.priority,
        status: req.body.status
    });

    try {
        const newTicket = await ticket.save();
        res.status(201).json({ticket: newTicket});
    } catch (error) {
        res.status(500).json({message: 'Server error ' + error.message});
    }
});
// GET api/tickets/:id
router.get('/:id', async (req, res) => {
    try {
        //const ticket = await Ticket.findById(req.params.id);
        const ticket = await Ticket.findOne({id: req.params.id});
        if(!ticket) return res.status(404).json({message: 'ticket not found'});
        res.status(200).json({ticket: ticket});
    } catch (error) {
        res.status(500).json({message: 'Server error ' + error.message});
    }
});
// PUT api/tickets/:id
router.put('/:id', auth, async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if(!ticket) return res.status(404).json({message: 'ticket not found'});
        res.status(200).json({ticket: ticket});
    } catch (error) {
        res.status(500).json({message: 'Server error ' + error.message});
    }
});
// DELETE api/tickets/:id
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const ticket = await Ticket.findOneAndDelete({id: req.params.id});
        if(!ticket) return res.status(404).json({message: 'ticket not found'});
        res.status(200).json({ticket: ticket});
    } catch (error) {
        res.status(500).json({message: 'Server error ' + error.message});
    }
});

export default router;