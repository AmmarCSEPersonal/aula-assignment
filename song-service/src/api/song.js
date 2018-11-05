import httpStatus from 'http-status';
import to from 'await-to-js';
import Song from '../models/song';

function api(app){
    app.get('/songs', async (request, response, next) => {
        const [error, songs] = await to(Song.find({}, '-_id -__v'));
        response.send(httpStatus.OK, songs);  
        next();
    });

    app.get('/songs/:genre', async (request, response, next) => {
        const {genre} = request.params;
        const [error, songs] = await to(Song.find({ genre }, '-_id -__v'));
        response.send(httpStatus.OK, songs);  
        next();
    });
}

export default api;
