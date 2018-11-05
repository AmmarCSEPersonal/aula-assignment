import httpStatus from 'http-status';
import to from 'await-to-js';
import Song from '../models/song';

function api(app){
  app.get('/songs', async (request, response, next) => {
    const [error, songs] = await to(Song.find({}, '-_id -__v'));
    response.send(httpStatus.OK, songs);  
    next();
  })

  /*app.get('/movies/premieres', (req, res, next) => {
    repo.getMoviePremiers().then(movies => {
      res.status(httpStatus.OK).json(movies)
    }).catch(next)
  })*/
}

export default api;
