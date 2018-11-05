import restify from 'restify';
import to from 'await-to-js';
import api from './api/user';

async function listen(service){
    api(service, {});
    return await service.listen(8080);
}

export default async function startService(){
    const service = restify.createServer({
        name: 'aula-assignment-users'
    });

    service.use(restify.plugins.acceptParser(service.acceptable));
    service.use(restify.plugins.queryParser());
    service.use(restify.plugins.bodyParser());

    await listen(service);

    return service;
};
