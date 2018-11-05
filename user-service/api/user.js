import httpStatus from 'http-status';

function api(app){
    app.get('/users', async (request, response, next) => {
        const users = [];
        response.send(httpStatus.OK, users);  
        next();
    });
}

export default api;
