import restify from 'restify';
import to from 'await-to-js';
import connectMongo from './models/db/db-client';
import api from './api/user';
import config from '../config';

async function launchSequence(service) {
    const sequence = [connectMongo, ()=>listen(service)];
    for(let step of sequence){
        let [error, success] = await to(step());
        if(error){
            console.error(error);
            return;
        }
    }

    console.log('%s listening at %s', service.name, service.url);
}

async function listen(service){
    api(service, {});
    return await service.listen();
}

export default async function startService(){
    const service = restify.createServer({
        name: config.appName,
        version: config.appVersion
    });

    service.use(restify.plugins.acceptParser(service.acceptable));
    service.use(restify.plugins.queryParser());
    service.use(restify.plugins.bodyParser());

    await launchSequence(service);

    return service;
};
