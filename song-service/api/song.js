function api(app){
  app.get('/songs', (req, res, next) => {
    //const [error, rectifications] = await to(Rectification.find({}, '-_id -__v'));
    //res.send(httpStatus.OK, rectifications);  
    //next();
  })

  /*app.get('/movies/premieres', (req, res, next) => {
    repo.getMoviePremiers().then(movies => {
      res.status(httpStatus.OK).json(movies)
    }).catch(next)
  })*/
}

export default api;
