import request from 'supertest';
import mongoose from "mongoose";
import app from '../app.js';
import server from '../server.js'
import User from '../models/User.js';

describe('Users API', () => {
    beforeAll(async () => {
        await User.deleteMany();
    });

    afterAll(async () => {
        await server.close();
        await mongoose.connection.close();
    });

    test('create a new user', async () => {
        const response = await request(app)
            .post('/api/users/signup')
            .send({
                name: 'Test User',
                email: 'ttest@gamail.com',
                password: '12345678',
                role: 'user'
            });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');
    });

    test('login a registred user', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'ttest@gamail.com',
                password: '12345678',
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('token');
    });

    test('login a NO registred user', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'not@gamail.com',
                password: '12345678',
            });
        expect(response.status).toBe(400);
    });
});