import request from 'supertest';
import mongoose from "mongoose";
import app from '../app.js';
import server from '../server.js'
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';

describe('Tickets API', () => {
    let token;
    beforeAll(async () => {
        await User.deleteMany();
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'test@gamail.com',
                password: '12345678',
                role: 'user'
            });
        token = response.body.token;
    });

    beforeEach(async () => {
        await Ticket.deleteMany();
    });

    afterAll(async () => {
        await server.close();
        await mongoose.connection.close();
    });

    test('create a new ticket', async () => {
        const response = await request(app)
            .post('/api/tickets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Ticket',
                description: 'Test ticket description',
                priority: 'high',
                status: 'open'
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('ticket');
    });
});