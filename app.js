import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import usersRoutes from './routes/usersRoutes.js';
import ticketsRoutes from './routes/ticketsRoutes.js'
import error from './middlewares/error.js';
import limiter from './helpers/rateLimit.js';

const app = express();
const DB_URL = process.env.NODE_ENV === 'test'
? 'mongodb://localhost:27017/ticketsDB_test'
: process.env.DB_URL || 'mongodb://localhost:27017/ticketsDB';

mongoose.connect(DB_URL)
.then(() => console.log(`Connected to DB: ${DB_URL}`))
.catch(err => console.error('Failed to connect to MongoDB', err));

app.use(morgan('dev'));
app.use(helmet);
app.use(cors);
if(process.env.NODE_ENV === 'prod') {
    app.use(compression);
    app.use(limiter);
}
app.use(express.json());

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use('/api/users', usersRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use(error);

export default app;