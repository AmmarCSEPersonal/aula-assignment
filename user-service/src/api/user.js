import httpStatus from 'http-status';
import to from 'await-to-js';
import User from '../models/user';

function api(app){
    app.get('/users', async (request, response, next) => {
        const [error, users] = await to(User.find({}, '-_id -__v'));
        response.send(httpStatus.OK, users);  
        next();
    });
}

export default api;
