import mongoose from 'mongoose';
import config from '../../../config';

export default async function connectMongo() {
    const options = { service: { socketOptions: { keepAlive: 1 } } };
    return await mongoose.connect(config.dbUri, options);
}
