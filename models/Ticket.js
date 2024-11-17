import mongoose from 'mongoose';
import {stringify, v4 as uuidv4} from 'uuid';

const ticketSchema = new mongoose.Schema({
    id: {type: String, default: uuidv4},
    user: {type: String, require: true},
    createdAt: {type: Date, default: Date.now()},
    status: {type: String, enum: ['open', 'in-progress', 'closed'], default: 'open'},
    priority: {type: String, enum: ['low', 'medium', 'high'], default: 'low'},
    title: {type: String, require: true},
    description: {type: String, require: true}
},{
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
        },
        virtuals: true
    }
});

ticketSchema.index({id: 1, user: 1});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;