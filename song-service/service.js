import restify from 'restify';
import api from './api/song';

async function listen(service){
    api(service, {});
    return await service.listen(8080);
}

export default async function startService(){
    const service = restify.createServer({
        name: 'aula-song-service'
    });

    service.use(restify.plugins.acceptParser(service.acceptable));
    service.use(restify.plugins.queryParser());
    service.use(restify.plugins.bodyParser());

    await listen(service);

    return service;
};
