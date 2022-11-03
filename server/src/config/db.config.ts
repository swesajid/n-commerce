import mongoose from 'mongoose';
import { error, info } from './logger';

const NAMESPACE = 'Database';

export const connectDB = (): void => {
    const url = process.env.DATABASE_URL as string;
    mongoose.connect(url);
    const db = mongoose.connection;

    db.on('error', (err) => error(NAMESPACE, 'Connection Problem', err));
    db.once('open', () => info(NAMESPACE, 'Connected to Mongodb'));
};
