import httpStatus from 'http-status';

function api(app){
  app.get('/songs', (req, res, next) => {
    //const [error, rectifications] = await to(Rectification.find({}, '-_id -__v'));
    const songs = [];
    res.send(httpStatus.OK, songs);  
    next();
  })

  /*app.get('/movies/premieres', (req, res, next) => {
    repo.getMoviePremiers().then(movies => {
      res.status(httpStatus.OK).json(movies)
    }).catch(next)
  })*/
}

export default api;
