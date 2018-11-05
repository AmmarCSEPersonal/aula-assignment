import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    username: { type: String, required: true }
    //we dont need these for now but any other user information
    //should be minimal and directly tied to the user himself since this is a service
    /*age: { type: String, required: true },
    sex: { type: String },
    yada: { type: String },
    yada: { type: String }*/
});
 
export default mongoose.model('User', userSchema);
