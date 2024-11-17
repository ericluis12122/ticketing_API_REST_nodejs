import mongoose from "mongoose";
import {v4 as uuidv4} from 'uuid';
import Ticket from '../models/Ticket.js';
import User from '../models/User.js';

// connect to the local database
mongoose.connect('mongodb://localhost:27017/ticketsDB')
    .then(() => console.log('Connect to DB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

const users = [
    {name: 'user', role: 'user', email: 'user@gmail.com', password: '12345678'},
    {name: 'admin', role: 'admin', email: 'admin@gmail.com', password: '12345678'}
];

const status = ['open', 'in-progress', 'closed'];
const priorities = ['low', 'medium', 'high'];

async function deleteCollections() {
    await User.deleteMany({});
    console.log('Users collection deleted');
    await Ticket.deleteMany({});
    console.log('Tickets collection deleted');
}

async function createUsers() {
    for (const userData of users) {
        const user = new User(userData);
        await user.save();
    }
}

async function createTickets() {
    const users = await User.find({});
    for (let i = 1; i <= 15; i++) {
        const ticket = new Ticket({
            title: `Ticket #${i}`,
            description: `This is description for ticket #${i}`,
            status: status[Math.floor(Math.random() * status.length)],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            user: users[Math.floor(Math.random() * users.length)].id
        });
        await ticket.save();
    }
}

async function populateDB() {
    await deleteCollections();
    await createUsers();
    await createTickets();
    console.log('Database populated');
    mongoose.disconnect();
}

populateDB();