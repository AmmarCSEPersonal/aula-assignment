import to from 'await-to-js';
import connectMongo from './db-client';
import seeds from './seeds/songs';
import Song from '../song';

(async function(){
    const sequence = [connectMongo, ()=>Song.remove(), ()=>Song.insertMany(seeds)];
    for(let step of sequence){
        let [error, success] = await to(step());
        if(error){
            console.error(error);
            return;
        }
    }
    process.exit();
})();
