import mongoose from 'mongoose';
const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    uri: { type: String, required: true },
    artist: { type: String },
    length: { type: String },
    genre: { type: String },
    format: { type: String },
    publisher: { type: String }
});
 
export default mongoose.model('Song', songSchema);
