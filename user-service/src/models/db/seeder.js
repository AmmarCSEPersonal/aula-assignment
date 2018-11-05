import to from 'await-to-js';
import connectMongo from './db-client';
import seeds from './seeds/users';
import User from '../user';

(async function(){
    const sequence = [connectMongo, ()=>User.remove(), ()=>User.insertMany(seeds)];
    for(let step of sequence){
        let [error, success] = await to(step());
        if(error){
            console.error(error);
            return;
        }
    }
    process.exit();
})();
